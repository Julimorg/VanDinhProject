import React, { useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import SectionLabel from "./SectionsLabel";
import { data } from "../../../Data/WelcomePageData";



const BrandsSection: React.FC = () => {
  const autoplay = useRef(Autoplay({ delay: 2200, stopOnInteraction: false }));
  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true, align: "start" },
    [autoplay.current]
  );

  return (
    <section id="brands" style={{ background: "#1a1208", padding: "80px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", marginBottom: 44 }}>
        <SectionLabel text="Thương Hiệu Đối Tác" light />
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 700,
            color: "#f0ece3",
            lineHeight: 1.2,
          }}
        >
          Hợp Tác Với Những Thương Hiệu Hàng Đầu Thế Giới
        </h2>
      </div>

      <div ref={emblaRef} style={{ overflow: "hidden", cursor: "grab" }}>
        <div style={{ display: "flex", gap: 2 }}>
          {[...data.brands, ...data.brands].map((brand, i) => (
            <div
              key={i}
              style={{
                flex: "0 0 200px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "28px 32px",
                transition: "background 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(193,127,58,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#f0ece3",
                  letterSpacing: 1,
                }}
              >
                {brand.name}
              </div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 3,
                  color: "#9a8a72",
                  marginTop: 4,
                  textTransform: "uppercase" as const,
                }}
              >
                {brand.origin}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;