import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/top-nav";
import { Button } from "@/components/ui/button";
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
    <main className="min-h-dvh bg-gradient-to-b from-slate-100 to-slate-50 p-3">
      <TopNav />
      <PropertyDetailViewTracker propertyId={detail.id} city={detail.city} />

      <section className="mt-4 grid items-start gap-4 lg:grid-cols-[9fr_minmax(342px,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            {detail.city}
            {detail.neighborhood ? `, ${detail.neighborhood}` : ""}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{detail.title}</h1>
          <p className="mt-2 text-2xl font-bold text-slate-900">${detail.monthlyPrice.toLocaleString()}/mo</p>
          <p className="mt-2 text-sm text-slate-600">
            {detail.bedrooms} hab · {detail.bathrooms} banos · {detail.areaM2} m2 ·{" "}
            {detail.isFurnished ? "Amueblado" : "No amueblado"}
          </p>
          {detail.description ? <p className="mt-3 text-sm leading-relaxed text-slate-700">{detail.description}</p> : null}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {gallery.map((image, index) => (
              <div
                key={image.id}
                className={index === 0 ? "overflow-hidden rounded-xl border border-slate-200 sm:col-span-2" : "overflow-hidden rounded-xl border border-slate-200"}
              >
                <Image
                  src={image.publicUrl}
                  alt={`${detail.title} imagen ${index + 1}`}
                  width={900}
                  height={560}
                  className={index === 0 ? "h-[360px] w-full object-cover" : "h-48 w-full object-cover"}
                />
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Disponibilidad</h2>
            <p className="mt-2 text-sm text-slate-700">Desde {formatDate(detail.availableFrom)}</p>
            <p className="mt-1 text-sm text-slate-700">Contrato: {detail.contractType}</p>
            <p className="mt-1 text-sm text-slate-700">Deposito: ${detail.depositAmount.toLocaleString()}</p>
            <Button type="button" className="mt-4 w-full">
              Solicitar
            </Button>
            <p className="mt-2 text-xs text-slate-500">El flujo de solicitud completo se habilita en F3-T03.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Direccion</h2>
            <p className="mt-2 text-sm text-slate-700">{detail.address ?? "Direccion no disponible"}</p>
          </div>
        </aside>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">Inmuebles relacionados en {detail.city}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {detail.relatedByCity.map((item) => (
            <Link key={item.id} href={`/inmuebles/${item.id}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Image
                src={item.coverImageUrl ?? FALLBACK_IMAGE}
                alt={item.title}
                width={720}
                height={460}
                className="h-48 w-full object-cover"
              />
              <div className="space-y-1 p-4">
                <p className="text-lg font-bold text-slate-900">${item.monthlyPrice.toLocaleString()}/mo</p>
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-600">
                  {item.bedrooms} hab · {item.bathrooms} banos
                </p>
              </div>
            </Link>
          ))}
        </div>
        {detail.relatedByCity.length === 0 ? (
          <p className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">No hay inmuebles relacionados disponibles en esta ciudad.</p>
        ) : null}
      </section>
    </main>
  );
}
