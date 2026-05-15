"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  demoLabel: string;
  children: ReactNode;
};

type State = {
  error: Error | null;
};

export class DemoErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[Demo "${this.props.demoLabel}"] crashed:`, error, info);
    }
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <figure className="not-prose my-12 rounded-md border border-danger/40 bg-accent-soft p-6">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-danger">
          Demo failed to load
        </p>
        <p className="mt-2 text-sm text-foreground-soft">
          The {this.props.demoLabel} demo couldn&apos;t initialize. This is
          almost always a missing or disabled WebGL context. Try a Chromium-
          based browser, or check your browser&apos;s hardware-acceleration
          settings, then click Retry.
        </p>
        <details className="mt-3">
          <summary className="cursor-pointer font-mono text-[11px] text-muted hover:text-foreground">
            Technical details
          </summary>
          <pre className="mt-2 overflow-x-auto rounded-sm bg-panel p-3 font-mono text-[11px] text-foreground-soft">
            {this.state.error.message}
          </pre>
        </details>
        <button
          type="button"
          onClick={this.reset}
          className="mt-4 inline-flex rounded-md border border-border-strong px-3 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-foreground hover:bg-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          Retry
        </button>
      </figure>
    );
  }
}
