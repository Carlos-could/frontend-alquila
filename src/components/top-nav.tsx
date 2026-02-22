"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthDialog } from "@/components/auth-dialog";
import { getSession, logout, subscribeToAuthChanges, type AuthSession } from "@/features/auth/storage";

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
        console.error(error);
      }
      return;
    }

    setIsAuthDialogOpen(true);
  }

  return (
    <>
      <header className="top-nav">
        <div className="brand">Alquila</div>

        <label className="search-wrap" htmlFor="city-search">
          <span className="search-icon">⌕</span>
          <input id="city-search" defaultValue="Berlin" aria-label="Buscar ciudad" />
        </label>

        <nav className="top-links" aria-label="Navegación principal">
          <Link href="/">Inicio</Link>
          <Link href="/propietario">Propietario</Link>
          <Link href="/admin">Admin</Link>
        </nav>

        <div className="auth-controls">
          {isLoggedIn ? <span className="auth-user">{session.email}</span> : null}
          {isLoggedIn ? <span className="auth-role">{session.role}</span> : null}
          <button type="button" className="btn-auth" onClick={handleAuthClick}>
            {isLoggedIn ? "Cerrar sesión" : "Join / Sign in"}
          </button>
        </div>
      </header>

      <AuthDialog isOpen={isAuthDialogOpen} onClose={() => setIsAuthDialogOpen(false)} />
    </>
  );
}
