export interface AdminCar {
  _id: string;
  vin: string;
  year: number;
  make: string;
  carModel: string;
  bodyType: string;
  mileage: number;
  price: number;
  location: string;
  condition: string;
  images: string[];
  status: "pending" | "active" | "rejected";
  isBooked?: boolean;
  soldAt?: string;
  sellerId: { fullName: string; email: string } | null;
  createdAt: string;
}

export interface CarPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UpdateCarPayload {
  vin?: string;
  year?: number;
  make?: string;
  carModel?: string;
  bodyType?: string;
  mileage?: number;
  price?: number;
  location?: string;
  condition?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

export const adminCarsApi = {
  list: (params: { page: number; limit: number; search?: string; status?: string }) => {
    const qs = new URLSearchParams();
    qs.set("page", String(params.page));
    qs.set("limit", String(params.limit));
    if (params.search) qs.set("search", params.search);
    if (params.status) qs.set("status", params.status);
    return request<{ data: AdminCar[]; meta: CarPaginationMeta }>(
      `/api/admin/cars/all?${qs.toString()}`
    );
  },
  update: (id: string, payload: UpdateCarPayload) =>
    request<AdminCar>(`/api/admin/cars/${id}/edit`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};