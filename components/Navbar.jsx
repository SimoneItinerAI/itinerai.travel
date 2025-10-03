// components/Navbar.jsx
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar({ show }) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setVisible(true), 150);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [show]);

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
    margin: "16px 0",
    textAlign: "center",
  };

  return (
    <nav style={navStyle}>
      {/* Logo + Testo cliccabili */}
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

      {/* Pulsante hamburger */}
      <button
        aria-label="Apri menu"
        onClick={() => setOpen(true)}
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

      {/* Menu fullscreen */}
      {open && (
        <div className="menu-overlay">
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              top: 20,
              right: 30,
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
            <Link href="/" style={linkStyle} onClick={() => setOpen(false)}>Home</Link>
            <Link href="/destinazioni" style={linkStyle} onClick={() => setOpen(false)}>Destinazioni</Link>
            <Link href="/prenota" style={linkStyle} onClick={() => setOpen(false)}>Prenota</Link>
            <Link href="/contatti" style={linkStyle} onClick={() => setOpen(false)}>Contatti</Link>
            <Link href="/chisiamo" style={linkStyle} onClick={() => setOpen(false)}>Chi siamo</Link>
            <Link href="/login" style={linkStyle} onClick={() => setOpen(false)}>Accedi / Registrati</Link>
          </div>
        </div>
      )}

      {/* Stili CSS */}
      <style jsx>{`
        .menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.95); /* sfondo opaco scuro */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 999;
          animation: fadeIn 0.4s ease forwards;
        }

        .menu-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </nav>
  );
}