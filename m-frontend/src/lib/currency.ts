export const formatPrice = (price: number | null | undefined): string => {
  // Safety check: ensure price is a valid number
  const validPrice = price ?? 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(validPrice);
};
