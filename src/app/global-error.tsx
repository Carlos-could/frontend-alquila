"use client";

import { useEffect } from "react";
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
        <main className="protected-shell">
          <section className="guard-panel">
            <h1>Error crítico</h1>
            <p className="guard-message">La aplicación encontró un fallo inesperado.</p>
            <button type="button" className="btn-save" onClick={reset}>
              Reintentar
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
