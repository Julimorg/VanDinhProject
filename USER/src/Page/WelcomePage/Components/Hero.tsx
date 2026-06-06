import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { data } from "../../../Data/WelcomePageData";
import { ArrowRight, PhoneIcon } from "./Icon";

const Hero: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <section
        style={{
          position: "relative",
          height: "100svh",
          minHeight: 600,
          overflow: "hidden",
        }}
      >
        {/* Background Image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(https://images.pexels.com/photos/6587835/pexels-photo-6587835.jpeg?auto=compress&cs=tinysrgb&w=1600)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(20,15,10,0.75) 0%, rgba(20,15,10,0.50) 60%, rgba(20,15,10,0.35) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 1.5rem",
            paddingTop: 68,
            paddingBottom: 120, // leave room for stats bar
          }}
        >
          <div
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <p
              style={{
                fontSize: 10,
                letterSpacing: 5,
                color: "#d4a96a",
                textTransform: "uppercase" as const,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              {data.hero.tagline}
            </p>
            <h1
              className="hero-title"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1,
                letterSpacing: -1,
                marginBottom: 8,
              }}
            >
              {data.hero.title}
            </h1>
            <p
              className="hero-subtitle"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 400,
                color: "rgba(255,255,255,0.75)",
                fontStyle: "italic",
                marginBottom: 20,
              }}
            >
              {data.hero.subtitle}
            </p>
            <p
              className="hero-desc"
              style={{
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.7,
                marginBottom: 36,
                maxWidth: 480,
              }}
            >
              {data.hero.description}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap" as const,
                gap: 14,
                alignItems: "center",
              }}
            >
              <button
                onClick={() => navigate("/login")}
                className="btn-primary-hero"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#c17f3a",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: "uppercase" as const,
                  transition: "background 0.25s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#a66b2e"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#c17f3a"; }}
              >
                {data.hero.ctaText} <ArrowRight size={14} />
              </button>

              <a
                href="tel:0123456789"
                className="btn-outline-hero"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  border: "1px solid rgba(255,255,255,0.5)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 500,
                  letterSpacing: 1,
                  textTransform: "uppercase" as const,
                  transition: "border-color 0.25s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.9)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.5)"; }}
              >
                <PhoneIcon size={14} /> {data.hero.ctaSecondary}
              </a>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div
            className="stats-grid"
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 1.5rem",
              display: "grid",
            }}
          >
            {data.stats.map((stat, i) => (
              <div
                key={i}
                className="stat-item"
                style={{
                  padding: "20px 0",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                  className="stat-value"
                >
                  {stat.value}{stat.suffix}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: "rgba(255,255,255,0.55)",
                    textTransform: "uppercase" as const,
                    marginTop: 6,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .hero-title { font-size: clamp(52px, 10vw, 110px); }
        .hero-subtitle { font-size: clamp(20px, 4vw, 40px); }
        .hero-desc { font-size: clamp(14px, 1.8vw, 16px); }
        .btn-primary-hero { padding: 14px 28px; font-size: clamp(12px, 1.5vw, 14px); }
        .btn-outline-hero { padding: 14px 24px; font-size: clamp(12px, 1.5vw, 14px); }
        .stats-grid { grid-template-columns: repeat(4, 1fr); }
        .stat-item + .stat-item { border-left: 1px solid rgba(255,255,255,0.12); }
        .stat-value { font-size: clamp(24px, 3.5vw, 36px); }

        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .stat-item:nth-child(1),
          .stat-item:nth-child(2) { border-bottom: 1px solid rgba(255,255,255,0.12); }
          .stat-item:nth-child(odd) { border-left: none !important; }
          .btn-primary-hero, .btn-outline-hero { width: 100%; justify-content: center; }
        }

        @media (max-width: 480px) {
          .hero-title { font-size: 44px !important; }
          .hero-subtitle { font-size: 20px !important; }
        }
      `}</style>
    </>
  );
};

export default Hero;