export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListUsersResponse {
  data: AdminUser[];
  meta: PaginationMeta;
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: "user" | "admin";
}

export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: "user" | "admin";
  bio?: string;
  password?: string; // optional reset
}

async function handle<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export const adminUsersApi = {
  list: (params: { page?: number; limit?: number; search?: string } = {}) => {
    const qs = new URLSearchParams();
    if (params.page)   qs.set("page", String(params.page));
    if (params.limit)  qs.set("limit", String(params.limit));
    if (params.search) qs.set("search", params.search);

    return fetch(`/api/admin/users?${qs.toString()}`, { cache: "no-store" }).then(
      (res) => handle<ListUsersResponse>(res)
    );
  },

  get: (id: string) =>
  fetch(`/api/admin/users?id=${id}`).then((res) =>
    handle<{ success: boolean; data: AdminUser }>(res)
  ),

  create: (payload: CreateUserPayload) =>
    fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => handle<{ success: boolean; data: AdminUser }>(res)),

  update: (id: string, payload: UpdateUserPayload) =>
  fetch(`/api/admin/users?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => handle<{ success: boolean; data: AdminUser }>(res)),

  remove: (id: string) =>
  fetch(`/api/admin/users?id=${id}`, { method: "DELETE" }).then((res) =>
    handle<{ success: boolean; message: string }>(res)
  ),
};