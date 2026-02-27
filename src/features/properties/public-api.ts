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

export type PublicPropertySearchQuery = {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  isFurnished?: boolean;
  sort?: "newest" | "price_asc" | "price_desc";
  page?: number;
  pageSize?: number;
};

export type PublicPropertySearchResponse = {
  items: PublicPropertyItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

function apiUrl(path: string): string {
  const baseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function buildQueryString(query: PublicPropertySearchQuery): string {
  const params = new URLSearchParams();

  if (query.city) params.set("city", query.city);
  if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
  if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
  if (query.bedrooms !== undefined) params.set("bedrooms", String(query.bedrooms));
  if (query.isFurnished !== undefined) params.set("isFurnished", String(query.isFurnished));
  if (query.sort) params.set("sort", query.sort);
  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.pageSize !== undefined) params.set("pageSize", String(query.pageSize));

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

export async function listPublicProperties(query: PublicPropertySearchQuery = {}): Promise<PublicPropertySearchResponse> {
  try {
    const response = await fetch(apiUrl(`/properties/public${buildQueryString(query)}`), {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`Public properties request failed with status ${response.status}. Returning empty list.`);
      return { items: [], page: query.page ?? 1, pageSize: query.pageSize ?? 12, totalItems: 0, totalPages: 0 };
    }

    return (await response.json()) as PublicPropertySearchResponse;
  } catch (error) {
    console.warn("Public properties request failed. Returning empty list.", error);
    return { items: [], page: query.page ?? 1, pageSize: query.pageSize ?? 12, totalItems: 0, totalPages: 0 };
  }
}
