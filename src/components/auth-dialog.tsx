"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginWithEmailPassword, registerWithEmailPassword } from "@/features/auth/storage";
import { getErrorMessage, normalizeError } from "@/features/observability/errors";
import { logger } from "@/features/observability/logger";

type AuthMode = "login" | "register";

type AuthDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => (mode === "login" ? "Iniciar sesion" : "Crear cuenta"), [mode]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (mode === "register" && confirmPassword !== password) {
      setError("Las contrasenas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await loginWithEmailPassword(email, password);
      } else {
        await registerWithEmailPassword(email, password);
      }

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      onClose();
    } catch (submitError) {
      const normalizedError = normalizeError(submitError, "No se pudo completar la autenticacion.");
      logger.error("auth.dialog.submit_failed", "Auth dialog submit failed.", { mode }, normalizedError);
      setError(getErrorMessage(normalizedError, "No se pudo completar la autenticacion."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center bg-slate-900/45 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
            onClick={onClose}
            aria-label="Cerrar"
          >
            x
          </button>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2" role="tablist" aria-label="Seleccionar modo de autenticacion">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={
              mode === "login"
                ? "rounded-md border border-red-500 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600"
                : "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            }
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            className={
              mode === "register"
                ? "rounded-md border border-red-500 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600"
                : "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            }
            onClick={() => setMode("register")}
          >
            Registro
          </button>
        </div>

        <form className="grid gap-2" onSubmit={handleSubmit}>
          <Label htmlFor="auth-email">Email</Label>
          <Input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <Label htmlFor="auth-password">Contrasena</Label>
          <Input
            id="auth-password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />

          {mode === "register" ? (
            <>
              <Label htmlFor="auth-confirm-password">Repetir contrasena</Label>
              <Input
                id="auth-confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={8}
                required
              />
            </>
          ) : null}

          {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}

          <Button type="submit" className="mt-2" disabled={loading}>
            {loading ? "Procesando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
          </Button>
        </form>
      </div>
    </div>
  );
}
