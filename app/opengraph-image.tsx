import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "linear-gradient(135deg, #f8f3e8 0%, #efe2cb 42%, #9a744f 100%)",
          color: "#171412",
          padding: "72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            border: "1px solid rgba(141,104,71,0.22)",
            background: "rgba(255,252,247,0.82)",
            padding: "56px",
            justifyContent: "space-between",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "68%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div
                style={{
                  display: "flex",
                  height: "74px",
                  width: "74px",
                  background: "#8d6847",
                  color: "#f8f4ed",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                  fontWeight: 700,
                }}
              >
                RE
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    fontSize: "24px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#8d6847",
                  }}
                >
                  Immo Neuf
                </div>
                <div style={{ fontSize: "20px", color: "#6a6258" }}>
                  Programmes, terrains et investissements
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div
                style={{
                  fontSize: "68px",
                  lineHeight: 1.02,
                  fontWeight: 700,
                }}
              >
                Immobilier neuf a Abidjan et en Cote d&apos;Ivoire
              </div>
              <div
                style={{
                  fontSize: "28px",
                  lineHeight: 1.35,
                  color: "#4f473f",
                }}
              >
                Projets immobiliers, promoteurs, cartes, comparatifs et demandes
                directes sur une seule plateforme.
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "24%",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            {["Projets verifies", "Carte interactive", "Comparatif", "Profils promoteurs"].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    border: "1px solid rgba(141,104,71,0.22)",
                    background: "rgba(255,255,255,0.72)",
                    padding: "18px 20px",
                    fontSize: "22px",
                    color: "#3d362f",
                  }}
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
