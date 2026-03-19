import Link from "next/link";

import { signOutAction } from "@/features/auth/actions";
import { getCurrentAuth } from "@/lib/auth";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/developers", label: "Developers" },
];

export async function SiteHeader() {
  const auth = await getCurrentAuth();
  const role = auth.profile?.role ?? null;

  const privateLinks =
    role === "admin"
      ? [
          { href: "/admin/projects", label: "Admin" },
          { href: "/admin/developers", label: "Developers Review" },
          { href: "/admin/inquiries", label: "Inquiries" },
        ]
      : role === "developer"
        ? [
            { href: "/developer/projects", label: "Dashboard" },
            { href: "/developer/inquiries", label: "Inbox" },
            { href: "/developer/profiles", label: "Profile" },
          ]
        : [];

  return (
    <header className="border-b border-stone-900/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight text-stone-950">
          Real Estate Project Marketplace
        </Link>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <nav className="flex flex-wrap gap-3 text-sm font-medium text-stone-700">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 transition hover:bg-stone-100 hover:text-stone-950"
              >
                {link.label}
              </Link>
            ))}
            {privateLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 transition hover:bg-stone-100 hover:text-stone-950"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap gap-3">
            {auth.user ? (
              <form action={signOutAction}>
                <button className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:border-stone-950">
                  Sign out
                </button>
              </form>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:border-stone-950"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
