import inquirer from 'inquirer'
import { PaymentData } from './preProcessPayment'
import config from '../config'

export default async function promptCategory(
  payment: PaymentData,
  suggested?: string,
): Promise<string | null> {
  const result = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'category',
      message: 'Select category',
      choices: config.paymentCategories,
      default: suggested,
    },
  ])
  return result.category
}
