"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useProtectedRoute } from "@/app/router/protected.route";
import s from "./messages.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Inquiry {
  _id: string;
  message: string;
  createdAt: string;
  carId: { _id: string; year: number; make: string; carModel: string; price: number; images: string[] } | null;
  buyerId: { fullName: string; email: string; phone: string } | null;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const { loading: authLoading } = useProtectedRoute();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch("/api/inquiries/received", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setInquiries(data);
      })
      .catch((err) => console.error("Failed to load inquiries", err))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <div className={s.page}>
      <nav className={s.nav}>
        <Link href="/home" className={s.navBrand}>VIBES</Link>
        <Link href="/home" className={s.backLink}>← Back to marketplace</Link>
      </nav>

      <div className={s.container}>
        <h1 className={s.title}>Messages</h1>
        <p className={s.subtitle}>Inquiries from buyers interested in your listings</p>

        {loading ? (
          <p className={s.empty}>Loading…</p>
        ) : inquiries.length === 0 ? (
          <div className={s.empty}>
            <p>No messages yet.</p>
          </div>
        ) : (
          <div className={s.list}>
            {inquiries.map((inq) => (
              <div key={inq._id} className={s.card}>
                <div
                  className={s.carThumb}
                  style={{
                    backgroundImage: `url('${
                      inq.carId?.images?.[0]
                        ? `${API_BASE}${inq.carId.images[0]}`
                        : "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=300&q=80"
                    }')`,
                  }}
                />
                <div className={s.cardBody}>
                  <div className={s.cardTop}>
                    <span className={s.carName}>
                      {inq.carId ? `${inq.carId.year} ${inq.carId.make} ${inq.carId.carModel}` : "Listing removed"}
                    </span>
                    <span className={s.date}>{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className={s.buyerName}>{inq.buyerId?.fullName ?? "Unknown buyer"}</p>
                  <p className={s.message}>{inq.message}</p>
                  {inq.buyerId?.email && (
                    <p className={s.contact}>📧 {inq.buyerId.email}{inq.buyerId.phone ? ` · 📞 ${inq.buyerId.phone}` : ""}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}