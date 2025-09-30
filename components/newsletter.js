// components/Newsletter.js
import { useState } from "react";


export default function Newsletter() {
const [email, setEmail] = useState("");


const onSubmit = (e) => {
e.preventDefault();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
alert("Inserisci un'email valida");
return;
}
alert(`Grazie! Ti iscriveremo a breve: ${email}`);
setEmail("");
};


return (
<section className="newsletter">
<div className="newsletter-inner">
<h2 style={{ margin: 0 }}>Resta aggiornato sulle migliori offerte</h2>
<p style={{ margin: 0, opacity: 0.9 }}>Iscriviti alla newsletter di ItinerAI</p>
<form className="newsletter-form" onSubmit={onSubmit}>
<input type="email" placeholder="La tua email" value={email} onChange={(e) => setEmail(e.target.value)} />
<button type="submit">Invia</button>
</form>
</div>
</section>
);
}