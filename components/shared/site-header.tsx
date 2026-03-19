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
          { href: "/admin/developers", label: "Review" },
          { href: "/admin/inquiries", label: "Leads" },
        ]
      : role === "developer"
        ? [
            { href: "/developer/projects", label: "Dashboard" },
            { href: "/developer/inquiries", label: "Inbox" },
            { href: "/developer/profiles", label: "Profile" },
          ]
        : [];

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(141,104,71,0.12)] bg-[rgba(250,248,243,0.84)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-lg font-bold text-[var(--primary-foreground)]">
            R
          </div>
          <div>
            <p className="font-display text-xl font-bold tracking-tight text-stone-950">
              Real Estate Project Marketplace
            </p>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              Premium Development Platform
            </p>
          </div>
        </Link>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-stone-700">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 hover:bg-[rgba(141,104,71,0.08)] hover:text-stone-950"
              >
                {link.label}
              </Link>
            ))}
            {privateLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 hover:bg-[rgba(141,104,71,0.08)] hover:text-stone-950"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap gap-3">
            {auth.user ? (
              <form action={signOutAction}>
                <button className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-stone-900 hover:border-[var(--primary)] hover:bg-[rgba(141,104,71,0.05)]">
                  Sign out
                </button>
              </form>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-stone-900 hover:border-[var(--primary)] hover:bg-[rgba(141,104,71,0.05)]"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)]"
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
