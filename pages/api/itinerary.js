// API mock per generare un itinerario base (voli, hotel, esperienza)
export default function handler(req, res) {
  const { from = "", to = "", date = "", people = 1 } = req.query;

  // Mock semplice con prezzi dinamici in base al numero di persone
  const p = Number(people) || 1;
  const baseFlight = 79; // €
  const baseHotel = 75;  // €/notte
  const baseExp = 29;    // €

  const payload = {
    meta: { from, to, date, people: p },
    flight: {
      carrier: "ItinerAir",
      duration: "3h 35m",
      price: `€ ${baseFlight * p}`,
    },
    hotel: {
      name: `Grand Hotel ${to || "Centro"}`.trim(),
      stars: 4,
      price: `€ ${baseHotel} / notte`,
    },
    experience: {
      title: `Tour guidato di ${to || "città"}`,
      duration: "4h",
      price: `€ ${baseExp * p}`,
    },
  };

  res.status(200).json(payload);
}