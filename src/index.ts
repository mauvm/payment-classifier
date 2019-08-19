import chalk from 'chalk'

// Ensure .env is loaded before process.env is used elsewhere
import config from './config'

import fetchAllBunqPayments from './util/fetchAllBunqPayments'
import fetchClassifiedPaymentIds from './util/fetchClassifiedPaymentIds'
import preProcessPayment from './util/preProcessPayment'
import printPayment from './util/printPayment'
import promptCategory from './util/promptCategory'
import setPaymentCategory from './util/setPaymentCategory'

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

  // Prompt for manual classification
  console.log(chalk.bold('=> Classifying payments'))

  for (const rawPayment of unclassifiedPayments) {
    try {
      const payment = preProcessPayment(rawPayment)
      printPayment(payment)

      // TODO: Load model from database
      // TODO: Predict category
      // TODO: Train model after new categorie(s) are given
      // TODO: Store new weights
      const category: string | null = await promptCategory(payment)

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
    console.log('Done.')
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
