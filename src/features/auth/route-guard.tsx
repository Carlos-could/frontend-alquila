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
    return <p className="text-sm font-semibold text-slate-600">Validando permisos...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <section className="grid w-full max-w-[560px] gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-slate-900">Ruta protegida</h1>
        <p className="text-sm font-semibold text-slate-600">Debes iniciar sesion para acceder.</p>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
        >
          Ir al inicio
        </Link>
      </section>
    );
  }

  if (status === "unauthorized") {
    return (
      <section className="grid w-full max-w-[560px] gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-slate-900">Acceso denegado</h1>
        <p className="text-sm font-semibold text-slate-600">
          Tu rol actual es <strong>{session?.role ?? "desconocido"}</strong> y no tiene permisos para esta ruta.
        </p>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
        >
          Volver al inicio
        </Link>
      </section>
    );
  }

  return <>{children}</>;
}
