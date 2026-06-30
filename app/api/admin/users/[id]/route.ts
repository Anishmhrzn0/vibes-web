import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getToken(req: NextRequest): string | undefined {
  return req.cookies.get("ap_token")?.value;
}

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/admin/users/:id
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${API_BASE}/api/v1/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// PUT /api/admin/users/:id
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const res = await fetch(`${API_BASE}/api/v1/admin/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// DELETE /api/admin/users/:id
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${API_BASE}/api/v1/admin/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}