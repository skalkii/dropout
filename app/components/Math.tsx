import katex from "katex";

export function InlineMath({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: false,
    output: "html",
  });
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export function BlockMath({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: true,
    output: "html",
  });
  return (
    <div
      className="my-4 overflow-x-auto text-foreground/90"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
