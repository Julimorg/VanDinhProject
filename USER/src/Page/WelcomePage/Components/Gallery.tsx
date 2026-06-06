import React, { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "./Icon";
import SectionLabel from "./SectionsLabel";
import { data } from "../../../Data/WelcomePageData";

const Gallery: React.FC = () => {
  const autoplay = useRef(Autoplay({ delay: 3500, stopOnInteraction: false }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => setCurrent(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  return (
    <>
      <section style={{ background: "#f7f4ef", padding: "80px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap" as const,
              gap: 20,
            }}
          >
            <div>
              <SectionLabel text="Hình Ảnh Công Trình" />
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 700,
                  color: "#1a1208",
                  lineHeight: 1.15,
                }}
              >
                Từ Ý Tưởng Đến Hoàn Thiện
              </h2>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {[
                { icon: <ArrowLeft size={18} />, action: () => emblaApi?.scrollPrev() },
                { icon: <ArrowRight size={18} />, action: () => emblaApi?.scrollNext() },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.action}
                  className="gallery-nav-btn"
                  style={{
                    width: 44,
                    height: 44,
                    border: "1px solid #c0b9ae",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#3a3028",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#1a1208";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#3a3028";
                  }}
                >
                  {btn.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel — bleeds to edge on mobile, offset on desktop */}
        <div
          ref={emblaRef}
          style={{ overflow: "hidden" }}
          className="gallery-embla"
        >
          <div style={{ display: "flex", gap: 16 }}>
            {data.gallery.map((item, i) => (
              <div
                key={item.id}
                className="gallery-slide"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transform: i === current ? "scale(1.03)" : "scale(1)",
                    transition: "transform 0.6s ease",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
                    padding: "32px 20px 20px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 28,
          }}
        >
          {data.gallery.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                background: i === current ? "#c17f3a" : "#c0b9ae",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </section>

      <style>{`
        .gallery-embla {
          padding-left: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem));
        }
        .gallery-slide {
          flex: 0 0 480px;
          height: 360px;
        }
        @media (max-width: 768px) {
          .gallery-embla { padding-left: 1.5rem; }
          .gallery-slide { flex: 0 0 85vw; height: 280px; }
        }
        @media (max-width: 480px) {
          .gallery-slide { flex: 0 0 92vw; height: 240px; }
        }
      `}</style>
    </>
  );
};

export default Gallery;