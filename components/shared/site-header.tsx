import Link from "next/link";

import { signOutAction } from "@/features/auth/actions";
import { getCurrentAuth } from "@/lib/auth";

export async function SiteHeader() {
  const auth = await getCurrentAuth();

  const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
  ];

  if (auth.profile?.role === "developer") {
    links.push({ href: "/developer/projects", label: "Developer" });
  }

  if (auth.profile?.role === "admin") {
    links.push({ href: "/admin/projects", label: "Admin" });
    links.push({ href: "/admin/inquiries", label: "Inquiries" });
  }

  return (
    <header className="border-b border-stone-900/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight text-stone-950">
          Real Estate Project Marketplace
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-stone-700">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 transition hover:bg-stone-100 hover:text-stone-950"
            >
              {link.label}
            </Link>
          ))}
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
                className="rounded-full border border-stone-300 px-4 py-2 transition hover:border-stone-950"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-stone-950 px-4 py-2 text-white transition hover:bg-stone-800"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
