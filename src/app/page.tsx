import { FilterBar } from "@/components/filter-bar";
import { MapPane } from "@/components/map-pane";
import { PropertyCard, type Property } from "@/components/property-card";
import { TopNav } from "@/components/top-nav";

const PROPERTIES: Property[] = [
  {
    id: 1,
    price: 1597,
    beds: 2,
    baths: 2,
    address: "Aventura Oaks 1572 NE 191st St",
    city: "Berlin Mitte",
    imageUrl:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80",
    badge: "NEW",
  },
  {
    id: 2,
    price: 2444,
    beds: 1,
    baths: 1,
    address: "Modere Edgewater 455 NE 24th St",
    city: "Berlin Friedrichshain",
    imageUrl:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80",
    badge: "3D TOUR",
  },
  {
    id: 3,
    price: 1710,
    beds: 1,
    baths: 1,
    address: "Aventura Harbor 1200 Bayfront",
    city: "Berlin Prenzlauer Berg",
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    price: 1815,
    beds: 2,
    baths: 2,
    address: "Coral Grove 78 Lakeside",
    city: "Berlin Neukölln",
    imageUrl:
      "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&w=1000&q=80",
  },
];

export default function HomePage() {
  return (
    <main className="app-shell">
      <TopNav />
      <FilterBar />

      <section className="content-header">
        <h1>Berlin rental listings</h1>
        <p>124 rentals · Sort: Recommended</p>
      </section>

      <section className="content-grid">
        <div className="listing-pane">
          <div className="cards-grid">
            {PROPERTIES.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>

        <MapPane />
      </section>
    </main>
  );
}
