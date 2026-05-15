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
    "inline-flex items-center justify-center font-mono text-xs uppercase tracking-[0.15em] px-4 py-2 rounded-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const styles: Record<Variant, string> = {
    primary:
      "bg-accent text-background hover:bg-accent/85 focus:outline-none focus:ring-1 focus:ring-accent/70",
    ghost:
      "border border-border text-foreground/80 hover:text-foreground hover:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/70",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...rest} />;
}
