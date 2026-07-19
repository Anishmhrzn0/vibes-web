"use client";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useProtectedRoute } from "@/app/router/protected.route";
import s from "./profile.module.css";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { loading: authLoading } = useProtectedRoute();

  if (authLoading || !user) return null;

  const memberSince = new Date(user.createdAt).getFullYear();

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
                  <path d="M4 4h16v16H4z" opacity="0" />
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
          <h3 className={s.mainTitle}>Your Listings</h3>
          <div className={s.emptyState}>
            <div className={s.emptyIcon}>🚗</div>
            <p className={s.emptyText}>You haven't listed a vehicle yet.</p>
            <Link href="/sell" className={s.emptyCta}>List your first car</Link>
          </div>
        </main>
      </div>
    </div>
  );
}