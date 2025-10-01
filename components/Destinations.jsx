// components/Destinations.jsx
export default function Destinations() {
  const places = [
    {
      name: "Roma",
      price: "da €120",
      image: "/destinations/rome.jpg",
    },
    {
      name: "Parigi",
      price: "da €150",
      image: "/destinations/paris.jpg",
    },
    {
      name: "Tokyo",
      price: "da €700",
      image: "/destinations/tokyo.jpg",
    },
  ];

  const onImgError = (e) => {
    e.currentTarget.src = "/destinations/placeholder.jpg"; // opzionale
  };

  return (
    <section className="destinations">
      <h2>Destinazioni popolari</h2>
      <div className="destinations-grid">
        {places.map((place, index) => (
          <div className="destination-card" key={index}>
            <img
              src={place.image}
              alt={place.name}
              loading="lazy"
              onError={onImgError}
            />
            <h3>{place.name}</h3>
            <p>{place.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
