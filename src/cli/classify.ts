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
import { paymentToInputString } from '../util/trainClassifier'

const start = async () => {
  // TODO: This will become slow very quickly, refactor to use batches
  console.log(chalk.bold('=> Fetching Bunq payments'))
  console.log(
    'This might take a while (depending on how much you are spending)..',
  )
  const allPayments: any[] = await fetchAllBunqPayments()
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
      let suggested: string = String(
        classifier.run(paymentToInputString(payment)),
      )

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
