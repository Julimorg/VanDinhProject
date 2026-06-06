import React, { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import SectionLabel from "./SectionsLabel";
import { data } from "../../../Data/WelcomePageData";
import { StarIcon } from "./Icon";

const AVATAR_COLORS = ["#8B4513", "#2E6B4F", "#1a3a5c"];

const Testimonials: React.FC = () => {
  const autoplay = useRef(Autoplay({ delay: 4500, stopOnInteraction: false }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => setCurrent(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  return (
    <section style={{ background: "#fff", padding: "80px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", marginBottom: 44 }}>
        <SectionLabel text="Khách Hàng Nói Gì" />
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 700,
            color: "#1a1208",
            lineHeight: 1.15,
          }}
        >
          Hàng Nghìn Khách Hàng<br />Tin Tưởng Vạn Dinh
        </h2>
      </div>

      <div ref={emblaRef} style={{ overflow: "hidden" }}>
        <div style={{ display: "flex" }}>
          {data.testimonials.map((t, i) => (
            <div
              key={t.id}
              style={{ flex: "0 0 100%", padding: "0 1.5rem" }}
            >
              <div style={{ maxWidth: 680, margin: "0 auto" }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
                  {[...Array(t.rating)].map((_, si) => (
                    <span key={si} style={{ color: "#c17f3a" }}>
                      <StarIcon size={16} />
                    </span>
                  ))}
                </div>

                <blockquote
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "clamp(20px, 3.5vw, 30px)",
                    fontWeight: 500,
                    color: "#1a1208",
                    lineHeight: 1.55,
                    fontStyle: "italic",
                    marginBottom: 32,
                  }}
                >
                  "{t.content}"
                </blockquote>

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1208" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#9a9080", letterSpacing: 1 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 36 }}>
        {data.testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              background: i === current ? "#c17f3a" : "#e0dbd0",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;