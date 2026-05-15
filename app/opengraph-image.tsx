import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Dropout — Watch a neural network overfit, then watch it dream.";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0c1a",
          color: "#e8e2d1",
          padding: "80px 100px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#c9a86a",
          }}
        >
          An interactive essay
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 168,
              lineHeight: 1,
              letterSpacing: -2,
              marginBottom: 28,
            }}
          >
            Dropout.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 44,
              color: "#e8e2d1",
              maxWidth: 900,
              whiteSpace: "pre-wrap",
            }}
          >
            {"Watch a neural network overfit,\nthen watch it dream."}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#8b8a86" }}>
          on the Overfitted Brain Hypothesis
        </div>
      </div>
    ),
    { ...size },
  );
}
