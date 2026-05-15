import type { ReactNode } from "react";

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="prose-essay space-y-6 text-[1.0625rem] leading-[1.75] text-foreground/90 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_em]:italic [&_strong]:font-semibold [&_strong]:text-foreground">
      {children}
    </div>
  );
}
