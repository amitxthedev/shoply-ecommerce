/* Money formatting — USD, 2 decimals (US-only V1; API amounts are 2-decimal numbers). */
const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatMoney(value) {
  return money.format(value)
}
