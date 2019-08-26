import yargs from 'yargs'
import chalk from 'chalk'

// Ensure .env is loaded before process.env is used elsewhere
import config from '../config'

import fetchAllBunqPayments from '../util/fetchAllBunqPayments'
import fetchClassifiedPaymentIds from '../util/fetchClassifiedPaymentIds'
import preProcessPayment from '../util/preProcessPayment'
import printPayment from '../util/printPayment'
import promptCategory from '../util/promptCategory'
import setPaymentCategory from '../util/setPaymentCategory'
import fetchClassifier from '../util/fetchClassifier'
import { prepareInput, selectCategory } from '../util/neuralNetwork'
import knex from '../knex'

const start = async () => {
  console.log(chalk.bold('=> Fetching Bunq payments'))
  console.log(
    'This might take a while (depending on how much you are spending)..',
  )

  const newerId: number = !yargs.argv.all
    ? await knex
        .from('payments')
        .max('id AS id')
        .limit(1)
        .then((rows: any[]) => (rows[0] && rows[0].id) || 0)
    : 0
  console.log('Starting from transaction ID #%d', newerId)

  const allPayments: any[] = await fetchAllBunqPayments(newerId)
  console.log('Total payments:', allPayments.length)

  console.log(chalk.bold('=> Determining unclassified payments'))
  const classifiedPaymentIds: number[] = await fetchClassifiedPaymentIds()
  const unclassifiedPayments: any[] = allPayments.filter(
    payment => !classifiedPaymentIds.includes(payment.id),
  )
  console.log('Total unclassified payments:', unclassifiedPayments.length)

  console.log(chalk.bold('=> Loading payment classifier'))
  const classifier = await fetchClassifier()

  // Prompt for manual classification
  console.log(chalk.bold('=> Classifying payments'))

  for (const rawPayment of unclassifiedPayments) {
    try {
      const payment = preProcessPayment(rawPayment)
      printPayment(payment)

      // Predict category for payment
      const result: number[] | null = classifier.run(prepareInput(payment))
      let suggested: string | null = result ? selectCategory(result) : null

      if (!suggested || !config.paymentCategories.includes(suggested)) {
        suggested = undefined
      }

      // Verify/prompt for payment category and save the payment and its category
      const category: string | null = await promptCategory(payment, suggested)

      if (category) {
        await setPaymentCategory(payment, category)
      }
    } catch (err) {
      console.error(chalk.bold.red(`=> ${err.message}`))
      console.log(err)
    }
  }
}

start()
  .then(() => {
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
