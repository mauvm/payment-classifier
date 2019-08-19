import knex from '../knex'
import { PaymentData } from './preProcessPayment'

export default async function setPaymentCategory(
  payment: PaymentData,
  category: string,
): Promise<void> {
  const data = {
    currency: payment.currency,
    amount: payment.amount,
    iban: payment.iban,
    description: payment.description,
    category,
    created_at: payment.created_at.toDate(),
  }

  // TODO: Use database transaction
  // Check if UPDATE is possible, otherwise INSERT
  const updated = await knex
    .from('payments')
    .where('id', payment.id)
    .update(data)
    .limit(1)

  if (updated === 0) {
    await knex.from('payments').insert({
      id: payment.id,
      ...data,
    })
  }
}
