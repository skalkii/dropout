import type { ReactNode } from "react";

type ActProps = {
  id: string;
  number: number;
  title: string;
  children: ReactNode;
};

export function Act({ id, number, title, children }: ActProps) {
  const roman = ["I", "II", "III", "IV", "V"][number - 1] ?? String(number);
  return (
    <section
      id={id}
      data-act={id}
      className="scroll-mt-24 border-t border-border py-20 md:py-28 lg:py-32"
    >
      <header className="mx-auto mb-10 max-w-prose md:mb-14">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
          Act {roman}
        </p>
        <h2 className="mt-3 font-serif text-[clamp(1.85rem,1.4rem+1.8vw,3rem)] font-medium leading-[1.15] tracking-[-0.01em] text-foreground">
          {title}
        </h2>
      </header>
      <div className="mx-auto max-w-prose">{children}</div>
    </section>
  );
}
