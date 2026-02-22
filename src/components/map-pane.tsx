const PINS = [
  { id: 1, top: "18%", left: "58%", label: "$1,450" },
  { id: 2, top: "35%", left: "62%", label: "$1,890" },
  { id: 3, top: "42%", left: "54%", label: "$2,100" },
  { id: 4, top: "57%", left: "48%", label: "$1,720" },
  { id: 5, top: "63%", left: "66%", label: "$2,440" },
  { id: 6, top: "74%", left: "56%", label: "$1,630" },
];

export function MapPane() {
  return (
    <aside className="map-pane" aria-label="Mapa de propiedades">
      <div className="map-controls" aria-hidden="true">
        <button type="button">+</button>
        <button type="button">−</button>
      </div>

      <div className="map-grid" />

      {PINS.map((pin) => (
        <button
          key={pin.id}
          type="button"
          className="map-pin"
          style={{ top: pin.top, left: pin.left }}
          aria-label={`Precio ${pin.label}`}
        >
          {pin.label}
        </button>
      ))}
    </aside>
  );
}
