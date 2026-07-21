import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("ap_token")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const res = await fetch(`${API_BASE}/api/inquiries/received`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[GET /api/inquiries/received]", err);
    return NextResponse.json({ message: "Failed to reach backend" }, { status: 502 });
  }
}