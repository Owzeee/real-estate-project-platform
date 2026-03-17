function formatAmount(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceRange(
  minPrice: number | null,
  maxPrice: number | null,
  currencyCode: string,
) {
  if (minPrice && maxPrice) {
    return `${formatAmount(minPrice, currencyCode)} - ${formatAmount(maxPrice, currencyCode)}`;
  }

  if (minPrice) {
    return `From ${formatAmount(minPrice, currencyCode)}`;
  }

  if (maxPrice) {
    return `Up to ${formatAmount(maxPrice, currencyCode)}`;
  }

  return "Price on request";
}
