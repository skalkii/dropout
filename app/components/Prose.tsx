import type { ReactNode } from "react";

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="prose-essay space-y-5 text-[1.0625rem] leading-[1.72] text-foreground-soft md:space-y-6 md:text-[1.075rem] [&_a]:text-accent [&_a]:underline [&_a]:decoration-accent/40 [&_a]:underline-offset-[3px] [&_a:hover]:decoration-accent [&_em]:italic [&_em]:text-foreground [&_strong]:font-semibold [&_strong]:text-foreground">
      {children}
    </div>
  );
}
