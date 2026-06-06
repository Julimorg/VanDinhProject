import React from "react";
import SectionLabel from "./SectionsLabel";
import { data } from "../../../Data/WelcomePageData";


const Features: React.FC = () => (
  <>
    <section style={{ background: "#fff", padding: "80px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        <div className="features-outer-grid">
          {/* Left header */}
          <div>
            <SectionLabel text="Tại Sao Chọn Chúng Tôi" />
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 700,
                color: "#1a1208",
                lineHeight: 1.15,
              }}
            >
              Vạn Dinh —<br />Cam Kết Vượt Trội
            </h2>
          </div>

          {/* Right: 2-col cards */}
          <div className="features-inner-grid">
            {data.features.map((f) => (
              <div
                key={f.id}
                style={{
                  padding: "32px 0",
                  borderTop: "1px solid #e0dbd0",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 60,
                    fontWeight: 700,
                    color: "#f0ece3",
                    lineHeight: 1,
                    position: "absolute",
                    top: 20,
                    right: 0,
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  {f.number}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1208", marginBottom: 10 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: "#6b6258", lineHeight: 1.7 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <style>{`
      .features-outer-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 80px;
        align-items: start;
      }
      .features-inner-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0 48px;
      }
      @media (max-width: 900px) {
        .features-outer-grid {
          grid-template-columns: 1fr;
          gap: 40px;
        }
      }
      @media (max-width: 560px) {
        .features-inner-grid {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  </>
);

export default Features;