import React, { useEffect } from "react";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Footer from "./Components/Footer";
import BrandsSection from "./Components/BrandSlider";
import CTA from "./Components/Cta";
import Features from "./Components/FeaturesCard";
import Gallery from "./Components/Gallery";
import Products from "./Components/Product";
import Services from "./Components/Services";
import Testimonials from "./Components/TestimonialCard";

const WelcomePage: React.FC = () => {
  // Load Cormorant Garamond font
  useEffect(() => {
    const existing = document.querySelector('link[data-font="cormorant"]');
    if (!existing) {
      const link = document.createElement("link");
      link.href =
        "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,700&display=swap";
      link.rel = "stylesheet";
      link.dataset.font = "cormorant";
      document.head.appendChild(link);
    }

    // Global resets
    const style = document.createElement("style");
    style.dataset.id = "welcome-base";
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
      body { margin: 0; font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; }
      h1, h2, h3, h4, h5, h6 { margin: 0; }
      p { margin: 0; }
      button { font-family: inherit; }
      a { text-decoration: none; }
      img { max-width: 100%; }

      /* Smooth scroll across whole page */
      html { scroll-behavior: smooth; }

      /* Responsive section spacing */
      @media (max-width: 768px) {
        section { padding-top: 60px !important; padding-bottom: 60px !important; }
      }
      @media (max-width: 480px) {
        section { padding-top: 48px !important; padding-bottom: 48px !important; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />
      <Hero />
      <Products />
      <Features />
      <BrandsSection />
      <Gallery />
      <Testimonials />
      <Services />
      <CTA />
      <Footer />
    </div>
  );
};

export default WelcomePage;