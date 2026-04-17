import type { Metadata } from "next";

import { WishlistPageClient } from "@/features/projects/wishlist-page-client";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Wishlist",
  description: "Saved wishlist for projects and properties.",
  path: "/wishlist",
  noIndex: true,
});

export default function WishlistPage() {
  return <WishlistPageClient />;
}
