// pages/index.js
import Head from "next/head";
import Hero from "../components/hero.js";
import Newsletter from "../components/newsletter.js";

export default function Home({ show }) {
return (
<>
<Head>
<title>ItinerAI – Itinerari di viaggio intelligenti</title>
<meta name="description" content="Trova voli, hotel ed esperienze con l'aiuto di ItinerAI. Pianificazione semplice e veloce." />
<meta property="og:title" content="ItinerAI – Itinerari di viaggio intelligenti" />
<meta property="og:description" content="Trova voli, hotel ed esperienze con l'aiuto di ItinerAI." />
<meta property="og:image" content="/hero-bg.jpg" />
</Head>
<Hero show={show} />
<Newsletter />
</>
);
}