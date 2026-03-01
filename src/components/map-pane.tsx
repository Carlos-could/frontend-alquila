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
    <aside className="relative min-h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-cyan-100 to-emerald-100 p-4 shadow-sm" aria-label="Mapa de propiedades">
      <div className="absolute right-4 top-4 z-20 flex flex-col gap-2" aria-hidden="true">
        <button type="button" className="h-9 w-9 rounded-md border border-slate-300 bg-white text-lg font-semibold text-slate-700 shadow-sm">
          +
        </button>
        <button type="button" className="h-9 w-9 rounded-md border border-slate-300 bg-white text-lg font-semibold text-slate-700 shadow-sm">
          −
        </button>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.6),transparent_35%),linear-gradient(to_right,rgba(2,132,199,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(2,132,199,0.12)_1px,transparent_1px)] bg-[length:auto,24px_24px,24px_24px]" />

      {PINS.map((pin) => (
        <button
          key={pin.id}
          type="button"
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-300 bg-white px-3 py-1 text-xs font-semibold text-rose-700 shadow"
          style={{ top: pin.top, left: pin.left }}
          aria-label={`Precio ${pin.label}`}
        >
          {pin.label}
        </button>
      ))}
    </aside>
  );
}
