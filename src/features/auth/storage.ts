import type { Session } from "@supabase/supabase-js";
import { DEFAULT_USER_ROLE, parseUserRole, type UserRole } from "@/features/auth/roles";
import { getSupabaseBrowserClient } from "@/features/auth/supabase-client";
import { normalizeError } from "@/features/observability/errors";
import { logger, type LogContext } from "@/features/observability/logger";

export type AuthSession = {
  userId: string;
  email: string;
  createdAt: string;
  role: UserRole;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function emailContext(email: string): LogContext {
  const domain = email.includes("@") ? email.split("@")[1] : "invalid";
  return { emailDomain: domain };
}

function validateCredentials(email: string, password: string): void {
  if (!email.includes("@") || email.length < 5) {
    throw new Error("Email invalido.");
  }

  if (password.length < 8) {
    throw new Error("La contrasena debe tener al menos 8 caracteres.");
  }
}

function mapSession(session: Session | null): AuthSession | null {
  if (!session?.user?.email) {
    return null;
  }

  const role = parseUserRole(
    session.user.app_metadata?.role ?? session.user.user_metadata?.role ?? DEFAULT_USER_ROLE
  );

  return {
    userId: session.user.id,
    email: session.user.email,
    createdAt: session.user.created_at ?? new Date().toISOString(),
    role,
  };
}

export async function getSession(): Promise<AuthSession | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    logger.warn("auth.session.read_failed", "Failed to read current auth session.", undefined, error);
    return null;
  }

  return mapSession(data.session);
}

export async function registerWithEmailPassword(emailInput: string, password: string): Promise<AuthSession> {
  if (typeof window === "undefined") {
    throw new Error("Auth is only available in browser runtime.");
  }

  const email = normalizeEmail(emailInput);
  validateCredentials(email, password);

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    logger.error("auth.register.signup_failed", "Supabase signUp failed.", emailContext(email), error);
    throw new Error(error.message);
  }

  const session = mapSession(data.session);
  if (session) {
    return session;
  }

  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    logger.warn(
      "auth.register.login_after_signup_failed",
      "Auto-login after signup failed; likely email confirmation required.",
      emailContext(email),
      loginError
    );
    throw new Error("Cuenta creada, pero requiere confirmacion de email antes de iniciar sesion.");
  }

  const loginSession = mapSession(loginData.session);
  if (!loginSession) {
    const missingSessionError = new Error("No session returned after successful login.");
    logger.error(
      "auth.register.session_missing_after_login",
      "Expected session is missing after login.",
      emailContext(email),
      missingSessionError
    );
    throw new Error("No se pudo iniciar sesion despues del registro.");
  }

  return loginSession;
}

export async function loginWithEmailPassword(emailInput: string, password: string): Promise<AuthSession> {
  if (typeof window === "undefined") {
    throw new Error("Auth is only available in browser runtime.");
  }

  const email = normalizeEmail(emailInput);
  validateCredentials(email, password);

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    logger.warn("auth.login.failed", "Supabase login failed.", emailContext(email), error);
    throw new Error(error.message);
  }

  const session = mapSession(data.session);
  if (!session) {
    const missingSessionError = new Error("No session returned after successful login.");
    logger.error("auth.login.session_missing", "Expected session is missing after login.", emailContext(email), missingSessionError);
    throw new Error("No se pudo crear una sesion valida.");
  }

  return session;
}

export async function logout(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    logger.error("auth.logout.failed", "Supabase logout failed.", undefined, error);
    throw new Error(error.message);
  }
}

export function subscribeToAuthChanges(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const supabase = getSupabaseBrowserClient();
  const { data } = supabase.auth.onAuthStateChange((event) => {
    logger.info("auth.state.changed", "Supabase auth state changed.", { event });

    try {
      callback();
    } catch (error) {
      const normalizedError = normalizeError(error, "Auth callback failed.");
      logger.error("auth.state.callback_failed", "Auth state callback execution failed.", undefined, normalizedError);
    }
  });

  return () => {
    data.subscription.unsubscribe();
  };
}
