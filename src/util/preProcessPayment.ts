import moment from 'moment-timezone'

export interface PaymentData {
  id: number
  currency: string
  amount: number
  iban: string | null
  description: string
  category?: string | null
  created_at: moment.Moment
}

export default function preProcessPayment(payment: any): PaymentData {
  return {
    id: payment.id,
    currency: payment.amount.currency,
    amount: parseFloat(payment.amount.value),
    iban: payment.counterparty_alias.iban,
    description: [
      payment.counterparty_alias.display_name,
      payment.description
        .replace(payment.counterparty_alias.display_name, '')
        .trim(),
    ]
      .filter(Boolean)
      .join(', '),
    created_at: moment.utc(payment.created),
  }
}
