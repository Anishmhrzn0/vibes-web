"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [payingFull, setPayingFull] = useState(false);
  const [fullForm, setFullForm] = useState<any>(null);

  useEffect(() => {
    const data = searchParams.get("data");
    if (!data) { setError("Missing payment data"); return; }

    fetch("/api/bookings/verify", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.message && !json.booking) throw new Error(json.message);
        setResult(json);
      })
      .catch((err) => setError(err.message || "Verification failed"));
  }, [searchParams]);

  const handlePayFull = async () => {
    setPayingFull(true);
    try {
      const res = await fetch(`/api/bookings/${result.booking._id}/pay-full`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to start full payment");
      const data = await res.json();
      setFullForm({ form: data.esewaForm, gatewayUrl: data.gatewayUrl });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to start payment");
      setPayingFull(false);
    }
  };

  useEffect(() => {
    if (fullForm) {
      const form = document.getElementById("full-pay-form") as HTMLFormElement;
      form?.submit();
    }
  }, [fullForm]);

  if (error) {
    return (
      <div style={{ maxWidth: 480, margin: "60px auto", padding: 24, fontFamily: "Montserrat, sans-serif", textAlign: "center" }}>
        <h1 style={{ color: "#dc2626" }}>Verification Failed</h1>
        <p style={{ color: "#64748b" }}>{error}</p>
        <Link href="/home" style={{ color: "#1a6bff" }}>← Back to marketplace</Link>
      </div>
    );
  }

  if (!result) return <div style={{ textAlign: "center", marginTop: 60 }}>Verifying payment…</div>;

  const isAdvance = result.isAdvance;
  const booking = result.booking;

  return (
    <div style={{ maxWidth: 480, margin: "60px auto", padding: 24, fontFamily: "Montserrat, sans-serif", textAlign: "center" }}>
      <h1 style={{ color: "#16a34a", fontSize: 22 }}>Payment Successful</h1>
      {isAdvance ? (
        <>
          <p style={{ color: "#64748b", margin: "12px 0 24px" }}>
            Your advance of Rs.{booking.advanceAmount.toLocaleString()} is confirmed. This car is now booked for you.
            Pay the remaining Rs.{booking.remainingAmount.toLocaleString()} when you're ready for delivery.
          </p>
          <button
            onClick={handlePayFull}
            disabled={payingFull}
            style={{
              background: "#1a6bff", color: "#fff", border: "none", padding: "12px 24px",
              borderRadius: 8, fontWeight: 700, cursor: "pointer", opacity: payingFull ? 0.6 : 1,
            }}
          >
            {payingFull ? "Redirecting…" : "Pay Remaining Balance for Delivery"}
          </button>
        </>
      ) : (
        <p style={{ color: "#64748b", margin: "12px 0 24px" }}>
          Full payment received. Your car will be delivered soon.
        </p>
      )}

      {fullForm && (
        <form id="full-pay-form" action={fullForm.gatewayUrl} method="POST" style={{ display: "none" }}>
          {Object.entries(fullForm.form).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={String(value)} />
          ))}
        </form>
      )}

      <div style={{ marginTop: 20 }}>
        <Link href="/home" style={{ color: "#1a6bff", fontSize: 13 }}>← Back to marketplace</Link>
      </div>
    </div>
  );
}