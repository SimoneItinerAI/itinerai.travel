import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function Results() {
  const router = useRouter();
  const { from, to, date, people } = router.query;
  const ppl = useMemo(() => Math.max(1, Number(people) || 1), [people]);

  const [images, setImages] = useState({});
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Immagini da Unsplash (con cache locale)
  useEffect(() => {
    async function fetchImages() {
      if (!to) return;
      const city = encodeURIComponent(to);
      const cacheKey = `itinerai_images_${city}`;
      const cached = typeof window !== "undefined" && localStorage.getItem(cacheKey);
      if (cached) { setImages(JSON.parse(cached)); return; }
      const unsplashKey = process.env.NEXT_PUBLIC_UNSPLASH_KEY;
      try {
        const [flightRes, hotelRes, expRes] = await Promise.all([
          fetch(`https://api.unsplash.com/search/photos?query=${city}+airport&per_page=1&orientation=landscape&client_id=${unsplashKey}`),
          fetch(`https://api.unsplash.com/search/photos?query=${city}+hotel&per_page=1&orientation=landscape&client_id=${unsplashKey}`),
          fetch(`https://api.unsplash.com/search/photos?query=${city}+tour+landmark&per_page=1&orientation=landscape&client_id=${unsplashKey}`)
        ]);
        const [flightData, hotelData, expData] = await Promise.all([
          flightRes.json(), hotelRes.json(), expRes.json()
        ]);
        const newImages = {
          flight: flightData.results?.[0]?.urls?.regular || "/fallback-flight.jpg",
          hotel: hotelData.results?.[0]?.urls?.regular || "/fallback-hotel.jpg",
          experience: expData.results?.[0]?.urls?.regular || "/fallback-experience.jpg"
        };
        if (typeof window !== "undefined") localStorage.setItem(cacheKey, JSON.stringify(newImages));
        setImages(newImages);
      } catch (err) {
        setImages({ flight: "/fallback-flight.jpg", hotel: "/fallback-hotel.jpg", experience: "/fallback-experience.jpg" });
      }
    }
    fetchImages();
  }, [to]);

  // Dati mock dal backend interno
  useEffect(() => {
    async function load() {
      if (!from || !to || !date) { setLoading(false); return; }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/itinerary?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}&people=${encodeURIComponent(ppl)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [from, to, date, ppl]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        Il tuo viaggio per <span style={{ color: "#f97316" }}>{to || "..."}</span>
      </h1>
      <p style={styles.subtitle}>
        Da <strong>{from || "-"}</strong> — Partenza il <strong>{date || "-"}</strong> — {ppl} {ppl > 1 ? "viaggiatori" : "viaggiatore"}
      </p>

      <Link href="/" style={styles.back}>← Torna alla Home</Link>

      {loading && (
        <div style={styles.skeletonWrap}>
          <div style={styles.skeletonCard} />
          <div style={styles.skeletonCard} />
          <div style={styles.skeletonCard} />
        </div>
      )}

      {error && (
        <div style={styles.error}>Qualcosa è andato storto: {error}</div>
      )}

      {!loading && !error && (
        <div style={styles.cards}>
          {/* VOLO */}
          <div style={styles.card}>
            {images.flight && <img src={images.flight} alt="Volo" style={styles.image} />}
            <h3 style={styles.cardTitle}>✈️ Volo consigliato</h3>
            <p>
              {data?.flight?.carrier || "ItinerAir"} — {data?.flight?.duration || "3h 35m"}
              <br />
              Prezzo: <strong>{data?.flight?.price || "€ 129"}</strong>
            </p>
          </div>

          {/* HOTEL */}
          <div style={styles.card}>
            {images.hotel && <img src={images.hotel} alt="Hotel" style={styles.image} />}
            <h3 style={styles.cardTitle}>🏨 Hotel suggerito</h3>
            <p>
              {data?.hotel?.name || `Grand Hotel ${to || ''}`} — {data?.hotel?.stars || 4}★
              <br />
              Da <strong>{data?.hotel?.price || "€ 89/notte"}</strong>
            </p>
          </div>

          {/* ESPERIENZA */}
          <div style={styles.card}>
            {images.experience && <img src={images.experience} alt="Esperienza" style={styles.image} />}
            <h3 style={styles.cardTitle}>🎟️ Esperienza consigliata</h3>
            <p>
              {data?.experience?.title || `Tour di ${to || 'città'}`} — {data?.experience?.duration || "4h"}
              <br />
              Prezzo: <strong>{data?.experience?.price || "€ 35"}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Keyframes skeleton iniettati in modo compatibile con SSR */}
      <style jsx global>{`
        @keyframes loading { 0% { background-position: 100% 0 } 100% { background-position: 0 0 } }
      `}</style>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#0f172a", color: "white", textAlign: "center", padding: "120px 20px 60px" },
  title: { fontSize: "2rem", fontWeight: 700, marginBottom: 10 },
  subtitle: { color: "#94a3b8", marginBottom: 30 },
  back: { display: "inline-block", color: "#f97316", textDecoration: "none", marginBottom: 40 },
  cards: { display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" },
  card: { background: "rgba(255,255,255,0.08)", padding: 20, borderRadius: 16, width: 300, textAlign: "left", transition: "transform 0.3s ease, background 0.3s ease" },
  image: { width: "100%", height: 180, objectFit: "cover", borderRadius: 12, marginBottom: 10 },
  cardTitle: { fontSize: "1.2rem", color: "#fff", marginBottom: 8 },
  skeletonWrap: { display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" },
  skeletonCard: { width: 300, height: 250, borderRadius: 16, background: "linear-gradient(90deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.14) 37%, rgba(255,255,255,0.08) 63%)", backgroundSize: "400% 100%", animation: "loading 1.4s ease infinite" },
  error: { color: "#fecaca", background: "#7f1d1d", borderRadius: 12, padding: 12, display: "inline-block", marginBottom: 24 }
};