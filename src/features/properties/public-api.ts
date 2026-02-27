import { env } from "@/config/env";

export type PublicPropertyItem = {
  id: string;
  title: string;
  description: string | null;
  city: string;
  neighborhood: string | null;
  address: string | null;
  monthlyPrice: number;
  bedrooms: number;
  bathrooms: number;
  coverImageUrl: string | null;
};

function apiUrl(path: string): string {
  const baseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function listPublicProperties(): Promise<PublicPropertyItem[]> {
  try {
    const response = await fetch(apiUrl("/properties/public"), {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`Public properties request failed with status ${response.status}. Returning empty list.`);
      return [];
    }

    return (await response.json()) as PublicPropertyItem[];
  } catch (error) {
    console.warn("Public properties request failed. Returning empty list.", error);
    return [];
  }
}
