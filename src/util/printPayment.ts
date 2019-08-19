import chalk from 'chalk'
import { PaymentData } from './preProcessPayment'
import Payment from '@bunq-community/bunq-js-client/dist/Api/Payment'

export default function printPayment(payment: PaymentData) {
  const credited = payment.amount > 0
  const amountFormatted = payment.amount
    .toFixed(2)
    .replace('.', ',')
    .padEnd(9, ' ')

  console.log(
    chalk[credited ? 'green' : 'red'](`${payment.currency} ${amountFormatted}`),
    payment.description || 'Unknown',
    chalk.grey(
      '|',
      payment.iban || 'NO IBAN',
      '|',
      payment.created_at.format('ddd MMM D YYYY, HH:mm'),
    ),
  )
}
