/* eslint-disable @next/next/no-img-element */

type CompanyLogoProps = {
  companyName: string;
  logoUrl?: string | null;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
};

export function CompanyLogo({
  companyName,
  logoUrl,
  className = "h-20 w-20",
  imageClassName = "rounded-[1.35rem] border-4 border-[var(--card)] object-cover shadow-lg",
  fallbackClassName = "rounded-[1.35rem] border-4 border-[var(--card)] bg-[linear-gradient(145deg,var(--primary),color-mix(in_srgb,var(--primary)_72%,black))] text-lg font-bold text-[var(--primary-foreground)] shadow-lg",
}: CompanyLogoProps) {
  const initials = companyName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${companyName} logo`}
        className={`${className} ${imageClassName}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center ${className} ${fallbackClassName}`}
      aria-label={`${companyName} initials`}
    >
      {initials || "DP"}
    </div>
  );
}
