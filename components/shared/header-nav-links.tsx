"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type HeaderNavLink = {
  href: string;
  label: string;
};

type HeaderNavLinksProps = {
  links: HeaderNavLink[];
};

export function HeaderNavLinks({ links }: HeaderNavLinksProps) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`pb-1.5 underline decoration-2 underline-offset-[0.55rem] hover:text-stone-950 ${
              isActive
                ? "text-stone-950 decoration-[var(--primary)]"
                : "decoration-[rgba(141,104,71,0.35)]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
