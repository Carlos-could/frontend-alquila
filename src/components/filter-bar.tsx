import Link from "next/link";

type FilterBarProps = {
  city: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  furnished: string;
  sort: string;
  pageSize: string;
};

export function FilterBar({ city, minPrice, maxPrice, bedrooms, furnished, sort, pageSize }: FilterBarProps) {
  return (
    <form className="filter-bar" aria-label="Filtros de propiedades" method="GET" action="/">
      <label>
        Ciudad
        <input name="city" defaultValue={city} placeholder="Ej: Madrid" />
      </label>
      <label>
        Precio min
        <input name="minPrice" type="number" min="0" step="1" defaultValue={minPrice} />
      </label>
      <label>
        Precio max
        <input name="maxPrice" type="number" min="0" step="1" defaultValue={maxPrice} />
      </label>
      <label>
        Habitaciones
        <input name="bedrooms" type="number" min="0" step="1" defaultValue={bedrooms} />
      </label>
      <label>
        Amueblado
        <select name="isFurnished" defaultValue={furnished}>
          <option value="">Todos</option>
          <option value="true">Si</option>
          <option value="false">No</option>
        </select>
      </label>
      <label>
        Orden
        <select name="sort" defaultValue={sort}>
          <option value="newest">Mas recientes</option>
          <option value="price_asc">Menor precio</option>
          <option value="price_desc">Mayor precio</option>
        </select>
      </label>
      <label>
        Tamano pagina
        <select name="pageSize" defaultValue={pageSize}>
          <option value="6">6</option>
          <option value="12">12</option>
          <option value="24">24</option>
        </select>
      </label>
      <input type="hidden" name="page" value="1" />
      <button type="submit" className="btn-save">
        Aplicar
      </button>
      <Link href="/" className="btn-clear">
        Limpiar
      </Link>
    </form>
  );
}
