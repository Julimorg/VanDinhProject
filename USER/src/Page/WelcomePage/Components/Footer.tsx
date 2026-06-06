import React from "react";

const Footer: React.FC = () => (
  <>
    <footer
      id="contact"
      style={{ background: "#0e0c08", padding: "60px 0 28px", color: "#f0ece3" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Top grid */}
        <div
          className="footer-grid"
          style={{
            display: "grid",
            marginBottom: 48,
            paddingBottom: 40,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Brand column */}
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 28,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Vạn Dinh
            </div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 3,
                color: "#9a8a72",
                textTransform: "uppercase" as const,
                marginBottom: 18,
              }}
            >
              Paint Store
            </div>
            <p
              style={{
                fontSize: 14,
                color: "rgba(240,236,227,0.5)",
                lineHeight: 1.7,
                maxWidth: 280,
              }}
            >
              Giải pháp sơn chất lượng cao, uy tín hàng đầu tại Dĩ An — Hồ Chí Minh.
            </p>
          </div>

          {/* Products */}
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 3,
                color: "#9a8a72",
                textTransform: "uppercase" as const,
                marginBottom: 18,
              }}
            >
              Sản Phẩm
            </div>
            {["Sơn Nội Thất", "Sơn Ngoại Thất", "Chống Thấm", "Sơn Công Nghiệp"].map((item) => (
              <div
                key={item}
                style={{
                  fontSize: 14,
                  color: "rgba(240,236,227,0.5)",
                  marginBottom: 10,
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(240,236,227,0.9)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(240,236,227,0.5)"; }}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Services */}
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 3,
                color: "#9a8a72",
                textTransform: "uppercase" as const,
                marginBottom: 18,
              }}
            >
              Dịch Vụ
            </div>
            {["Tư Vấn Màu Sắc", "Pha Màu Máy", "Giao Hàng Tận Nơi", "Hỗ Trợ Thi Công"].map((item) => (
              <div
                key={item}
                style={{
                  fontSize: 14,
                  color: "rgba(240,236,227,0.5)",
                  marginBottom: 10,
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(240,236,227,0.9)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(240,236,227,0.5)"; }}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 3,
                color: "#9a8a72",
                textTransform: "uppercase" as const,
                marginBottom: 18,
              }}
            >
              Liên Hệ
            </div>
            <div style={{ fontSize: 14, color: "rgba(240,236,227,0.5)", lineHeight: 1.9 }}>
              <div>Dĩ An, Hồ Chí Minh</div>
              <div style={{ marginTop: 8 }}>Hotline:</div>
              <a
                href="tel:0123456789"
                style={{
                  color: "#c17f3a",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: 15,
                }}
              >
                0123 456 789
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div
          className="footer-bottom"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap" as const,
            gap: 12,
          }}
        >
          <div style={{ fontSize: 12, color: "rgba(240,236,227,0.3)" }}>
            © 2025 Vạn Dinh Paint Store. All rights reserved.
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(240,236,227,0.3)",
              letterSpacing: 2,
              textTransform: "uppercase" as const,
            }}
          >
            Dĩ An · Hồ Chí Minh · Việt Nam
          </div>
        </div>
      </div>
    </footer>

    <style>{`
      .footer-grid {
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 40px;
      }
      @media (max-width: 900px) {
        .footer-grid {
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }
      }
      @media (max-width: 520px) {
        .footer-grid {
          grid-template-columns: 1fr;
          gap: 28px;
        }
        .footer-bottom {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `}</style>
  </>
);

export default Footer;