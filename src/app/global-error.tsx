"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logger } from "@/features/observability/logger";

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => {
    logger.error(
      "frontend.boundary.global_error",
      "Global error boundary triggered.",
      { digest: error.digest },
      error
    );
  }, [error]);

  return (
    <html lang="es">
      <body>
        <main className="min-h-dvh grid place-items-center p-6">
          <section className="grid w-full max-w-[560px] gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-slate-900">Error critico</h1>
            <p className="text-sm font-semibold text-slate-600">La aplicacion encontro un fallo inesperado.</p>
            <Button type="button" onClick={reset}>
              Reintentar
            </Button>
          </section>
        </main>
      </body>
    </html>
  );
}
