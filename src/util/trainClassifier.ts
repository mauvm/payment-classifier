import { NeuralNetwork } from 'brain.js'
import knex from '../knex'
import { PaymentData } from './preProcessPayment'

export function paymentToInputString(payment: PaymentData): string {
  return [payment.currency, payment.amount, payment.iban, payment.description]
    .filter(Boolean)
    .join(', ')
}

export default async function trainClassifier(
  classifier: NeuralNetwork,
  epochs: number = 100,
  logWhileTraining: boolean = false,
): Promise<void> {
  const numberOfPayments = 1000
  const payments: PaymentData[] = await knex
    .from('payments')
    .whereNotNull('category')
    .orderBy('created_at', 'DESC')
    .limit(numberOfPayments)

  if (payments.length === 0) {
    throw new Error('No training data available')
  }

  const trainingData = []

  for (const payment of payments) {
    trainingData.push({
      input: paymentToInputString(payment),
      output: payment.category,
    })
  }

  classifier.train(trainingData, {
    // See https://github.com/BrainJS/brain.js#training-options
    iterations: epochs,
    errorThresh: 0.005,
    log: logWhileTraining,
    logPeriod: 10,
    learningRate: 0.3,
    momentum: 0.1,
    callback: null,
    callbackPeriod: 10,
    timeout: Infinity,
  })
}
