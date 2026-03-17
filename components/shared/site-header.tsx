import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/developer/projects", label: "Developer" },
  { href: "/admin/projects", label: "Admin" },
  { href: "/admin/inquiries", label: "Inquiries" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-stone-900/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight text-stone-950">
          Real Estate Project Marketplace
        </Link>
        <nav className="flex flex-wrap gap-3 text-sm font-medium text-stone-700">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 transition hover:bg-stone-100 hover:text-stone-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
