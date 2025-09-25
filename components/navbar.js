// components/Navbar.js
import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 32px",
      background: "#0f172a",
      color: "#fff",
      position: "sticky",
      top: 0,
      zIndex: 50
    }}>
      <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        Itiner<span style={{ color: "#f97316" }}>AI</span>
      </div>
      <div style={{ display: "flex", gap: "24px" }}>
        <Link href="/">Home</Link>
        <Link href="/destinazioni">Destinazioni</Link>
        <Link href="/prenota">Prenota</Link>
        <Link href="/contatti">Contatti</Link>
      </div>
    </nav>
  );
}
