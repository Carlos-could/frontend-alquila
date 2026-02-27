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
    <main className="app-shell">
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

      <section className="content-header">
        <h1>Listado publico de inmuebles</h1>
        <p>
          {propertiesResult.totalItems} resultados | Pagina {propertiesResult.page}
          {propertiesResult.totalPages > 0 ? ` de ${propertiesResult.totalPages}` : ""}
        </p>
      </section>

      <section className="content-grid">
        <div className="listing-pane">
          <div className="cards-grid">
            {cards.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          {cards.length === 0 ? <p className="empty-state">No hay inmuebles para esos filtros.</p> : null}
          <div className="pagination">
            <Link
              href={getPageHref(resolvedSearchParams, Math.max(1, propertiesResult.page - 1))}
              aria-disabled={propertiesResult.page <= 1}
              className={propertiesResult.page <= 1 ? "page-link disabled" : "page-link"}
            >
              Anterior
            </Link>
            <Link
              href={getPageHref(resolvedSearchParams, propertiesResult.page + 1)}
              aria-disabled={propertiesResult.totalPages > 0 && propertiesResult.page >= propertiesResult.totalPages}
              className={
                propertiesResult.totalPages > 0 && propertiesResult.page >= propertiesResult.totalPages
                  ? "page-link disabled"
                  : "page-link"
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
