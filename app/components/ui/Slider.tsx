"use client";

import type { ChangeEvent } from "react";

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  disabled?: boolean;
};

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  disabled,
}: SliderProps) {
  const handle = (e: ChangeEvent<HTMLInputElement>) =>
    onChange(Number(e.target.value));
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
        <span>{label}</span>
        <span className="font-mono text-foreground tabular-nums">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handle}
        disabled={disabled}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />
    </label>
  );
}
