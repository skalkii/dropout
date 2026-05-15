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
      <div className="mb-1.5 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-widest text-muted">
        <span>{label}</span>
        <span className="text-foreground tabular-nums">
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
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-border accent-[#c9a86a] disabled:cursor-not-allowed disabled:opacity-50"
      />
    </label>
  );
}
