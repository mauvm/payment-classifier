import fetchClassifier from '../util/fetchClassifier'

async function run() {
  const classifier = await fetchClassifier()
  const input = process.argv[2]

  if (!input) {
    throw new Error('No input given, pass as first argument')
  }

  const result = classifier.run(input)
  console.log('Suggestion:', result)
}

run()
  .then(() => {
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
