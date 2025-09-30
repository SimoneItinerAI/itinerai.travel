// components/Navbar.js
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


const linkStyle = { color: "white", textDecoration: "none" };


return (
<nav style={navStyle}>
{/* Logo + testo */}
<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
<img src="/logo.png" alt="ItinerAI logo" style={{ height: 40 }} />
<span style={{ fontWeight: 700, fontSize: "1.3rem" }}>ItinerAI</span>
</div>


{/* Pulsante hamburger */}
<button className="menu-btn" aria-label="Apri menu" onClick={() => setOpen((v) => !v)}>
☰
</button>


{/* Link desktop / menu mobile */}
<div className={`nav-links ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
<Link href="/" style={linkStyle}>Home</Link>
<Link href="/destinazioni" style={linkStyle}>Destinazioni</Link>
<Link href="/prenota" style={linkStyle}>Prenota</Link>
<Link href="/contatti" style={linkStyle}>Contatti</Link>
</div>
</nav>
);
}