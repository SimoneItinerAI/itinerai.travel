// components/Navbar.jsx
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function Navbar({ show }) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Mostra navbar con fade
  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setVisible(true), 150);
      return () => clearTimeout(t);
    } else setVisible(false);
  }, [show]);

  // Sticky + cambio colore dopo scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Blocca scroll su mobile quando menu aperto
  useEffect(() => {
    if (open && !closing) {
      const y = window.scrollY;
      setScrollY(y);
      document.body.style.position = "fixed";
      document.body.style.top = `-${y}px`;
      document.body.style.width = "100%";
    } else {
      const y = scrollY;
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, y);
    }
  }, [open, closing]);

  const openMenu = () => setOpen(true);
  const closeMenu = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 300);
  };

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    background: scrolled ? "#0f172a" : "rgba(15, 23, 42, 0.4)",
    color: "#fff",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backdropFilter: "saturate(120%) blur(4px)",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(-20px)",
    transition: "background 0.4s ease, opacity 1s ease, transform 0.6s ease",
  };

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1.1rem",
    fontWeight: 500,
    margin: "0 12 px",
    position: "relative",
  };

  return (
    <nav style={navStyle}>
      {/* LOGO */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          textDecoration: "none",
          color: "white",
        }}
      >
        <img src="/logo.png" alt="ItinerAI logo" style={{ height: 40 }} />
        <span style={{ fontWeight: 700, fontSize: "1.3rem" }}>ItinerAI</span>
      </Link>

      {/* LINKS DESKTOP */}
      <div className="nav-links">
        <Link href="/" style={linkStyle}>Home</Link>

        {/* Dropdown Destinazioni */}
<div
  className="dropdown"
  onMouseEnter={() => {
    if (window.dropdownTimer) clearTimeout(window.dropdownTimer);
    setDropdownOpen(true);
  }}
  onMouseLeave={() => {
    window.dropdownTimer = setTimeout(() => setDropdownOpen(false), 200);
  }}
>
  <button
    style={{
      ...linkStyle,
      cursor: "pointer",
      background: "none",
      border: "none",
      display: "flex",
      alignItems: "center",
      gap: 4,
    }}
  >
    Destinazioni <FaChevronDown size={12} />
  </button>

  <div
    className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}
    onMouseEnter={() => {
      if (window.dropdownTimer) clearTimeout(window.dropdownTimer);
      setDropdownOpen(true);
    }}
    onMouseLeave={() => {
      window.dropdownTimer = setTimeout(() => setDropdownOpen(false), 200);
    }}
  >
    <Link href="/continents/europa" style={linkStyle}>Europa</Link>
    <Link href="/continents/asia" style={linkStyle}>Asia</Link>
    <Link href="/continents/america" style={linkStyle}>America</Link>
    <Link href="/continents/africa" style={linkStyle}>Africa</Link>
    <Link href="/continents/oceania" style={linkStyle}>Oceania</Link>
  </div>
</div>

        <Link href="/prenota" style={linkStyle}>Prenota</Link>
        <Link href="/contatti" style={linkStyle}>Contatti</Link>
        <Link href="/chisiamo" style={linkStyle}>Chi siamo</Link>
        <Link href="/login" style={{ ...linkStyle, color: "#f97316", fontWeight: 600 }}>
          Accedi / Registrati
        </Link>

        {/* Selettore lingua/valuta */}
        <div className="language-selector">
          <span>🇮🇹 IT</span> | <span>🇬🇧 EN</span> &nbsp;•&nbsp; <span>€ / $</span>
        </div>
      </div>

      {/* HAMBURGER (mobile) */}
      <button
        className="menu-btn"
        aria-label="Apri menu"
        onClick={openMenu}
      >
        ☰
      </button>

      {/* MENU MOBILE */}
      {open && (
        <div className={`menu-overlay ${closing ? "closing" : "open"}`}>
          <button onClick={closeMenu} aria-label="Chiudi menu" className="close-btn">
            ✕
          </button>

          <div className="menu-content">
            <Link href="/" style={linkStyle} onClick={closeMenu}>Home</Link>

            {/* Dropdown mobile */}
            <details className="mobile-dropdown">
              <summary>Destinazioni</summary>
              <Link href="/continents/europa" onClick={closeMenu}>Europa</Link>
              <Link href="/continents/asia" onClick={closeMenu}>Asia</Link>
              <Link href="/continents/america" onClick={closeMenu}>America</Link>
              <Link href="/continents/africa" onClick={closeMenu}>Africa</Link>
              <Link href="/continents/oceania" onClick={closeMenu}>Oceania</Link>
            </details>

            <Link href="/prenota" onClick={closeMenu}>Prenota</Link>
            <Link href="/contatti" onClick={closeMenu}>Contatti</Link>
            <Link href="/chisiamo" onClick={closeMenu}>Chi siamo</Link>
            <Link href="/login" onClick={closeMenu} style={{ color: "#f97316", fontWeight: 600 }}>
              Accedi / Registrati
            </Link>
            <div className="mobile-lang">🇮🇹 IT | 🇬🇧 EN • € / $</div>
          </div>
        </div>
      )}

      {/* STILI */}
      <style jsx>{`
        /* Links Desktop */
        .nav-links {
          display: flex;
          align-items: center;
        }

        /* Dropdown Desktop */
        .dropdown {
          position: relative;
        }
        .dropdown-menu {
  position: absolute;
  top: 45px;
  left: 0;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(8px);
  padding: 12px 18px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-10px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.dropdown-menu.show {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.dropdown-menu a {
  color: #f8fafc;                /* testo chiaro */
  padding: 8px 0;
  text-decoration: none;
  transition: color 0.2s ease;
}

.dropdown-menu a:hover {
  color: #f97316;                /* arancione brand */
  text-decoration: none;
}
  
        /* Lingua e valuta */
        .language-selector {
          margin-left: 24px;
          font-size: 0.95rem;
          color: #e2e8f0;
        }

        /* Pulsante Mobile */
        .menu-btn {
          display: none;
          font-size: 1.8rem;
          color: white;
          background: none;
          border: none;
          cursor: pointer;
        }

        /* Overlay Mobile */
        .menu-overlay {
          position: fixed;
          inset: 0;
          background: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .menu-overlay.open {
          opacity: 1;
          transform: translateY(0);
        }
        .menu-overlay.closing {
          opacity: 0;
          transform: translateY(-10px);
        }
        .menu-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .mobile-dropdown summary {
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          margin-bottom: 8px;
        }

        .mobile-dropdown a {
          color: #e2e8f0;
          text-decoration: none;
          margin: 4px 0;
        }

        .mobile-lang {
          margin-top: 16px;
          color: #94a3b8;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 24px;
          font-size: 2rem;
          color: #fff;
          background: none;
          border: none;
          cursor: pointer;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .menu-btn {
            display: block;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}

