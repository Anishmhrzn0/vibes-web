"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPasswordAction } from "@/app/lib/actions/auth.actions";

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setSubmitting(true);
    try {
      const { token } = await params;
      const res = await resetPasswordAction(token, password);
      if (!res.success) throw new Error(res.message);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        fontFamily: "Montserrat, -apple-system, sans-serif",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 36,
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>
          Set a new password
        </h1>

        {success ? (
          <>
            <p style={{ fontSize: 14, color: "#16a34a", marginTop: 12 }}>
              Password updated! Redirecting you to sign in...
            </p>
          </>
        ) : (
          <>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px" }}>
              Choose a new password for your account.
            </p>

            {error && (
              <p
                style={{
                  fontSize: 13,
                  color: "#dc2626",
                  background: "#fee2e2",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 16,
                }}
              >
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    marginTop: 6,
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 8,
                    padding: "10px 12px",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    marginTop: 6,
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 8,
                    padding: "10px 12px",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  border: "none",
                  borderRadius: 10,
                  background: "#f97316",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "12px",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "Updating..." : "Reset Password"}
              </button>
            </form>

            <p style={{ fontSize: 13, color: "#64748b", marginTop: 18, textAlign: "center" }}>
              <Link href="/login" style={{ color: "#f97316" }}>
                ← Back to Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}