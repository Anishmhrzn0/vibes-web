import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// GET /api/cars/[id] — public, single approved car detail
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await fetch(`${API_BASE}/api/cars/${id}`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[GET /api/cars/[id]]", err);
    return NextResponse.json({ message: "Failed to reach backend" }, { status: 502 });
  }
}