"use client";

import { useEffect } from "react";
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
    <main className="protected-shell">
      <section className="guard-panel">
        <h1>Se produjo un error</h1>
        <p className="guard-message">Intenta recargar esta sección.</p>
        <button type="button" className="btn-save" onClick={reset}>
          Reintentar
        </button>
      </section>
    </main>
  );
}
