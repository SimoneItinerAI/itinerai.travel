// components/Hero.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TransitionScreen from "./TransitionScreen";
import AutocompleteInput from "./AutocompleteInput";

import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaCalendarAlt,
  FaUser,
  FaExchangeAlt,
} from "react-icons/fa";

export default function Hero({ show }) {
  const [visible, setVisible] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(1);
  const [showTransition, setShowTransition] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [show]);

  const today = new Date().toISOString().split("T")[0];

  const swapPlaces = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mostra la transizione
    setShowTransition(true);

    // Dopo 2s → vai alla pagina risultati
    setTimeout(() => {
      router.push({
        pathname: "/results",
        query: { from, to, date, people },
      });
    }, 2000);
  };

  const section = {
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/hero-bg.jpg')",
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

  const inputGroup = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,255,255,0.1)",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#fff",
  };

  const input = {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: "1rem",
  };

  const button = {
    padding: "14px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#f97316",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    transition: "background 0.3s ease",
  };

  return (
    <section style={section}>
      <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: 16 }}>
        Scopri il mondo con{" "}
        <span style={{ color: "#f97316" }}>ItinerAI</span>
      </h1>

      <p
        style={{
          marginBottom: 16,
          fontSize: "1.2rem",
          lineHeight: "1.6",
          maxWidth: "700px",
          marginLeft: "auto",
          marginRight: "auto",
          color: "#e2e8f0",
        }}
      >
        Il tuo assistente di viaggio intelligente: trova voli, hotel,
        ristoranti, esperienze e tanto altro su misura per te in pochi secondi.
      </p>

      {/* Bottone secondario */}
      <button
        onClick={() =>
          document
            .querySelector("#destinations")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        style={{
          display: "inline-block",
          marginBottom: 32,
          padding: "12px 20px",
          background: "transparent",
          border: "2px solid #f97316",
          color: "#f97316",
          borderRadius: "8px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Scopri le destinazioni ↓
      </button>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "12px",
          maxWidth: "700px",
          margin: "0 auto",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        {/* Partenza */}
        <div style={inputGroup}>
          <FaPlaneDeparture />
          <AutocompleteInput value={from} setValue={setFrom} placeholder="Da" />
        </div>

        {/* Arrivo */}
        <div style={inputGroup}>
          <FaPlaneArrival />
          <AutocompleteInput value={to} setValue={setTo} placeholder="A" />
        </div>

        {/* Bottone swap */}
        <button
          type="button"
          onClick={swapPlaces}
          style={{
            gridColumn: "span 2",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <FaExchangeAlt /> Inverti partenza e arrivo
        </button>

        {/* Data */}
        <div style={inputGroup}>
          <FaCalendarAlt />
          <input
            type="date"
            style={input}
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Persone con stepper */}
        <div style={inputGroup}>
          <FaUser />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={() => setPeople((p) => Math.max(1, p - 1))}
              style={{ ...button, padding: "6px 12px" }}
            >
              –
            </button>
            <span>{people}</span>
            <button
              type="button"
              onClick={() => setPeople((p) => p + 1)}
              style={{ ...button, padding: "6px 12px" }}
            >
              +
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          style={{ ...button, gridColumn: "span 2", fontSize: "1.1rem" }}
        >
          Cerca
        </button>
      </form>

      {/* TransitionScreen solo al submit */}
      {showTransition && <TransitionScreen />}
    </section>
  );
}
