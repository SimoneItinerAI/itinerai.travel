// pages/results.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TransitionScreen from "../components/TransitionScreen";

export default function ResultsPage() {
  const router = useRouter();
  const { from, to, date, people } = router.query;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula tempo di caricamento (2s)
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <TransitionScreen />;
  }

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Risultati della tua ricerca</h1>
      <p><strong>Partenza:</strong> {from}</p>
      <p><strong>Arrivo:</strong> {to}</p>
      <p><strong>Data:</strong> {date}</p>
      <p><strong>Persone:</strong> {people}</p>

      <p style={{ marginTop: "20px" }}>
        🚀 In futuro qui mostreremo voli, hotel ed esperienze collegati alle API.
      </p>
    </div>
  );
}
