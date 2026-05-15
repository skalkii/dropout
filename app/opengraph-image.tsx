import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Dropout — Watch a neural network overfit, then watch it dream.";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#faf9f5",
          color: "#2c2a26",
          padding: "76px 96px",
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
            color: "#c96442",
            fontWeight: 600,
          }}
        >
          An interactive essay
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 184,
              lineHeight: 0.95,
              letterSpacing: -4,
              marginBottom: 32,
              fontWeight: 500,
            }}
          >
            Dropout.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 46,
              color: "#4a4843",
              maxWidth: 920,
              whiteSpace: "pre-wrap",
              lineHeight: 1.2,
            }}
          >
            {"Watch a neural network overfit,\nthen watch it dream."}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#857f76",
          }}
        >
          <span>on the Overfitted Brain Hypothesis</span>
          <span style={{ color: "#c96442" }}>●</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
