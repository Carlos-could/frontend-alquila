import Image from "next/image";
import Link from "next/link";

export interface Property {
  id: string;
  price: number;
  beds: number;
  baths: number;
  address: string;
  city: string;
  imageUrl: string;
  badge?: string;
}

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <article className="property-card">
      <Link href={`/inmuebles/${property.id}`}>
        <div className="property-image-wrap">
          <Image
            src={property.imageUrl}
            alt={property.address}
            width={780}
            height={520}
            className="property-image"
          />
          {property.badge ? <span className="property-badge">{property.badge}</span> : null}
        </div>

        <div className="property-body">
          <p className="property-price">${property.price.toLocaleString()}/mo</p>
          <p className="property-meta">
            {property.beds} bd · {property.baths} ba
          </p>
          <p className="property-address">{property.address}</p>
          <p className="property-city">{property.city}</p>
        </div>
      </Link>

      <div className="property-actions">
        <Link href={`/inmuebles/${property.id}`} className="btn-link">
          Ver detalle
        </Link>
      </div>
    </article>
  );
}
