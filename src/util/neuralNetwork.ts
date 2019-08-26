import cleanTextUtils from 'clean-text-utils'
import { PaymentData } from './preProcessPayment'
import config from '../config'

export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

/**
 * Convert text to letter bag with values from 0..1,
 * where each letter's ASCII code is divided by max value 255.
 *
 * @param txt Input text
 * @param maxChars Maximum number of values in result
 */
export function letterBag(txt: string, maxChars: number): number[] {
  // Smart convert to ASCII
  txt = cleanTextUtils.strip.emoji(txt)
  txt = cleanTextUtils.replace.diacritics(txt)
  txt = cleanTextUtils.replace.smartChars(txt)
  txt = cleanTextUtils.strip.nonASCII(txt)

  // Create word bag, zero filled
  const bag = Array(maxChars).fill(0)

  // Fill bag with values from txt, up to given maximum of characters
  const totalChars = Math.min(txt.length, maxChars)
  for (let index = 0; index < totalChars; index += 1) {
    bag[index] = txt.charCodeAt(index) / 255
  }

  return bag
}

/**
 * Create array with zero's and a single one on the index of given active value.
 *
 * @example `oneHotEncode('Foo', ['Foo', 'Bar', 'Baz']) => [1, 0, 0]`
 * @example `oneHotEncode('C', ['A', 'B', 'C']) => [0, 0, 1]`
 *
 * @example `oneHotEncode('Other', ['A', 'B', 'C']) => Error`
 * @throws Given value not in list of possible values
 *
 * @param value Active value
 * @param values Array of possible values
 */
function oneHotEncode(value: string, values: string[]): number[] {
  const bag = Array(values.length).fill(0)
  const index = values.findIndex(possibleValue => possibleValue === value)

  if (index < 0) {
    throw new Error('Given value not in list of possible values')
  }

  bag[index] = 1
  return bag
}

/**
 * Create array with zero's and a single one on the index of given active value.
 *
 * @example `oneHotDecode([1, 0, 0], ['Foo', 'Bar', 'Baz']) => 'Foo'`
 * @example `oneHotDecode([0, 0, 1], ['A', 'B', 'C']) => 'C'`
 *
 * @example `oneHotDecode([0.5, 0, 0], ['A', 'B', 'C']) => Error`
 * @throws Invalid value in one hot encoded list (between 0 and 1)
 *
 * @example `oneHotDecode([1, 1, 1], ['A', 'B', 'C']) => Error`
 * @throws Multiple active values in one hot encoded list
 *
 * @example `oneHotDecode([0, 0, 0], ['A', 'B', 'C']) => Error`
 * @throws No active value in one hot encoded list
 *
 * @param oneHotEncoded One hot encoded list (output of classifier)
 * @param values Array of possible values
 */
/*
function oneHotDecode(oneHotEncoded: number[], values: string[]): string {
  let index = -1

  for (let i = 0; i < oneHotEncoded.length; i += 1) {
    if (oneHotEncoded[i] > 0 && oneHotEncoded[i] < 1) {
      throw new Error('Invalid value in one hot encoded list (between 0 and 1)')
    }
    if (oneHotEncoded[i] === 1) {
      if (index > 0) {
        throw new Error('Multiple active values in one hot encoded list')
      }

      index = i
    }
  }

  if (index < 0) {
    throw new Error('No active value in one hot encoded list')
  }

  return values[index]
}
*/

/**
 * Encode category to classifier output one hot encoded list
 *
 * @param value Category
 */
export function encodeCategory(value: string): number[] {
  return oneHotEncode(value, config.paymentCategories)
}

/**
 * Decode classifier output to top predicted category
 *
 * @param oneHotEncoded Output from the classifier (result of `net.run(input)`)
 */
export function selectCategory(oneHotEncoded: number[]): string {
  if (oneHotEncoded.length !== config.paymentCategories.length) {
    throw new Error(
      'One hot encoded list size different from number of possible categories',
    )
  }

  const bestPredictionValue = Math.max(...oneHotEncoded)
  const category: string | null = config.paymentCategories.find(
    (category, index) => oneHotEncoded[index] === bestPredictionValue,
  )
  if (!category) {
    throw new Error('Could not select category for given one hot encoded list')
  }

  return category
}

/**
 * Preprocess input to be used for training/prediction
 *
 * @param payment Payment data
 */
export function prepareInput(payment: PaymentData): number[] {
  return [
    sigmoid(payment.amount),
    ...letterBag(payment.currency, 3),
    ...letterBag(payment.description, 200),
  ]
}
