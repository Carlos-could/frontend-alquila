"use client";

import { env } from "@/config/env";
import { getSupabaseBrowserClient } from "@/features/auth/supabase-client";
import { normalizeError } from "@/features/observability/errors";
import { logger } from "@/features/observability/logger";

export type PropertyUpsertRequest = {
  title: string;
  description: string;
  city: string;
  neighborhood: string;
  address: string;
  monthlyPrice: number;
  depositAmount: number;
  bedrooms: number;
  bathrooms: number;
  areaM2: number;
  isFurnished: boolean;
  availableFrom: string;
  contractType: "long_term" | "temporary" | "monthly";
  status: "pendiente" | "publicado" | "rechazado";
};

export type PropertyPatchRequest = Partial<PropertyUpsertRequest>;

type PropertyResponse = {
  id: string;
  ownerUserId: string;
  title: string;
};

function apiUrl(path: string): string {
  const baseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

async function getBearerToken(): Promise<string> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  const token = data.session?.access_token;
  if (!token) {
    throw new Error("Debes iniciar sesion para gestionar inmuebles.");
  }

  return token;
}

function flattenValidationErrors(errors: Record<string, string[]>): string {
  const messages = Object.entries(errors).flatMap(([field, fieldErrors]) =>
    fieldErrors.map((message) => `${field}: ${message}`)
  );
  return messages.join(" | ");
}

async function parseError(response: Response): Promise<Error> {
  const fallbackMessage = `Error ${response.status} al gestionar inmueble.`;
  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    return new Error(fallbackMessage);
  }

  if (typeof payload === "object" && payload !== null) {
    const recordPayload = payload as Record<string, unknown>;

    if (recordPayload.errors && typeof recordPayload.errors === "object") {
      return new Error(flattenValidationErrors(recordPayload.errors as Record<string, string[]>));
    }

    if (typeof recordPayload.detail === "string" && recordPayload.detail.trim().length > 0) {
      return new Error(recordPayload.detail);
    }

    if (typeof recordPayload.title === "string" && recordPayload.title.trim().length > 0) {
      return new Error(recordPayload.title);
    }
  }

  return new Error(fallbackMessage);
}

async function requestJson<TResponse>(path: string, method: "POST" | "PATCH", body: unknown): Promise<TResponse> {
  const token = await getBearerToken();
  const response = await fetch(apiUrl(path), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as TResponse;
}

export async function createProperty(payload: PropertyUpsertRequest): Promise<PropertyResponse> {
  try {
    return await requestJson<PropertyResponse>("/properties/", "POST", payload);
  } catch (error) {
    const normalizedError = normalizeError(error, "No se pudo crear el inmueble.");
    logger.error("properties.create.failed", "Create property request failed.", undefined, normalizedError);
    throw normalizedError;
  }
}

export async function patchProperty(propertyId: string, payload: PropertyPatchRequest): Promise<PropertyResponse> {
  try {
    return await requestJson<PropertyResponse>(`/properties/${propertyId}`, "PATCH", payload);
  } catch (error) {
    const normalizedError = normalizeError(error, "No se pudo editar el inmueble.");
    logger.error("properties.patch.failed", "Patch property request failed.", { propertyId }, normalizedError);
    throw normalizedError;
  }
}
