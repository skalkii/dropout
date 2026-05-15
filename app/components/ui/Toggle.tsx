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
      className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3 transition-colors ${
        checked
          ? "border-accent/60 bg-accent/10"
          : "border-border hover:border-foreground/30"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1 h-3.5 w-3.5 accent-[#c9a86a]"
      />
      <span className="block">
        <span className="block font-mono text-[11px] uppercase tracking-widest text-foreground">
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block text-xs leading-snug text-muted">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
