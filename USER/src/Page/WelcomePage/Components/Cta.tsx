import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, PhoneIcon } from "./Icon";

const CTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <section
        style={{
          position: "relative",
          padding: "100px 0",
          overflow: "hidden",
          background: "#f7f4ef",
        }}
      >
        {/* Subtle bg image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(https://images.pexels.com/photos/4392270/pexels-photo-4392270.jpeg?auto=compress&cs=tinysrgb&w=1600)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.07,
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 1.5rem",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <div style={{ width: 48, height: 1, background: "#c17f3a" }} />
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 700,
              color: "#1a1208",
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Sẵn Sàng Bắt Đầu<br />Công Trình Của Bạn?
          </h2>

          <p
            style={{
              fontSize: "clamp(14px, 1.8vw, 16px)",
              color: "#6b6258",
              maxWidth: 480,
              margin: "0 auto 44px",
              lineHeight: 1.7,
            }}
          >
            Liên hệ ngay để được tư vấn miễn phí và nhận báo giá tốt nhất từ đội ngũ chuyên gia của Vạn Dinh.
          </p>

          <div
            className="cta-buttons"
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap" as const,
            }}
          >
            <button
              onClick={() => navigate("/login")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "#1a1208",
                color: "#f0ece3",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                letterSpacing: 1.5,
                textTransform: "uppercase" as const,
                transition: "background 0.25s",
                padding: "15px 36px",
                fontSize: 13,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#c17f3a"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#1a1208"; }}
            >
              Bắt Đầu Ngay <ArrowRight size={14} />
            </button>

            <a
              href="tel:0123456789"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid #c0b9ae",
                color: "#3a3028",
                padding: "15px 28px",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: 1,
                textTransform: "uppercase" as const,
                textDecoration: "none",
                transition: "border-color 0.25s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#3a3028"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#c0b9ae"; }}
            >
              <PhoneIcon size={14} /> Gọi 0123 456 789
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 480px) {
          .cta-buttons a,
          .cta-buttons button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default CTA;