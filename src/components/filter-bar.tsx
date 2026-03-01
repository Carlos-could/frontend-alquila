import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <form className="mt-3 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-[repeat(7,minmax(0,1fr))_auto_auto]" aria-label="Filtros de propiedades" method="GET" action="/">
      <Label>
        Ciudad
        <Input name="city" defaultValue={city} placeholder="Ej: Madrid" />
      </Label>
      <Label>
        Precio min
        <Input name="minPrice" type="number" min="0" step="1" defaultValue={minPrice} />
      </Label>
      <Label>
        Precio max
        <Input name="maxPrice" type="number" min="0" step="1" defaultValue={maxPrice} />
      </Label>
      <Label>
        Habitaciones
        <Input name="bedrooms" type="number" min="0" step="1" defaultValue={bedrooms} />
      </Label>
      <Label>
        Amueblado
        <select className="h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" name="isFurnished" defaultValue={furnished}>
          <option value="">Todos</option>
          <option value="true">Si</option>
          <option value="false">No</option>
        </select>
      </Label>
      <Label>
        Orden
        <select className="h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" name="sort" defaultValue={sort}>
          <option value="newest">Mas recientes</option>
          <option value="price_asc">Menor precio</option>
          <option value="price_desc">Mayor precio</option>
        </select>
      </Label>
      <Label>
        Tamano pagina
        <select className="h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" name="pageSize" defaultValue={pageSize}>
          <option value="6">6</option>
          <option value="12">12</option>
          <option value="24">24</option>
        </select>
      </Label>
      <input type="hidden" name="page" value="1" />
      <Button type="submit" className="self-end">
        Aplicar
      </Button>
      <Link href="/" className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 px-4 text-sm font-medium hover:bg-slate-50">
        Limpiar
      </Link>
    </form>
  );
}
