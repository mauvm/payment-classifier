import { NeuralNetwork } from 'brain.js'
import knex from '../knex'

export default async function saveClassifier(
  classifier: NeuralNetwork,
): Promise<void> {
  await knex.from('classifiers').insert({
    json: JSON.stringify(classifier.toJSON()),
    created_at: new Date(),
  })
}
