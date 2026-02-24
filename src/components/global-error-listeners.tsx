"use client";

import { useEffect } from "react";
import { logger } from "@/features/observability/logger";

export function GlobalErrorListeners() {
  useEffect(() => {
    function onWindowError(event: ErrorEvent) {
      logger.error(
        "frontend.runtime.window_error",
        "Unhandled browser error captured.",
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
        event.error
      );
    }

    function onUnhandledRejection(event: PromiseRejectionEvent) {
      logger.error(
        "frontend.runtime.unhandled_rejection",
        "Unhandled promise rejection captured.",
        undefined,
        event.reason
      );
    }

    window.addEventListener("error", onWindowError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onWindowError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}
