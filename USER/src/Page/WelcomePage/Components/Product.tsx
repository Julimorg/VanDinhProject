import React, { useState } from "react";
import { ChevronRight } from "./Icon";
import SectionLabel from "./SectionsLabel";
import { data } from "../../../Data/WelcomePageData";

const Products: React.FC = () => {
  const [active, setActive] = useState(0);
  const cat = data.productCategories[active];

  return (
    <>
      <section id="products" style={{ background: "#f7f4ef", padding: "80px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
          <div className="products-grid">
            {/* Left: Text + Menu */}
            <div>
              <SectionLabel text="Danh Mục Sản Phẩm" />
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 700,
                  color: "#1a1208",
                  lineHeight: 1.15,
                  marginBottom: 40,
                }}
              >
                Giải Pháp Sơn Cho Mọi Công Trình
              </h2>

              {data.productCategories.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => setActive(i)}
                  style={{
                    padding: "18px 0",
                    borderBottom: "1px solid #e0dbd0",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.2s",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: 3,
                        color: active === i ? "#c17f3a" : "#9a9080",
                        textTransform: "uppercase" as const,
                        marginBottom: 4,
                        fontWeight: 600,
                        transition: "color 0.2s",
                      }}
                    >
                      {item.tag}
                    </div>
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 600,
                        color: active === i ? "#1a1208" : "#6b6258",
                        transition: "color 0.2s",
                      }}
                    >
                      {item.name}
                    </div>
                  </div>
                  <div
                    style={{
                      color: active === i ? "#c17f3a" : "#ccc5b8",
                      transition: "color 0.2s",
                      flexShrink: 0,
                    }}
                  >
                    <ChevronRight size={18} />
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Image */}
            <div className="products-image-col">
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  background: "#e8e3d8",
                  height: "100%",
                  minHeight: 360,
                }}
              >
                <img
                  key={cat.id}
                  src={cat.imageUrl}
                  alt={cat.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "opacity 0.4s ease",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(to top, rgba(10,8,5,0.78) 0%, transparent 100%)",
                    padding: "48px 28px 28px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: 4,
                      color: "#d4a96a",
                      textTransform: "uppercase" as const,
                      marginBottom: 8,
                    }}
                  >
                    {cat.tag}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "clamp(22px, 3vw, 28px)",
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: 10,
                    }}
                  >
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                    {cat.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .products-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }
        .products-image-col {
          display: block;
        }
        @media (max-width: 900px) {
          .products-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .products-image-col {
            order: -1;
          }
        }
        @media (max-width: 480px) {
          #products { padding: 60px 0 !important; }
        }
      `}</style>
    </>
  );
};

export default Products;