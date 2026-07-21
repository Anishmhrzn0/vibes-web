import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getToken(req: NextRequest): string | undefined {
  return req.cookies.get("ap_token")?.value;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const res = await fetch(`${API_BASE}/api/cars/mine/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[GET /api/cars/mine/[id]]", err);
    return NextResponse.json({ message: "Failed to reach backend" }, { status: 502 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const res = await fetch(`${API_BASE}/api/cars/mine/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return NextResponse.json(await res.json(), { status: res.status });
}