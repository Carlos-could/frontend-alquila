import Link from "next/link";
import { FilterBar } from "@/components/filter-bar";
import { MapPane } from "@/components/map-pane";
import { PropertyCard, type Property } from "@/components/property-card";
import { TopNav } from "@/components/top-nav";
import { listPublicProperties } from "@/features/properties/public-api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80";

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseNonNegativeNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function parseNonNegativeInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function toQueryString(params: URLSearchParams): string {
  const query = params.toString();
  return query ? `?${query}` : "";
}

function getPageHref(searchParams: SearchParams, nextPage: number): string {
  const query = new URLSearchParams();
  const keys = ["city", "minPrice", "maxPrice", "bedrooms", "isFurnished", "sort", "pageSize"] as const;
  for (const key of keys) {
    const value = firstValue(searchParams[key]);
    if (value && value.trim() !== "") {
      query.set(key, value);
    }
  }
  query.set("page", String(nextPage));
  return `/${toQueryString(query)}`;
}

export default async function HomePage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const city = (firstValue(resolvedSearchParams.city) ?? "").trim();
  const minPriceRaw = (firstValue(resolvedSearchParams.minPrice) ?? "").trim();
  const maxPriceRaw = (firstValue(resolvedSearchParams.maxPrice) ?? "").trim();
  const bedroomsRaw = (firstValue(resolvedSearchParams.bedrooms) ?? "").trim();
  const isFurnishedRaw = (firstValue(resolvedSearchParams.isFurnished) ?? "").trim();
  const sortRaw = (firstValue(resolvedSearchParams.sort) ?? "newest").trim();
  const pageSizeRaw = (firstValue(resolvedSearchParams.pageSize) ?? "12").trim();
  const pageRaw = firstValue(resolvedSearchParams.page);

  const page = parsePositiveInt(pageRaw, 1);
  const pageSize = parsePositiveInt(pageSizeRaw, 12);

  const propertiesResult = await listPublicProperties({
    city: city || undefined,
    minPrice: parseNonNegativeNumber(minPriceRaw),
    maxPrice: parseNonNegativeNumber(maxPriceRaw),
    bedrooms: parseNonNegativeInt(bedroomsRaw),
    isFurnished: isFurnishedRaw === "true" ? true : isFurnishedRaw === "false" ? false : undefined,
    sort: sortRaw === "price_asc" || sortRaw === "price_desc" ? sortRaw : "newest",
    page,
    pageSize,
  });

  const cards: Property[] = propertiesResult.items.map((property) => ({
    id: property.id,
    price: property.monthlyPrice,
    beds: property.bedrooms,
    baths: property.bathrooms,
    address: property.address ?? property.title,
    city: property.city,
    imageUrl: property.coverImageUrl ?? FALLBACK_IMAGE,
  }));

  return (
    <main className="min-h-dvh bg-gradient-to-b from-slate-100 to-slate-50 p-3">
      <TopNav />
      <FilterBar
        city={city}
        minPrice={minPriceRaw}
        maxPrice={maxPriceRaw}
        bedrooms={bedroomsRaw}
        furnished={isFurnishedRaw}
        sort={sortRaw}
        pageSize={String(pageSize)}
      />

      <section className="mt-4 flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Listado publico de inmuebles</h1>
        <p className="text-sm text-slate-600">
          {propertiesResult.totalItems} resultados | Pagina {propertiesResult.page}
          {propertiesResult.totalPages > 0 ? ` de ${propertiesResult.totalPages}` : ""}
        </p>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {cards.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          {cards.length === 0 ? <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">No hay inmuebles para esos filtros.</p> : null}
          <div className="flex items-center gap-2">
            <Link
              href={getPageHref(resolvedSearchParams, Math.max(1, propertiesResult.page - 1))}
              aria-disabled={propertiesResult.page <= 1}
              className={
                propertiesResult.page <= 1
                  ? "pointer-events-none inline-flex h-10 items-center rounded-md border border-slate-200 px-4 text-sm text-slate-400"
                  : "inline-flex h-10 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium hover:bg-slate-50"
              }
            >
              Anterior
            </Link>
            <Link
              href={getPageHref(resolvedSearchParams, propertiesResult.page + 1)}
              aria-disabled={propertiesResult.totalPages > 0 && propertiesResult.page >= propertiesResult.totalPages}
              className={
                propertiesResult.totalPages > 0 && propertiesResult.page >= propertiesResult.totalPages
                  ? "pointer-events-none inline-flex h-10 items-center rounded-md border border-slate-200 px-4 text-sm text-slate-400"
                  : "inline-flex h-10 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium hover:bg-slate-50"
              }
            >
              Siguiente
            </Link>
          </div>
        </div>

        <MapPane />
      </section>
    </main>
  );
}
