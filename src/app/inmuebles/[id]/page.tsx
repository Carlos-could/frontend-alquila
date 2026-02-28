import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/top-nav";
import { getPublicPropertyDetail } from "@/features/properties/public-api";
import { PropertyDetailViewTracker } from "@/features/properties/property-detail-view-tracker";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80";

type DetailPageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(value: string): string {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PropertyDetailPage({ params }: DetailPageProps) {
  const resolvedParams = await params;
  const detail = await getPublicPropertyDetail(resolvedParams.id);

  if (!detail) {
    notFound();
  }

  const gallery = detail.images.length > 0 ? detail.images : [{ id: "fallback", publicUrl: FALLBACK_IMAGE }];

  return (
    <main className="app-shell">
      <TopNav />
      <PropertyDetailViewTracker propertyId={detail.id} city={detail.city} />

      <section className="detail-shell">
        <div className="detail-main">
          <p className="detail-kicker">
            {detail.city}
            {detail.neighborhood ? `, ${detail.neighborhood}` : ""}
          </p>
          <h1>{detail.title}</h1>
          <p className="detail-price">${detail.monthlyPrice.toLocaleString()}/mo</p>
          <p className="detail-meta">
            {detail.bedrooms} hab · {detail.bathrooms} banos · {detail.areaM2} m2 ·{" "}
            {detail.isFurnished ? "Amueblado" : "No amueblado"}
          </p>
          {detail.description ? <p className="detail-description">{detail.description}</p> : null}

          <div className="detail-grid">
            {gallery.map((image, index) => (
              <div key={image.id} className={index === 0 ? "detail-image detail-image-main" : "detail-image"}>
                <Image
                  src={image.publicUrl}
                  alt={`${detail.title} imagen ${index + 1}`}
                  width={900}
                  height={560}
                  className="detail-image-media"
                />
              </div>
            ))}
          </div>
        </div>

        <aside className="detail-aside">
          <div className="detail-panel">
            <h2>Disponibilidad</h2>
            <p>Desde {formatDate(detail.availableFrom)}</p>
            <p>Contrato: {detail.contractType}</p>
            <p>Deposito: ${detail.depositAmount.toLocaleString()}</p>
            <button type="button" className="btn-save">
              Solicitar
            </button>
            <p className="detail-helper">El flujo de solicitud completo se habilita en F3-T03.</p>
          </div>

          <div className="detail-panel">
            <h2>Direccion</h2>
            <p>{detail.address ?? "Direccion no disponible"}</p>
          </div>
        </aside>
      </section>

      <section className="related-shell">
        <div className="content-header">
          <h2>Inmuebles relacionados en {detail.city}</h2>
        </div>
        <div className="related-grid">
          {detail.relatedByCity.map((item) => (
            <Link key={item.id} href={`/inmuebles/${item.id}`} className="related-card">
              <Image
                src={item.coverImageUrl ?? FALLBACK_IMAGE}
                alt={item.title}
                width={720}
                height={460}
                className="related-image"
              />
              <div className="related-body">
                <p className="related-price">${item.monthlyPrice.toLocaleString()}/mo</p>
                <p className="related-title">{item.title}</p>
                <p className="related-meta">
                  {item.bedrooms} hab · {item.bathrooms} banos
                </p>
              </div>
            </Link>
          ))}
        </div>
        {detail.relatedByCity.length === 0 ? (
          <p className="empty-state">No hay inmuebles relacionados disponibles en esta ciudad.</p>
        ) : null}
      </section>
    </main>
  );
}
