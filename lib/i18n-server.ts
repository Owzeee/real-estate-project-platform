import { cookies } from "next/headers";

import { SITE_LANG_COOKIE, type SiteLocale, isSiteLocale } from "@/lib/i18n";

export async function getCurrentLocale(): Promise<SiteLocale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SITE_LANG_COOKIE)?.value;

  return isSiteLocale(value) ? value : "fr";
}
