import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// GET /api/cars — public, approved listings only
export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/api/cars`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[GET /api/cars]", err);
    return NextResponse.json({ message: "Failed to reach backend" }, { status: 502 });
  }
}

// POST /api/cars — create a listing (used by the Sell page)
export async function POST(req: NextRequest) {
  const token = req.cookies.get("ap_token")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const res = await fetch(`${API_BASE}/api/cars`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[POST /api/cars]", err);
    return NextResponse.json({ message: "Failed to reach backend" }, { status: 502 });
  }
}