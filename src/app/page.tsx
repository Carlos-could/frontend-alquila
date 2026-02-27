import { FilterBar } from "@/components/filter-bar";
import { MapPane } from "@/components/map-pane";
import { PropertyCard, type Property } from "@/components/property-card";
import { TopNav } from "@/components/top-nav";
import { listPublicProperties } from "@/features/properties/public-api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80";

export default async function HomePage() {
  const properties = await listPublicProperties();

  const cards: Property[] = properties.map((property) => ({
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
      <FilterBar />

      <section className="content-header">
        <h1>Berlin rental listings</h1>
        <p>{cards.length} rentals · Sort: Recommended</p>
      </section>

      <section className="content-grid">
        <div className="listing-pane">
          <div className="cards-grid">
            {cards.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>

        <MapPane />
      </section>
    </main>
  );
}
