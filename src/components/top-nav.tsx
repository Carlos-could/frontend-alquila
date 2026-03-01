"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthDialog } from "@/components/auth-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSession, logout, subscribeToAuthChanges, type AuthSession } from "@/features/auth/storage";
import { normalizeError } from "@/features/observability/errors";
import { logger } from "@/features/observability/logger";

export function TopNav() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function syncSession() {
      const nextSession = await getSession();
      if (isMounted) {
        setSession(nextSession);
      }
    }

    void syncSession();
    const unsubscribe = subscribeToAuthChanges(() => {
      void syncSession();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const isLoggedIn = session !== null;

  async function handleAuthClick() {
    if (isLoggedIn) {
      try {
        await logout();
      } catch (error) {
        const normalizedError = normalizeError(error, "No se pudo cerrar sesión.");
        logger.error("auth.logout.failed", "Logout action failed.", undefined, normalizedError);
      }
      return;
    }

    setIsAuthDialogOpen(true);
  }

  return (
    <>
      <header className="grid items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:grid-cols-[auto_minmax(220px,520px)_1fr_auto]">
        <div className="font-[var(--font-heading)] text-3xl font-bold leading-none text-red-600">Alquila</div>

        <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2" htmlFor="city-search">
          <span aria-hidden="true">⌕</span>
          <Input id="city-search" defaultValue="Berlin" aria-label="Buscar ciudad" className="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" />
        </label>

        <nav className="hidden items-center justify-center gap-5 text-sm font-medium text-slate-600 lg:flex" aria-label="Navegación principal">
          <Link className="hover:text-slate-900" href="/">
            Inicio
          </Link>
          <Link className="hover:text-slate-900" href="/propietario">
            Propietario
          </Link>
          <Link className="hover:text-slate-900" href="/admin">
            Admin
          </Link>
        </nav>

        <div className="inline-flex items-center gap-2">
          {isLoggedIn ? <span className="max-w-52 truncate text-sm font-semibold text-slate-600">{session.email}</span> : null}
          {isLoggedIn ? <span className="rounded-full border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600">{session.role}</span> : null}
          <Button type="button" onClick={handleAuthClick}>
            {isLoggedIn ? "Cerrar sesión" : "Join / Sign in"}
          </Button>
        </div>
      </header>

      <AuthDialog isOpen={isAuthDialogOpen} onClose={() => setIsAuthDialogOpen(false)} />
    </>
  );
}
