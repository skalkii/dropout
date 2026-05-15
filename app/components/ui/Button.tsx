"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({
  variant = "primary",
  className = "",
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-sans text-[11px] font-medium uppercase tracking-[0.14em] px-4 py-2 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-accent/70";
  const styles: Record<Variant, string> = {
    primary:
      "bg-accent text-on-accent hover:bg-accent/90 active:bg-accent/80",
    ghost:
      "border border-border-strong text-foreground/85 hover:text-foreground hover:bg-panel hover:border-foreground/30 active:bg-panel/80",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...rest} />;
}
