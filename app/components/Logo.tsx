type LogoProps = {
  size?: number;
  showWordmark?: boolean;
  className?: string;
};

export function Logo({ size = 28, showWordmark = true, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="64" height="64" rx="14" className="fill-bg-elev stroke-border" strokeWidth="1.5" />
        <circle cx="22" cy="20" r="3.4" className="fill-accent" />
        <circle cx="42" cy="20" r="3.4" className="fill-accent" opacity="0.45" />
        <circle cx="22" cy="44" r="3.4" className="fill-accent" opacity="0.45" />
        <circle cx="42" cy="44" r="3.4" className="fill-accent" />
        <path
          d="M22 20 L42 20 L22 44 L42 44 M22 20 L42 44 M42 20 L22 44"
          className="stroke-accent"
          strokeWidth="1.2"
          strokeOpacity="0.55"
          fill="none"
        />
      </svg>
      {showWordmark && (
        <span className="font-serif text-base font-medium tracking-tight text-foreground">
          Dropout
        </span>
      )}
    </span>
  );
}
