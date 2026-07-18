"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import s from "./car.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface CarDetail {
  _id: string;
  vin: string;
  year: number;
  make: string;
  carModel: string;
  mileage: number;
  price: number;
  condition: string;
  images: string[];
  sellerId: { fullName: string } | null;
}

// ── Page Component ─────────────────────────────────────────────────────────────
export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [car, setCar] = useState<CarDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/cars/${id}`)
        .then((r) => {
          if (!r.ok) throw new Error("Not found");
          return r.json();
        })
        .then((data) => setCar(data))
        .catch(() => setNotFound(true));
    });
  }, [params]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;
  if (notFound) return (
    <div className={s.notFound}>
      <p>Vehicle not found.</p>
      <Link href="/" className={s.backLink}>← Back to listings</Link>
    </div>
  );
  if (!car) return null; // still loading car data

  const carName = `${car.year} ${car.make} ${car.carModel}`;
  const mainImgSrc = car.images[activeImg]
    ? `${API_BASE}${car.images[activeImg]}`
    : "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80";

  return (
    <div className={s.page}>
      {/* ── Navbar ── */}
      <nav className={s.nav}>
        <div className={s.navBrand}>VIBES</div>
        <div className={s.navLinks}>
          <Link href="/" className={`${s.navLink} ${s.navLinkActive}`}>Buy</Link>
          <Link href="/sell" className={s.navLink}>Sell</Link>
        </div>
        <div className={s.navRight}>
          <button className={s.iconBtn} aria-label="Notifications">🔔</button>
          <button className={s.iconBtn} aria-label="Wishlist">🤍</button>
          {user ? (
            <button className={s.btnAccount} onClick={logout}>
              {user.fullName?.split(" ")[0] ?? "Account"}
            </button>
          ) : (
            <Link href="/login" className={s.btnAccount}>Account</Link>
          )}
        </div>
      </nav>

      <div className={s.container}>
        {/* ── Breadcrumb ── */}
        <div className={s.breadcrumb}>
          <span className={s.breadcrumbIcon}>🏠</span>
          <Link href="/" className={s.breadcrumbLink}>Home</Link>
          <span className={s.breadcrumbSep}>›</span>
          <span className={s.breadcrumbCurrent}>{carName}</span>
        </div>

        <div className={s.layout}>
          {/* ── Left column ── */}
          <div className={s.leftCol}>
            {/* Title */}
            <div className={s.titleRow}>
              <div>
                <h1 className={s.carTitle}>{carName}</h1>
                <p className={s.carSubtitle}>{car.mileage.toLocaleString()} Miles · VIN: {car.vin}</p>
              </div>
              <div className={s.titleBadges}>
                <span className={s.badgeVerified}>VERIFIED SELLER</span>
                <span className={s.titlePrice}>Rs.{car.price.toLocaleString()}</span>
              </div>
            </div>

            {/* Images */}
            <div className={s.imageSection}>
              <div className={s.mainImg}>
                <img
                  src={mainImgSrc}
                  alt={carName}
                  className={s.mainImgEl}
                />
                <span className={s.photoCount}>📷 {car.images.length} Photos</span>
              </div>
              <div className={s.thumbGrid}>
                {car.images.slice(1).map((img, i) => (
                  <div
                    key={i}
                    className={`${s.thumb} ${activeImg === i + 1 ? s.thumbActive : ""}`}
                    onClick={() => setActiveImg(i + 1)}
                  >
                    <img src={`${API_BASE}${img}`} alt={`View ${i + 2}`} className={s.thumbImg} />
                  </div>
                ))}
              </div>
            </div>

            {/* Key Specs */}
            <div className={s.specsCard}>
              <div className={s.specsHeader}>
                <span className={s.specsIcon}>🔧</span>
                <span className={s.specsTitle}>Key Specifications</span>
              </div>
              <div className={s.specsGrid}>
                <div className={s.specItem}>
                  <div className={s.specLabel}>YEAR</div>
                  <div className={s.specValue}>{car.year}</div>
                </div>
                <div className={s.specItem}>
                  <div className={s.specLabel}>MILEAGE</div>
                  <div className={s.specValue}>{car.mileage.toLocaleString()} mi</div>
                </div>
                <div className={s.specItem}>
                  <div className={s.specLabel}>VIN</div>
                  <div className={s.specValue}>{car.vin}</div>
                </div>
                <div className={s.specItem}>
                  <div className={s.specLabel}>CONDITION</div>
                  <div className={s.specValue}>{car.condition || "Excellent"}</div>
                </div>
              </div>
            </div>

            {/* Vehicle History */}
            <div className={s.historyCard}>
              <div className={s.historyLeft}>
                <div className={s.historyTitle}>
                  <span>🛡️</span> Vehicle History Report
                </div>
                <div className={s.historyItems}>
                  <div className={s.historyItem}>
                    <span className={s.checkIcon}>✅</span> Admin Verified Listing
                  </div>
                </div>
              </div>
              <div className={s.historyRight}>
                <div className={s.lastInspLabel}>STATUS</div>
                <div className={s.lastInspDate}>Approved</div>
              </div>
            </div>

            {/* Description */}
            <div className={s.descCard}>
              <h3 className={s.descTitle}>Seller's Description</h3>
              <p className={s.descPara}>No additional description provided for this listing.</p>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className={s.rightCol}>
            {/* Price card */}
            <div className={s.priceCard}>
              <div className={s.priceLabel}>MARKET PRICE</div>
              <div className={s.priceValue}>Rs.{car.price.toLocaleString()}</div>

              <button className={s.btnBuyNow}>Buy Now</button>
              <button className={s.btnInspect}>📅 Schedule Inspection</button>
              <button className={s.btnMessage}>💬 Message Seller</button>
            </div>

            {/* Seller card */}
            <div className={s.sellerCard}>
              <div className={s.sellerInfo}>
                <div className={s.sellerName}>{car.sellerId?.fullName ?? "Unknown Seller"}</div>
              </div>
            </div>

            {/* Safe transaction */}
            <div className={s.safeCard}>
              <div className={s.safeTitle}>Safe Transaction Guarantee</div>
              <p className={s.safeDesc}>
                All payments are held in escrow until the inspection is cleared and the title is verified. We ensure 100% Transparency.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={s.footer}>
        <div className={s.footerInner}>
          <div className={s.footerBrand}>VIBES</div>
          <div className={s.footerTrust}>
            {["Buyer Protection", "Seller Guarantee", "Financing", "Terms of Service"].map((t) => (
              <span key={t} className={s.trustItem}>{t}</span>
            ))}
          </div>
        </div>
        <div className={s.footerCopy}>© 2025 VIBES Global Marketplace. All Rights Reserved.</div>
      </footer>
    </div>
  );
}