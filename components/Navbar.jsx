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
    padding: "12px 0",
    color: "#fff",
    textDecoration: "none",
    fontSize: "1.1rem",
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
        className="menu-btn"
        aria-label="Apri menu"
        onClick={() => setOpen((v) => !v)}
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

      {/* Menu mobile (overlay) */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "70%",
            background: "#0f172a",
            padding: "40px 20px",
            display: "flex",
            flexDirection: "column",
            zIndex: 999,
            animation: "slideIn 0.3s ease",
          }}
        >
          <button
            onClick={() => setOpen(false)}
            style={{
              alignSelf: "flex-end",
              fontSize: "1.5rem",
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
      )}

      {/* Animazioni CSS */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  );
}