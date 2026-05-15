"use client";

import { useTheme, type ThemeMode } from "./ThemeProvider";

type Item = {
  mode: ThemeMode;
  label: string;
  icon: React.ReactNode;
};

const SunIcon = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const MonitorIcon = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

const ITEMS: Item[] = [
  { mode: "light", label: "Light", icon: SunIcon },
  { mode: "system", label: "System", icon: MonitorIcon },
  { mode: "dark", label: "Dark", icon: MoonIcon },
];

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex rounded-full border border-border bg-bg-elev p-1 shadow-[inset_0_0_0_1px_var(--color-bg-elev)]"
    >
      {ITEMS.map((it) => {
        const active = mode === it.mode;
        return (
          <button
            key={it.mode}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={it.label}
            title={it.label}
            onClick={() => setMode(it.mode)}
            className={`grid h-7 w-7 place-items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${
              active
                ? "bg-accent text-on-accent shadow-sm"
                : "text-muted hover:bg-panel hover:text-foreground"
            }`}
          >
            {it.icon}
          </button>
        );
      })}
    </div>
  );
}
