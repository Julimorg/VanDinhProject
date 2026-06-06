import React from "react";
import SectionLabel from "./SectionsLabel";
import { data } from "../../../Data/WelcomePageData";

const Services: React.FC = () => (
  <>
    <section id="services" style={{ background: "#1a1208", padding: "80px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        <div className="services-outer-grid">
          {/* Left header */}
          <div>
            <SectionLabel text="Dịch Vụ" light />
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 700,
                color: "#f0ece3",
                lineHeight: 1.2,
              }}
            >
              Đồng Hành Cùng Bạn Trên Từng Công Trình
            </h2>
          </div>

          {/* Right: service list */}
          <div>
            {data.services.map((s, i) => (
              <div
                key={s.id}
                style={{
                  padding: "28px 0",
                  borderBottom:
                    i < data.services.length - 1
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "none",
                  display: "grid",
                  gridTemplateColumns: "56px 1fr",
                  gap: 20,
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 44,
                    fontWeight: 700,
                    color: "#c17f3a",
                    opacity: 0.5,
                    lineHeight: 1,
                    textAlign: "right" as const,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#f0ece3",
                      marginBottom: 8,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "rgba(240,236,227,0.6)",
                      lineHeight: 1.7,
                    }}
                  >
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <style>{`
      .services-outer-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 80px;
        align-items: start;
      }
      @media (max-width: 900px) {
        .services-outer-grid {
          grid-template-columns: 1fr;
          gap: 40px;
        }
      }
    `}</style>
  </>
);

export default Services;