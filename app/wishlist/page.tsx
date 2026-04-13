import type { Metadata } from "next";

import { WishlistPageClient } from "@/features/projects/wishlist-page-client";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}
