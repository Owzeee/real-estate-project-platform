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
    <header className="sticky top-0 z-40 border-b border-[rgba(141,104,71,0.12)] bg-[rgba(250,248,243,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,var(--primary),color-mix(in_srgb,var(--primary)_72%,black))] text-lg font-bold text-[var(--primary-foreground)] shadow-[0_12px_28px_rgba(141,104,71,0.24)]">
            RE
          </div>
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-stone-950 sm:text-xl">
              IMMO NEUF
            </p>
            <p className="text-[11px] uppercase tracking-[0.26em] text-[var(--muted-foreground)]">
              Premium Development Platform
            </p>
          </div>
        </Link>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <nav className="surface-soft flex flex-wrap items-center gap-1 rounded-full p-1.5 text-sm font-medium text-stone-700">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2.5 hover:bg-[rgba(141,104,71,0.08)] hover:text-stone-950"
              >
                {link.label}
              </Link>
            ))}
            {privateLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2.5 hover:bg-[rgba(141,104,71,0.08)] hover:text-stone-950"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap gap-3">
            {auth.user ? (
              <form action={signOutAction}>
                <button className="secondary-button px-4 py-2.5 text-sm">
                  Sign out
                </button>
              </form>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="secondary-button px-4 py-2.5 text-sm"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="primary-button px-4 py-2.5 text-sm"
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
