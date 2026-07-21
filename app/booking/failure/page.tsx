"use client";
import Link from "next/link";

export default function BookingFailurePage() {
  return (
    <div style={{ maxWidth: 480, margin: "60px auto", padding: 24, fontFamily: "Montserrat, sans-serif", textAlign: "center" }}>
      <h1 style={{ color: "#dc2626", fontSize: 22 }}>Payment Cancelled</h1>
      <p style={{ color: "#64748b", margin: "12px 0 24px" }}>
        Your payment wasn't completed. No charges were made.
      </p>
      <Link href="/home" style={{ color: "#1a6bff" }}>← Back to marketplace</Link>
    </div>
  );
}