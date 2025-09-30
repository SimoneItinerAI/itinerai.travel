// components/Hero.js
import { useEffect, useState } from "react";


export default function Hero({ show }) {
const [visible, setVisible] = useState(false);


useEffect(() => {
if (show) {
const t = setTimeout(() => setVisible(true), 50); // parte subito dopo lo splash
return () => clearTimeout(t);
} else {
setVisible(false);
}
}, [show]);


const section = {
backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/hero-bg.jpg')",
backgroundSize: "cover",
backgroundPosition: "center",
color: "white",
textAlign: "center",
padding: "140px 20px 80px",
minHeight: "100vh",
width: "100%",
display: "flex",
flexDirection: "column",
justifyContent: "center",
opacity: visible ? 1 : 0,
transform: visible ? "scale(1)" : "scale(0.95)",
transition: "opacity 1.5s ease, transform 1.5s ease",
};


const inputStyle = { padding: 12, borderRadius: 6, border: "1px solid #ccc" };
const buttonStyle = { padding: 14, borderRadius: 6, border: "none", background: "#f97316", color: "#fff", fontWeight: 700, cursor: "pointer" };


return (
<section style={section}>
<h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: 16 }}>
Trova il tuo prossimo viaggio con <span style={{ color: "#f97316" }}>ItinerAI</span>
</h1>
<p style={{ marginBottom: 32, fontSize: "1.2rem" }}>Cerca voli, hotel ed esperienze in pochi clic</p>


<form onSubmit={(e) => e.preventDefault()} className="hero-form">
<input type="text" placeholder="Da" style={inputStyle} aria-label="Partenza" />
<input type="text" placeholder="A" style={inputStyle} aria-label="Destinazione" />
<input type="date" style={inputStyle} aria-label="Data" />
<select style={inputStyle} aria-label="Persone">
<option>1 persona</option>
<option>2 persone</option>
<option>3 persone</option>
<option>4 persone</option>
</select>
<button type="submit" style={buttonStyle}>Cerca</button>
</form>
</section>
);
}
