export default function formatMoney(amount = 0) {
  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigit: 2,
  };

  // check if its a clean dollar amount
  if (amount % 100 === 0) {
    options.minimumFractionDigit = 0;
  }
  const formattter = Intl.NumberFormat('en-US', options);
  return formattter.format(amount / 100);
}
