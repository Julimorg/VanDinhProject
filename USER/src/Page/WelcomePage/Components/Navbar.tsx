import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import  { NAV_ITEMS } from "../../../Data/WelcomePageData";
import { PhoneIcon, XIcon, MenuIcon } from "./Icon";


const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNavClick = (sectionId: string) => {
    setMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isLight = scrolled || menuOpen;
  const textColor = isLight ? "#3a3028" : "#fff";

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "all 0.3s ease",
          background: isLight ? "rgba(255,255,255,0.97)" : "transparent",
          borderBottom: isLight ? "1px solid #e8e4dc" : "1px solid transparent",
          backdropFilter: isLight ? "blur(12px)" : "none",
          padding: "0 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 68,
          }}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 1,
                color: textColor,
                transition: "color 0.3s",
              }}
            >
              Vạn Dinh
            </span>
            <span
              style={{
                fontSize: 10,
                letterSpacing: 3,
                color: isLight ? "#8a7f72" : "rgba(255,255,255,0.6)",
                textTransform: "uppercase",
                fontWeight: 500,
                transition: "color 0.3s",
              }}
            >
              Paint
            </span>
          </button>

          {/* Desktop nav links */}
          <div
            style={{
              display: "flex",
              gap: 36,
            }}
            className="nav-links-desktop"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.sectionId}
                onClick={() => handleNavClick(item.sectionId)}
                style={{
                  fontSize: 12,
                  letterSpacing: 1.5,
                  textTransform: "uppercase" as const,
                  color: textColor,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                  opacity: 0.85,
                  transition: "all 0.2s",
                  padding: 0,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop phone */}
          <a
            href="tel:0123456789"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 600,
              color: isLight ? "#c17f3a" : "#fff",
              textDecoration: "none",
              letterSpacing: 0.5,
              transition: "color 0.3s",
            }}
            className="nav-phone-desktop"
          >
            <PhoneIcon size={14} /> 0123 456 789
          </a>

          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: textColor,
              padding: 4,
              transition: "color 0.3s",
            }}
            className="nav-hamburger"
            aria-label="Mở menu"
          >
            {menuOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          background: "#fff",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
          display: "flex",
          flexDirection: "column",
          paddingTop: 68,
        }}
      >
        <div style={{ padding: "32px 1.5rem", display: "flex", flexDirection: "column", gap: 0 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.sectionId}
              onClick={() => handleNavClick(item.sectionId)}
              style={{
                fontSize: 28,
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 700,
                color: "#1a1208",
                background: "none",
                border: "none",
                borderBottom: "1px solid #f0ece3",
                cursor: "pointer",
                padding: "20px 0",
                textAlign: "left",
                letterSpacing: 0.5,
              }}
            >
              {item.label}
            </button>
          ))}

          <a
            href="tel:0123456789"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 32,
              fontSize: 16,
              fontWeight: 600,
              color: "#c17f3a",
              textDecoration: "none",
              letterSpacing: 0.5,
            }}
          >
            <PhoneIcon size={16} /> 0123 456 789
          </a>

          <button
            onClick={() => { setMenuOpen(false); navigate("/login"); }}
            style={{
              marginTop: 20,
              background: "#1a1208",
              color: "#f0ece3",
              border: "none",
              padding: "16px 32px",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase" as const,
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            Đăng Nhập
          </button>
        </div>
      </div>

      {/* Responsive styles via <style> tag */}
      <style>{`
        @media (max-width: 767px) {
          .nav-links-desktop { display: none !important; }
          .nav-phone-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
        @media (min-width: 768px) {
          .nav-hamburger { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;