"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { getSession, subscribeToAuthChanges, type AuthSession } from "@/features/auth/storage";
import type { UserRole } from "@/features/auth/roles";

type RouteGuardProps = {
  allowedRoles: readonly UserRole[];
  children: ReactNode;
};

type GuardState = "loading" | "unauthenticated" | "unauthorized" | "allowed";

export function RouteGuard({ allowedRoles, children }: RouteGuardProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<GuardState>("loading");

  useEffect(() => {
    let isMounted = true;

    async function syncSession() {
      const nextSession = await getSession();
      if (!isMounted) {
        return;
      }

      setSession(nextSession);

      if (!nextSession) {
        setStatus("unauthenticated");
        return;
      }

      setStatus(allowedRoles.includes(nextSession.role) ? "allowed" : "unauthorized");
    }

    void syncSession();
    const unsubscribe = subscribeToAuthChanges(() => {
      void syncSession();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [allowedRoles]);

  if (status === "loading") {
    return <p className="guard-message">Validando permisos...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <section className="guard-panel">
        <h1>Ruta protegida</h1>
        <p className="guard-message">Debes iniciar sesion para acceder.</p>
        <Link className="btn-save" href="/">
          Ir al inicio
        </Link>
      </section>
    );
  }

  if (status === "unauthorized") {
    return (
      <section className="guard-panel">
        <h1>Acceso denegado</h1>
        <p className="guard-message">
          Tu rol actual es <strong>{session?.role ?? "desconocido"}</strong> y no tiene permisos para esta ruta.
        </p>
        <Link className="btn-save" href="/">
          Volver al inicio
        </Link>
      </section>
    );
  }

  return <>{children}</>;
}
