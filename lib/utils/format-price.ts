import type { ProjectUnit } from "@/features/projects/types";

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

export function formatProjectSummaryInventoryPricing(input: {
  offerType: "sale" | "rent";
  priceMode: "fixed" | "range" | "contact";
  minPrice?: number | null;
  maxPrice?: number | null;
  rentPrice?: number | null;
  currencyCode: string;
}) {
  if (input.offerType === "rent") {
    return input.rentPrice != null
      ? `From ${formatAmount(input.rentPrice, input.currencyCode)} per month`
      : "Rent on request";
  }

  if (input.priceMode === "contact") {
    return "Contact for price";
  }

  if (input.minPrice != null && input.maxPrice != null) {
    if (input.minPrice === input.maxPrice) {
      return `From ${formatAmount(input.minPrice, input.currencyCode)}`;
    }

    return `${formatAmount(input.minPrice, input.currencyCode)} - ${formatAmount(input.maxPrice, input.currencyCode)}`;
  }

  if (input.minPrice != null) {
    return `From ${formatAmount(input.minPrice, input.currencyCode)}`;
  }

  if (input.maxPrice != null) {
    return `Up to ${formatAmount(input.maxPrice, input.currencyCode)}`;
  }

  return "Price on request";
}

export function formatProjectInventoryPricing(input: {
  offerType: "sale" | "rent";
  units: ProjectUnit[];
  currencyCode: string;
  fallback: {
    offerType: "sale" | "rent";
    priceMode: "fixed" | "range" | "contact";
    fixedPrice?: number | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    rentPrice?: number | null;
    currencyCode: string;
  };
}) {
  if (input.units.length === 0) {
    return formatProjectPricing(input.fallback);
  }

  const relevantUnits = input.units.filter((unit) => unit.offerType === input.offerType);

  if (input.offerType === "rent") {
    const rents = relevantUnits
      .map((unit) => unit.monthlyRent)
      .filter((value): value is number => value != null);

    if (rents.length === 0) {
      return formatProjectPricing(input.fallback);
    }

    const minRent = Math.min(...rents);
    const maxRent = Math.max(...rents);

    if (minRent === maxRent) {
      return `From ${formatAmount(minRent, input.currencyCode)} per month`;
    }

    return `${formatAmount(minRent, input.currencyCode)} - ${formatAmount(maxRent, input.currencyCode)} per month`;
  }

  const bounds = relevantUnits
    .map((unit) => {
      if (unit.priceMode === "contact") {
        return null;
      }

      if (unit.priceMode === "fixed") {
        const fixed = unit.fixedPrice ?? unit.minPrice;

        return fixed != null
          ? {
              min: fixed,
              max: fixed,
            }
          : null;
      }

      const min = unit.minPrice ?? unit.maxPrice;
      const max = unit.maxPrice ?? unit.minPrice;

      return min != null || max != null
        ? {
            min: min ?? max ?? null,
            max: max ?? min ?? null,
          }
        : null;
    })
    .filter((value): value is { min: number | null; max: number | null } => value != null);

  const mins = bounds
    .map((bound) => bound.min)
    .filter((value): value is number => value != null);
  const maxes = bounds
    .map((bound) => bound.max)
    .filter((value): value is number => value != null);

  if (mins.length === 0 && maxes.length === 0) {
    return formatProjectPricing(input.fallback);
  }

  const minPrice = mins.length > 0 ? Math.min(...mins) : null;
  const maxPrice = maxes.length > 0 ? Math.max(...maxes) : null;

  if (minPrice != null && maxPrice != null && minPrice === maxPrice) {
    return `From ${formatAmount(minPrice, input.currencyCode)}`;
  }

  return formatPriceRange(minPrice, maxPrice, input.currencyCode);
}
