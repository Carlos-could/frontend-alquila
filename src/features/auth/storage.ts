import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/features/auth/supabase-client";

export type AuthSession = {
  userId: string;
  email: string;
  createdAt: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function validateCredentials(email: string, password: string): void {
  if (!email.includes("@") || email.length < 5) {
    throw new Error("Email inválido.");
  }

  if (password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }
}

function mapSession(session: Session | null): AuthSession | null {
  if (!session?.user?.email) {
    return null;
  }

  return {
    userId: session.user.id,
    email: session.user.email,
    createdAt: session.user.created_at ?? new Date().toISOString(),
  };
}

export async function getSession(): Promise<AuthSession | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) {
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
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
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
    throw new Error(
      "Cuenta creada, pero requiere confirmación de email antes de iniciar sesión."
    );
  }

  const loginSession = mapSession(loginData.session);
  if (!loginSession) {
    throw new Error("No se pudo iniciar sesión después del registro.");
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
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  const session = mapSession(data.session);
  if (!session) {
    throw new Error("No se pudo crear una sesión válida.");
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
    throw new Error(error.message);
  }
}

export function subscribeToAuthChanges(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const supabase = getSupabaseBrowserClient();
  const { data } = supabase.auth.onAuthStateChange(() => {
    callback();
  });

  return () => {
    data.subscription.unsubscribe();
  };
}
