import { useEffect, useState } from "react";

export default function TransitionScreen() {
  const phrases = [
    "Ogni viaggio inizia con un click…",
    "Il mondo è a un passo da te.",
    "Prepara la valigia, pensiamo noi al resto.",
    "Scopri, esplora, vivi.",
    "ItinerAI: la bussola dei tuoi viaggi.",
    "Non sognare il viaggio, vivilo."
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 1000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        zIndex: 9999,
        color: "#fff",
        gap: "24px",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {/* Logo fisso */}
      <img
        src="/logo.png"
        alt="ItinerAI"
        style={{
          height: 100,
          animation: "pulse 3s infinite ease-in-out, glow 4s infinite ease-in-out",
        }}
      />

      {/* Frase che cambia */}
      <p
        key={index} // 👈 forza l’animazione a ogni cambio frase
        style={{
          fontSize: "1.4rem",
          fontWeight: 600,
          maxWidth: "600px",
          lineHeight: 1.5,
          color: "#f97316",
          animation: "fadeIn 1s ease",
        }}
      >
        {phrases[index]}
      </p>

      {/* Animazioni CSS */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes glow {
          0% {
            filter: drop-shadow(0 0 2px #f97316);
          }
          50% {
            filter: drop-shadow(0 0 10px #f97316);
          }
          100% {
            filter: drop-shadow(0 0 2px #f97316);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}


