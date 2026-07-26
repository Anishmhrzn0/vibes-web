import type { SellerStats, SellerListingsResponse } from "@/types/seller";

// Adjust this to wherever you keep your API base URL.
// vibesapi runs on port 4000 per your .env setup.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    ...init,
    credentials: "include", // sends the ap_token httpOnly cookie
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

export function getSellerStats() {
  return apiFetch<SellerStats>("/seller/stats");
}

export function getSellerListings(params?: { search?: string; status?: string }) {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.status) query.set("status", params.status);
  const qs = query.toString();
  return apiFetch<SellerListingsResponse>(`/seller/listings${qs ? `?${qs}` : ""}`);
}

export function resumeListing(id: string) {
  return apiFetch<{ success: boolean }>(`/seller/listings/${id}/resume`, {
    method: "PATCH",
  });
}

export function deleteListing(id: string) {
  return apiFetch<{ success: boolean }>(`/seller/listings/${id}`, {
    method: "DELETE",
  });
}