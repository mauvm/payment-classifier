import brain, { NeuralNetwork } from 'brain.js'
import knex from '../knex'

export default async function fetchClassifier(): Promise<NeuralNetwork> {
  const classifier = new brain.recurrent.LSTM()

  // Load latest configuration
  const json = await knex
    .from('classifiers')
    .select('json')
    .orderBy('created_at', 'DESC')
    .limit(1)
    .then(results => results[0] && results[0].json)
  if (json) {
    classifier.fromJSON(JSON.parse(json))
  }

  return classifier
}
