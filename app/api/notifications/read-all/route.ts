import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("ap_token")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const res = await fetch(`${API_BASE}/api/v1/notifications/read-all`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[PATCH /api/notifications/read-all]", err);
    return NextResponse.json({ message: "Failed to reach backend" }, { status: 502 });
  }
}