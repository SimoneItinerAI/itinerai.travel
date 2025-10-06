// ============================================================
// FILE: /pages/results.jsx
// SCOPO: Pagina risultati - visualizza immagini reali da Unsplash
// ============================================================
// pages/results.jsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Results() {
  const router = useRouter();
  const { from, to, date, people } = router.query;

  const [images, setImages] = useState({});

  // 🔹 Fetch dinamico delle immagini da Unsplash
// 🔹 Fetch immagini tematiche da Unsplash
// 🔹 Gestione dinamica delle immagini da Unsplash con cache locale
useEffect(() => {
  async function fetchImages() {
    if (!to) return;

    const city = encodeURIComponent(to);
    const cacheKey = `itinerai_images_${city}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      console.log("🧠 Immagini caricate da cache:", city);
      setImages(JSON.parse(cached));
      return;
    }

    const unsplashKey = process.env.NEXT_PUBLIC_UNSPLASH_KEY;

    try {
      // Tre richieste distinte a Unsplash
      const [flightRes, hotelRes, expRes] = await Promise.all([
        fetch(`https://api.unsplash.com/search/photos?query=${city}+airport+airplane+airportboard&per_page=1&orientation=landscape&client_id=${unsplashKey}`),
        fetch(`https://api.unsplash.com/search/photos?query=${city}+hotel+room+resort&per_page=1&orientation=landscape&client_id=${unsplashKey}`),
        fetch(`https://api.unsplash.com/search/photos?query=${city}+tour+landscape+monument+experience&per_page=1&orientation=landscape&client_id=${unsplashKey}`)
      ]);

      const [flightData, hotelData, expData] = await Promise.all([
        flightRes.json(),
        hotelRes.json(),
        expRes.json()
      ]);

      const newImages = {
        flight: flightData.results?.[0]?.urls?.regular || "/fallback-flight.jpg",
        hotel: hotelData.results?.[0]?.urls?.regular || "/fallback-hotel.jpg",
        experience: expData.results?.[0]?.urls?.regular || "/fallback-experience.jpg"
      };

      // Salva in cache per futuri accessi
      localStorage.setItem(cacheKey, JSON.stringify(newImages));
      setImages(newImages);
    } catch (err) {
      console.error("❌ Errore nel caricamento immagini:", err);
      setImages({
        flight: "/fallback-flight.jpg",
        hotel: "/fallback-hotel.jpg",
        experience: "/fallback-experience.jpg"
      });
    }
  }

  fetchImages();
}, [to]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        Il tuo viaggio per <span style={{ color: "#f97316" }}>{to || "..."}</span>
      </h1>
      <p style={styles.subtitle}>
        Da <strong>{from}</strong> — Partenza il <strong>{date}</strong> —{" "}
        {people} {people > 1 ? "viaggiatori" : "viaggiatore"}
      </p>

      <Link href="/" style={styles.back}>
        ← Torna alla Home
      </Link>

      <div style={styles.cards}>
        {/* --- VOLO --- */}
        <div style={styles.card}>
          {images.flight && <img src={images.flight} alt="Volo" style={styles.image} />}
          <h3 style={styles.cardTitle}>✈️ Volo consigliato</h3>
          <p>
            Partenza da <strong>{from}</strong>, arrivo a <strong>{to}</strong>.
            <br />
            Compagnia: ItinerAir • Durata: 3h 35m
          </p>
        </div>

        {/* --- HOTEL --- */}
        <div style={styles.card}>
          {images.hotel && <img src={images.hotel} alt="Hotel" style={styles.image} />}
          <h3 style={styles.cardTitle}>🏨 Hotel suggerito</h3>
          <p>
            "Grand Hotel {to}" — 4 stelle, posizione centrale, colazione inclusa.
            <br />
            Valutazione: ★★★★☆ (8.7/10)
          </p>
        </div>

        {/* --- ESPERIENZA --- */}
        <div style={styles.card}>
          {images.experience && <img src={images.experience} alt="Esperienza" style={styles.image} />}
          <h3 style={styles.cardTitle}>🎟️ Esperienza consigliata</h3>
          <p>
            Scopri le meraviglie di {to}: tour guidato, cucina locale e panorami mozzafiato.
            <br />
            Durata: 4 ore • Guida inclusa
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------
// STILI
// ---------------------------
const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    textAlign: "center",
    padding: "120px 20px 60px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: 10,
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: 30,
  },
  back: {
    display: "inline-block",
    color: "#f97316",
    textDecoration: "none",
    marginBottom: 40,
  },
  cards: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    flexWrap: "wrap",
  },
  card: {
    background: "rgba(255,255,255,0.08)",
    padding: 20,
    borderRadius: 16,
    width: 300,
    textAlign: "left",
    transition: "transform 0.3s ease, background 0.3s ease",
  },
  image: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 12,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: "1.2rem",
    color: "#fff",
    marginBottom: 8,
  },
};
