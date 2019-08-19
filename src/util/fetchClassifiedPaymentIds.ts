import knex from '../knex'

export default async function fetchClassifiedPaymentIds(): Promise<number[]> {
  return knex
    .from('payments')
    .select('id')
    .whereNotNull('category')
    .then(rows => rows.map(row => row.id))
}
