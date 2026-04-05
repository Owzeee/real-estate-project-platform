function formatAmount(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatAmountLabel(amount: number, currencyCode: string) {
  return formatAmount(amount, currencyCode);
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

export function formatProjectPricing(input: {
  offerType: "sale" | "rent";
  priceMode: "fixed" | "range" | "contact";
  fixedPrice?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  rentPrice?: number | null;
  currencyCode: string;
}) {
  if (input.offerType === "rent") {
    return input.rentPrice != null
      ? `${formatAmount(input.rentPrice, input.currencyCode)} per month`
      : "Rent on request";
  }

  if (input.priceMode === "contact") {
    return "Contact for price";
  }

  if (input.priceMode === "fixed") {
    return input.fixedPrice != null
      ? formatAmount(input.fixedPrice, input.currencyCode)
      : formatPriceRange(input.minPrice ?? null, input.maxPrice ?? null, input.currencyCode);
  }

  return formatPriceRange(input.minPrice ?? null, input.maxPrice ?? null, input.currencyCode);
}
