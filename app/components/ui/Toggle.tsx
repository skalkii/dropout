"use client";

type ToggleProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
};

export function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: ToggleProps) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-md border p-3.5 transition-colors ${
        checked
          ? "border-accent/60 bg-accent-soft"
          : "border-border bg-bg-elev hover:border-foreground/25"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-0.5 h-4 w-4 accent-accent focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2"
      />
      <span className="block">
        <span className="block font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-foreground">
          {label}
        </span>
        {description && (
          <span className="mt-1 block font-serif text-[13px] leading-snug text-foreground-soft">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
