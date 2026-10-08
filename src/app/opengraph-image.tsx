import { ImageResponse } from "next/og";

export const alt = "Pulse Daily — Independent News & Analysis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", flexDirection: "column", justifyContent: "space-between", padding: "72px", background: "#f8f6f3", color: "#17181b" }}>
      <div style={{ display: "flex", alignItems: "center", fontSize: 38, fontWeight: 800, letterSpacing: "-2px" }}>
        Pulse <span style={{ color: "#cf302e" }}>Daily</span>
      </div>
      <div style={{ display: "flex", maxWidth: "950px", flexDirection: "column" }}>
        <div style={{ marginBottom: "22px", color: "#b93832", fontSize: 20, fontWeight: 700, letterSpacing: "5px", textTransform: "uppercase" }}>Independent journalism</div>
        <div style={{ fontFamily: "Georgia", fontSize: 72, fontWeight: 700, letterSpacing: "-3px", lineHeight: 1.08 }}>News and context for a changing world.</div>
      </div>
      <div style={{ display: "flex", width: "100%", height: "5px", background: "#cf302e" }} />
    </div>,
    size,
  );
}
