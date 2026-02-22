const FILTERS = ["For rent", "Price", "Beds/baths", "Home type", "Filters"];

export function FilterBar() {
  return (
    <section className="filter-bar" aria-label="Filtros de propiedades">
      <div className="filter-scroll">
        {FILTERS.map((label) => (
          <button key={label} type="button" className="filter-chip">
            {label}
          </button>
        ))}
      </div>
      <button type="button" className="btn-save">
        Save search
      </button>
    </section>
  );
}
