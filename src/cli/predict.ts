import fetchClassifier from '../util/fetchClassifier'
import { prepareInput, selectCategory } from '../util/neuralNetwork'
import { PaymentData } from '../util/preProcessPayment'

async function run() {
  const classifier = await fetchClassifier()
  const currency = process.argv[2]
  const amount = Number(process.argv[3] || 0.0)
  const description = process.argv[4]

  if (!currency) {
    throw new Error('No currency given, pass as first argument')
  }
  if (!amount) {
    throw new Error('No amount given, pass as second argument')
  }
  if (!description) {
    throw new Error('No description given, pass as third argument')
  }

  const data: PaymentData = {
    id: 0,
    currency,
    amount,
    iban: null,
    description,
    created_at: new Date(),
  }

  const result = classifier.run(prepareInput(data))
  console.log('Result:', result)
  console.log('Suggestion:', result != null && selectCategory(result))
}

run()
  .then(() => {
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
