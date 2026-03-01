"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logger } from "@/features/observability/logger";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    logger.error(
      "frontend.boundary.route_error",
      "Route-level error boundary triggered.",
      { digest: error.digest },
      error
    );
  }, [error]);

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <section className="grid w-full max-w-[560px] gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-slate-900">Se produjo un error</h1>
        <p className="text-sm font-semibold text-slate-600">Intenta recargar esta seccion.</p>
        <Button type="button" onClick={reset}>
          Reintentar
        </Button>
      </section>
    </main>
  );
}
