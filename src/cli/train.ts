import fetchClassifier from '../util/fetchClassifier'
import trainClassifier from '../util/trainClassifier'
import saveClassifier from '../util/saveClassifier'

async function run() {
  console.log('Fetching latest classifier..')
  const classifier = await fetchClassifier()

  const epochs = Number(process.argv[2] || 100)
  console.log('Training for %d epochs..', epochs)
  await trainClassifier(classifier, epochs, true)

  console.log('Saving trained classifier..')
  await saveClassifier(classifier)
}

run()
  .then(() => {
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
