import Link from "next/link";

import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { signOutAction } from "@/features/auth/actions";
import { getCurrentAuth } from "@/lib/auth";
import { getTranslations } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";

export async function SiteHeader() {
  const locale = await getCurrentLocale();
  const t = getTranslations(locale);
  const auth = await getCurrentAuth();
  const role = auth.profile?.role ?? null;
  const publicLinks = [
    { href: "/", label: t.nav.home },
    { href: "/projects", label: t.nav.projects },
    { href: "/wishlist", label: t.nav.wishlist },
    { href: "/developers", label: t.nav.developers },
  ];

  const privateLinks =
    role === "admin"
      ? [
          { href: "/admin/projects", label: t.nav.admin },
          { href: "/admin/developers", label: t.nav.review },
          { href: "/admin/inquiries", label: t.nav.leads },
        ]
      : role === "developer"
        ? [
            { href: "/developer/projects", label: t.nav.dashboard },
            { href: "/developer/inquiries", label: t.nav.inbox },
            { href: "/developer/profiles", label: t.nav.profile },
          ]
        : [];

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(141,104,71,0.12)] bg-[rgba(250,248,243,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-6 lg:px-8">
        <Link href="/" className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,var(--primary),color-mix(in_srgb,var(--primary)_72%,black))] text-lg font-bold text-[var(--primary-foreground)] shadow-[0_12px_28px_rgba(141,104,71,0.24)]">
            RE
          </div>
          <p className="font-display text-lg font-bold tracking-tight text-stone-950 sm:text-xl">
            IMMO NEUF
          </p>
        </Link>

        <nav className="surface-soft flex flex-wrap items-center gap-1 rounded-[1.75rem] p-1.5 text-sm font-medium text-stone-700 lg:mx-auto lg:flex-nowrap lg:justify-center">
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

        <div className="flex flex-wrap items-center gap-3 lg:justify-self-end">
          <div className="shrink-0">
            <LanguageSwitcher locale={locale} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {auth.user ? (
              <form action={signOutAction}>
                <button className="secondary-button px-4 py-2.5 text-sm">
                  {t.auth.signOut}
                </button>
              </form>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="secondary-button px-3.5 py-2 text-sm"
                >
                  {t.auth.signIn}
                </Link>
                <Link
                  href="/auth/signup"
                  className="primary-button px-3.5 py-2 text-sm"
                >
                  {t.auth.signUp}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
