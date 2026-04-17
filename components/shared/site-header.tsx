import Link from "next/link";

import { HeaderNavLinks } from "@/components/shared/header-nav-links";
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
    { href: "/compare", label: t.nav.compare },
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
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-8 lg:px-8">
        <Link href="/" className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center bg-[linear-gradient(145deg,var(--primary),color-mix(in_srgb,var(--primary)_72%,black))] text-lg font-bold text-[var(--primary-foreground)] shadow-[0_12px_28px_rgba(141,104,71,0.24)]">
            RE
          </div>
          <p className="font-display text-lg font-bold tracking-tight text-stone-950 sm:text-xl">
            IMMO NEUF
          </p>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm font-medium text-stone-700 lg:flex-nowrap">
          <HeaderNavLinks links={publicLinks} />
        </nav>

        <div className="flex flex-wrap items-center gap-3 lg:justify-self-end">
          {privateLinks.length > 0 ? (
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
              {privateLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-stone-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
          <div className="shrink-0">
            <LanguageSwitcher locale={locale} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {auth.user ? (
              <form action={signOutAction}>
                <button className="border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 hover:border-[var(--primary)] hover:bg-[rgba(141,104,71,0.05)]">
                  {t.auth.signOut}
                </button>
              </form>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="header-action-button border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 hover:border-[var(--primary)] hover:bg-[rgba(141,104,71,0.05)]"
                >
                  {t.auth.signIn}
                </Link>
                <Link
                  href="/auth/signup"
                  className="header-action-button bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)]"
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
