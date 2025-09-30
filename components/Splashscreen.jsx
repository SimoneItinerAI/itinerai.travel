// components/splashscreen.js
import { useEffect, useState, useRef } from "react";


export default function SplashScreen({ onFinish }) {
const HOLD_MS = 2000; // durata visibile prima dell'animazione
const ANIM_MS = 1200; // durata zoom+fade


const [animate, setAnimate] = useState(false);
const endedRef = useRef(false);


const endSplash = () => {
if (endedRef.current) return;
endedRef.current = true;
setAnimate(true);
setTimeout(() => onFinish(), ANIM_MS);
};


useEffect(() => {
const t = setTimeout(endSplash, HOLD_MS);
return () => clearTimeout(t);
}, []);


return (
<div
onClick={endSplash}
style={{
position: "fixed",
inset: 0,
background: "#0f172a",
display: "flex",
alignItems: "center",
justifyContent: "center",
zIndex: 9999,
overflow: "hidden",
opacity: animate ? 0 : 1,
transform: animate ? "scale(1.5)" : "scale(1)",
transition: `opacity ${ANIM_MS}ms ease, transform ${ANIM_MS}ms ease`,
cursor: "pointer",
}}
aria-label="Tocca per entrare"
>
<div style={{ textAlign: "center" }}>
<img src="/logo.png" alt="ItinerAI Logo" style={{ height: 100, marginBottom: 20 }} />
<h1 style={{ color: "#fff", fontSize: "2rem", margin: 0 }}>
<span style={{ fontWeight: 800 }}>Itiner</span>
<span style={{ color: "#f97316", fontWeight: 800 }}>AI</span>
</h1>
<p style={{ color: "#94a3b8", marginTop: 8, fontSize: 14 }}>Tocca per continuare</p>
</div>
</div>
);
}