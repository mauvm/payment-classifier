import chalk from 'chalk'
import moment from 'moment-timezone'
import { PaymentData } from './preProcessPayment'

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
      moment(payment.created_at)
        .tz('Europe/Amsterdam')
        .format('ddd MMM D YYYY, HH:mm'),
    ),
  )
}
