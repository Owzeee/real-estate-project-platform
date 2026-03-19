type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="inline-flex rounded-full bg-[rgba(198,154,91,0.12)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
