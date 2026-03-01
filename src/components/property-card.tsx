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
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Link href={`/inmuebles/${property.id}`}>
        <div className="relative">
          <Image
            src={property.imageUrl}
            alt={property.address}
            width={780}
            height={520}
            className="h-52 w-full object-cover"
          />
          {property.badge ? <span className="absolute left-3 top-3 rounded-full bg-black/75 px-2 py-1 text-xs font-semibold text-white">{property.badge}</span> : null}
        </div>

        <div className="space-y-1 p-4">
          <p className="text-lg font-bold text-slate-900">${property.price.toLocaleString()}/mo</p>
          <p className="text-sm text-slate-600">
            {property.beds} bd · {property.baths} ba
          </p>
          <p className="font-medium text-slate-900">{property.address}</p>
          <p className="text-sm text-slate-600">{property.city}</p>
        </div>
      </Link>

      <div className="border-t border-slate-200 p-4">
        <Link href={`/inmuebles/${property.id}`} className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 px-4 text-sm font-medium hover:bg-slate-50">
          Ver detalle
        </Link>
      </div>
    </article>
  );
}
