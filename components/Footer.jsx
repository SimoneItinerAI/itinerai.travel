// components/Footer.jsx
import Link from "next/link";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/destinazioni">Destinazioni</Link>
          <Link href="/prenota">Prenota</Link>
          <Link href="/contatti">Contatti</Link>
        </div>

        <div className="footer-social">
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <FaInstagram />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <FaTwitter />
          </a>
        </div>

        <p style={{ opacity: 0.7, fontSize: "0.9rem" }}>
          © {new Date().getFullYear()} ItinerAI – Tutti i diritti riservati
        </p>
      </div>
    </footer>
  );
}
