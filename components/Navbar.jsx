// components/Navbar.jsx
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar({ show }) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  // animazione navbar in page load
  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setVisible(true), 150);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [show]);

  // blocca lo scroll del body quando il menu è aperto
  useEffect(() => {
    if (open && !closing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open, closing]);

  const openMenu = () => setOpen(true);
  const closeMenu = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 300); // durata animazione uscita
  };

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    background: "rgba(15, 23, 42, 0.55)",
    color: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backdropFilter: "saturate(120%) blur(2px)",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(-20px)",
    transition: "opacity 1.2s ease, transform 1.2s ease",
  };

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1.6rem",
    fontWeight: 600,
    margin: "12px 0",
    textAlign: "center",
  };

  return (
    <nav style={navStyle}>
      {/* Logo + Testo */}
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

      {/* Hamburger */}
      <button
        aria-label="Apri menu"
        onClick={openMenu}
        style={{
          fontSize: "1.8rem",
          color: "white",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        ☰
      </button>

      {/* Overlay FULLSCREEN */}
      {open && (
        <div className={`menu-overlay ${closing ? "closing" : "open"}`}>
          <button
            onClick={closeMenu}
            aria-label="Chiudi menu"
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              fontSize: "2rem",
              color: "#fff",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ✕
          </button>

          <div className="menu-content">
            <Link href="/" style={linkStyle} onClick={closeMenu}>
              Home
            </Link>
            <Link href="/destinazioni" style={linkStyle} onClick={closeMenu}>
              Destinazioni
            </Link>
            <Link href="/prenota" style={linkStyle} onClick={closeMenu}>
              Prenota
            </Link>
            <Link href="/contatti" style={linkStyle} onClick={closeMenu}>
              Contatti
            </Link>
            <Link href="/chisiamo" style={linkStyle} onClick={closeMenu}>
              Chi siamo
            </Link>
            <Link href="/login" style={linkStyle} onClick={closeMenu}>
              Accedi / Registrati
            </Link>
          </div>
        </div>
      )}

      {/* CSS in-component */}
      <style jsx>{`
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #0f172a; /* opaco al 100% */
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .menu-overlay.open {
          opacity: 1;
          transform: translateY(0); /* entrata */
        }
        .menu-overlay.closing {
          opacity: 0;
          transform: translateY(-10px); /* uscita */
        }
        .menu-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px;
          width: 100%;
          max-width: 420px;
        }
      `}</style>
    </nav>
  );
}