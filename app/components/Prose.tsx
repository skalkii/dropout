import type { ReactNode } from "react";

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="prose-essay space-y-6 text-[1.0625rem] leading-[1.75] text-[--color-fg]/90 [&_a]:text-[--color-accent] [&_a]:underline [&_a]:underline-offset-4 [&_em]:italic [&_strong]:font-semibold [&_strong]:text-[--color-fg]">
      {children}
    </div>
  );
}
