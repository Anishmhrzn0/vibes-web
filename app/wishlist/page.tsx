"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import s from "../home/home.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface ApiCar {
  _id: string;
  vin: string;
  year: number;
  make: string;
  carModel: string;
  mileage: number;
  price: number;
  location: string;
  condition: string;
  images: string[];
}

export default function WishlistPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [cars, setCars] = useState<ApiCar[]>([]);
  const [fetching, setFetching] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetch("/api/cars/wishlist/mine", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCars(data);
          setSavedIds(new Set(data.map((c: ApiCar) => c._id)));
        }
      })
      .catch((err) => console.error("Failed to load wishlist", err))
      .finally(() => setFetching(false));
  }, []);

  const handleRemove = async (e: React.MouseEvent, carId: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/cars/${carId}/save`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.saved) {
        setCars((prev) => prev.filter((c) => c._id !== carId));
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(carId);
          return next;
        });
      }
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  if (loading || !user) return null;

  return (
    <div className={s.page}>
      {/* ── Navbar ── */}
      <nav className={s.nav}>
        <div className={s.navBrand}>VIBES</div>
        <div className={s.navLinks}>
          <Link href="/" className={s.navLink}>Buy</Link>
          <Link href="/sell" className={s.navLink}>Sell</Link>
        </div>
        <div className={s.navRight}>
          <button className={s.iconBtn} aria-label="Notifications">🔔</button>
          <Link href="/wishlist" className={`${s.iconBtn} ${s.navLinkActive}`} aria-label="Wishlist">❤️</Link>
          {user ? (
            <Link href="/profile" className={s.btnAccount}>
              {user.fullName?.split(" ")[0] ?? "Account"}
            </Link>
          ) : (
            <Link href="/login" className={s.btnAccount}>Account</Link>
          )}
        </div>
      </nav>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <div>
            <h2 className={s.sectionTitle}>My Wishlist</h2>
            <p className={s.sectionSub}>Vehicles you've saved for later</p>
          </div>
        </div>

        {fetching ? (
          <p className={s.sectionSub}>Loading your wishlist…</p>
        ) : cars.length === 0 ? (
          <p className={s.sectionSub}>
            No saved vehicles yet — tap the heart on any listing to save it here.
          </p>
        ) : (
          <div className={s.carsRow}>
            {cars.map((car) => (
              <div
                key={car._id}
                className={s.carCard}
                onClick={() => router.push(`/cars/${car._id}`)}
              >
                <div
                  className={s.carImg}
                  style={{
                    backgroundImage: `url('${
                      car.images?.[0]
                        ? car.images[0].startsWith("http")
                          ? car.images[0]
                          : `${API_BASE}${car.images[0]}`
                        : "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80"
                    }')`,
                  }}
                >
                  <span className={`${s.carBadge} ${s.badge_blue}`}>Verified</span>
                  <button
                    className={s.carWish}
                    aria-label="Remove from wishlist"
                    onClick={(e) => handleRemove(e, car._id)}
                  >
                    {savedIds.has(car._id) ? "❤️" : "🤍"}
                  </button>
                </div>
                <div className={s.carInfo}>
                  <div className={s.carInfoTop}>
                    <span className={s.carName}>
                      {car.year} {car.make} {car.carModel}
                    </span>
                    <span className={s.carPrice}>Rs.{car.price.toLocaleString()}</span>
                  </div>
                  <p className={s.carSpecs}>{car.mileage.toLocaleString()} Miles</p>
                  {car.location && <p className={s.carSpecs}>📍 {car.location}</p>}
                  <div className={s.btnBuyWrap}>
                    <button className={s.btnBuy}>Instant Purchase</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}