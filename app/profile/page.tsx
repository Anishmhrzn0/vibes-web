"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useProtectedRoute } from "@/app/router/protected.route";
import s from "./profile.module.css";

interface MyCar {
  _id: string;
  year: number;
  make: string;
  carModel: string;
  mileage: number;
  price: number;
  condition: string;
  images: string[];
  status: "pending" | "approved" | "rejected";
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { loading: authLoading } = useProtectedRoute();

  const [cars, setCars] = useState<MyCar[]>([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [ setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadCars();
  }, [user]);

  const loadCars = () => {
    setCarsLoading(true);
    fetch("/api/cars/mine/list", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCars(data);
      })
      .catch((err) => console.error("Failed to load your listings", err))
      .finally(() => setCarsLoading(false));
  };

  if (authLoading || !user) return null;

  const memberSince = new Date(user.createdAt).getFullYear();

  const statusLabel: Record<MyCar["status"], string> = {
    approved: "Live",
    pending: "Pending Review",
    rejected: "Rejected",
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing? This can't be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/cars/mine/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete listing");
      setCars((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete listing");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={s.page}>
      <nav className={s.nav}>
        <Link href="/home" className={s.navBrand}>VIBES</Link>
        <Link href="/home" className={s.backLink}>← Back to marketplace</Link>
      </nav>

      <div className={s.banner}>
        <div className={s.bannerStripe} />
      </div>

      <div className={s.headerCard}>
        <div className={s.avatarWrap}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.fullName} className={s.avatarImg} />
          ) : (
            <div className={s.avatarPlaceholder}>
              {user.fullName?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>

        <div className={s.headerInfo}>
          <div className={s.nameRow}>
            <h1 className={s.name}>{user.fullName || "Unnamed User"}</h1>
            <span className={s.plateBadge}>{user.role === "admin" ? "ADMIN" : "MEMBER"}</span>
          </div>
          <p className={s.bio}>{user.bio || "No bio added yet."}</p>
        </div>

        <Link href="/profile/edit" className={s.editBtn}>Edit Profile</Link>
      </div>

      <div className={s.grid}>
        <aside className={s.sidebar}>
          <div className={s.card}>
            <h3 className={s.cardTitle}>Contact Information</h3>

            <div className={s.infoRow}>
              <div className={s.infoIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 6l-10 7L2 6" />
                  <path d="M2 6h20v12H2z" />
                </svg>
              </div>
              <div>
                <div className={s.infoLabel}>Email</div>
                <div className={s.infoValue}>{user.email}</div>
              </div>
            </div>

            <div className={s.infoRow}>
              <div className={s.infoIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <div className={s.infoLabel}>Phone</div>
                <div className={s.infoValue}>{user.phone || "Not set"}</div>
              </div>
            </div>

            <div className={s.infoRow}>
              <div className={s.infoIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <div>
                <div className={s.infoLabel}>Member since</div>
                <div className={s.infoValue}>{memberSince}</div>
              </div>
            </div>
          </div>

          <button onClick={logout} className={s.logoutBtn}>Log out</button>
        </aside>

        <main className={s.main}>
          <div className={s.mainHeader}>
            <h3 className={s.mainTitle}>Your Listings</h3>
            {cars.length > 0 && <span className={s.mainCount}>{cars.length}</span>}
          </div>

          {carsLoading ? (
            <div className={s.emptyState}>
              <p className={s.emptyText}>Loading your listings…</p>
            </div>
          ) : cars.length === 0 ? (
            <div className={s.emptyState}>
              <div className={s.emptyIcon}>🚗</div>
              <p className={s.emptyText}>You haven't listed a vehicle yet.</p>
              <Link href="/sell" className={s.emptyCta}>List your first car</Link>
            </div>
          ) : (
            <div className={s.carsGrid}>
              {cars.map((car) => (
                <div key={car._id} className={s.carCard}>
                  <div
                    className={s.carImg}
                    style={{
                      backgroundImage: `url('${
                        car.images?.[0]
                          ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${car.images[0]}`
                          : "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80"
                      }')`,
                    }}
                  >
                    <span className={`${s.statusBadge} ${s[`status_${car.status}`]}`}>
                      {statusLabel[car.status]}
                    </span>
                  </div>
                  <div className={s.carInfo}>
                    <div className={s.carInfoTop}>
                      <span className={s.carName}>{car.year} {car.make} {car.carModel}</span>
                      <span className={s.carPrice}>Rs.{car.price.toLocaleString()}</span>
                    </div>
                    <p className={s.carSpecs}>{car.mileage.toLocaleString()} miles · {car.condition}</p>

                    <div className={s.carActions}>
                      <button
                        className={s.actionDelete}
                        onClick={() => handleDelete(car._id)}
                        disabled={deletingId === car._id}
                      >
                        {deletingId === car._id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}