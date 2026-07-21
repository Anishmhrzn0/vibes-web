"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useProtectedRoute } from "@/app/router/protected.route";

interface EsewaForm {
  amount: number; tax_amount: number; total_amount: number; transaction_uuid: string;
  product_code: string; product_service_charge: number; product_delivery_charge: number;
  success_url: string; failure_url: string; signed_field_names: string; signature: string;
}

export default function BookCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const { loading: authLoading } = useProtectedRoute();
  const [carId, setCarId] = useState("");
  const [starting, setStarting] = useState(false);
  const [formData, setFormData] = useState<{ form: EsewaForm; gatewayUrl: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    params.then(({ id }) => setCarId(id));
  }, [params]);

  useEffect(() => {
    if (formData && formRef.current) formRef.current.submit();
  }, [formData]);

  const handleBook = async () => {
    setStarting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId }),
      });
      if (!res.ok) throw new Error("Failed to start booking");
      const data = await res.json();
      setFormData({ form: data.esewaForm, gatewayUrl: data.gatewayUrl });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to start booking");
      setStarting(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <div style={{ maxWidth: 480, margin: "60px auto", padding: 24, fontFamily: "Montserrat, sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#14202c" }}>Book This Vehicle</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
        Pay a 10% advance now to reserve this car. You'll pay the remaining balance before delivery.
      </p>
      <button
        onClick={handleBook}
        disabled={starting}
        style={{
          background: "#1a6bff", color: "#fff", border: "none", padding: "12px 24px",
          borderRadius: 8, fontWeight: 700, cursor: "pointer", opacity: starting ? 0.6 : 1,
        }}
      >
        {starting ? "Redirecting to eSewa…" : "Pay Advance with eSewa"}
      </button>

      {formData && (
        <form ref={formRef} action={formData.gatewayUrl} method="POST" style={{ display: "none" }}>
          {Object.entries(formData.form).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={String(value)} />
          ))}
        </form>
      )}
    </div>
  );
}