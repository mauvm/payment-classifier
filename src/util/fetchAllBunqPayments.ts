import getClient from '../bunq'

/**
 * Fetch all Bunq payments
 *
 * @param newerId Transaction ID to start from (excluded)
 */
export default async function fetchAllBunqPayments(
  newerId: number = 0,
): Promise<any[]> {
  const bunqJSClient = await getClient()

  // Fetch first active user ID
  const users = await bunqJSClient.getUsers(true)
  const user = Array.isArray(users)
    ? users.find(user => user.UserPerson.status === 'ACTIVE')
    : users
  if (!user) throw new Error('Could not determine active user')
  const userId = user.UserPerson.id

  // Fetch first account ID
  const accounts = await bunqJSClient.api.monetaryAccount.list(userId)
  const accountId = accounts[0].MonetaryAccountBank.id

  // Gather all payments
  const allPayments: any[] = []

  while (true) {
    const payments = await bunqJSClient.api.payment.list(userId, accountId, {
      count: 200,
      newer_id: newerId,
    })

    if (payments.length > 0) {
      newerId = payments[0].Payment.id
      allPayments.push(...payments.reverse().map(payment => payment.Payment))
    } else {
      break
    }
  }

  return allPayments
}
