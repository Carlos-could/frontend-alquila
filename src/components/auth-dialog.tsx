"use client";

import { useMemo, useState } from "react";
import { loginWithEmailPassword, registerWithEmailPassword } from "@/features/auth/storage";

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

  const title = useMemo(
    () => (mode === "login" ? "Iniciar sesión" : "Crear cuenta"),
    [mode]
  );

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (mode === "register" && confirmPassword !== password) {
      setError("Las contraseñas no coinciden.");
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
      const message =
        submitError instanceof Error ? submitError.message : "No se pudo completar la autenticación.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-dialog-overlay" role="presentation" onClick={onClose}>
      <div
        className="auth-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="auth-dialog-head">
          <h2>{title}</h2>
          <button type="button" className="auth-close" onClick={onClose} aria-label="Cerrar">
            x
          </button>
        </div>

        <div className="auth-mode-switch" role="tablist" aria-label="Seleccionar modo de autenticación">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Registro
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="auth-password">Contraseña</label>
          <input
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
              <label htmlFor="auth-confirm-password">Repetir contraseña</label>
              <input
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

          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "Procesando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}
