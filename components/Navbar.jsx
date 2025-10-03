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
    display: "block",
    padding: "16px 0",
    color: "#fff",
    textDecoration: "none",
    fontSize: "1.2rem",
    fontWeight: 500,
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
          fontSize: "1.5rem",
          color: "white",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        ☰
      </button>

      {/* Overlay menu mobile */}
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <button
          onClick={() => setOpen(false)}
          style={{
            alignSelf: "flex-end",
            fontSize: "1.8rem",
            color: "#fff",
            background: "none",
            border: "none",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          ✕
        </button>

        <Link href="/" style={linkStyle} onClick={() => setOpen(false)}>Home</Link>
        <Link href="/destinazioni" style={linkStyle} onClick={() => setOpen(false)}>Destinazioni</Link>
        <Link href="/prenota" style={linkStyle} onClick={() => setOpen(false)}>Prenota</Link>
        <Link href="/contatti" style={linkStyle} onClick={() => setOpen(false)}>Contatti</Link>
        <Link href="/chisiamo" style={linkStyle} onClick={() => setOpen(false)}>Chi siamo</Link>
        <Link href="/login" style={linkStyle} onClick={() => setOpen(false)}>Accedi / Registrati</Link>
      </div>

      {/* Stili e animazioni */}
      <style jsx>{`
        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 75%;
          background: #0f172a; /* sfondo opaco */
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          z-index: 999;
          transform: translateX(100%);
          transition: transform 0.4s ease;
        }

        .mobile-menu.open {
          transform: translateX(0); /* entra */
        }

        .mobile-menu.closing {
          transform: translateX(100%); /* esce */
        }
      `}</style>
    </nav>
  );
}