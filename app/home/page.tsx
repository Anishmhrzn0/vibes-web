"use client";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import s from "./home.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

// ── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    name: "Sedans",
    sub: "Luxury & Efficiency",
    tall: true,
    img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80",
  },
  {
    name: "SUVs",
    sub: "Power & Versatility",
    tall: false,
    img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80",
  },
  {
    name: "Trucks",
    sub: "Capability & Muscle",
    tall: false,
    img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
  },
];

const FOOTER_FEATURES = [
  {
    icon: "🛡️",
    title: "Buyer protection",
    desc: "Secure payments and comprehensive vehicle inspections on every transaction.",
  },
  {
    icon: "🚚",
    title: "Fast logistics",
    desc: "Door-to-door enclosed transport services available nationwide for all purchased vehicles.",
  },
  {
    icon: "💳",
    title: "Premium financing",
    desc: "Tailored financial solutions with competitive rates from our network of elite lending partners.",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function HomePage() {

  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [cars, setCars] = useState<ApiCar[]>([]);

  useEffect(() => {
    fetch("/api/cars")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCars(data);
      })
      .catch((err) => console.error("Failed to load cars", err));
  }, []);

  const filteredCars = cars.filter((car) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      car.make.toLowerCase().includes(q) ||
      car.carModel.toLowerCase().includes(q) ||
      car.location?.toLowerCase().includes(q) ||
      String(car.year).includes(q)
    );
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;
  console.log("current user:", user);

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
  <Link href="/profile" className={s.btnAccount}>
    {user.fullName?.split(" ")[0] ?? "Account"}
  </Link>
) : (
  <Link href="/login" className={s.btnAccount}>Account</Link>
)}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={s.hero}>
        <div className={s.heroBg} />
        <div className={s.heroGlint} />
        <div className={s.heroOverlay} />
        <div className={s.heroContent}>
          <p className={s.heroTag}>Engineering Excellence, Delivered.</p>
          <h1 className={s.heroTitle}>
            Discover the most curated selection of verified premium vehicles with 100% transaction security.
          </h1>
          <div className={s.heroSearch}>
            <div className={s.hsInputWrap}>
              <span className={s.hsIcon}>🔍</span>
              <input
  className={s.hsInput}
  type="text"
  placeholder="Search make, model, or year"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
            </div>
            <div className={s.hsSelectWrap}>
              <select className={s.hsSelect} aria-label="Body type">
                <option>All Body Types</option>
                <option>Sedan</option>
                <option>SUV</option>
                <option>Truck</option>
                <option>Coupe</option>
                <option>Convertible</option>
              </select>
              <span className={s.hsChevron}>▾</span>
            </div>
            <button className={s.btnFind}>Find My Vehicle</button>
          </div>
        </div>
      </section>

      {/* ── Browse by Category ── */}
      <section className={s.section}>
        <div className={s.sectionHeader}>
          <div>
            <h2 className={s.sectionTitle}>Browse by category</h2>
            <p className={s.sectionSub}>Precision engineered vehicles for every journey</p>
          </div>
          <Link href="#" className={s.viewAll}>View All →</Link>
        </div>
        <div className={s.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className={`${s.catCard} ${cat.tall ? s.catTall : ""}`}
            >
              <div
                className={s.catPhoto}
                style={{ backgroundImage: `url('${cat.img}')` }}
              >
                <div className={s.catLabel}>
                  <div className={s.catName}>{cat.name}</div>
                  <div className={s.catSub}>{cat.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Instant Buy ── */}
      <section className={s.featuredSection}>
        <div className={s.featTop}>
          <div>
            <h2 className={s.sectionTitle}>Featured instant buy</h2>
            <p className={s.sectionSub} style={{ marginBottom: 0 }}>
              Verified vehicles ready for immediate ownership.
            </p>
          </div>
          <div className={s.carouselBtns}>
            <button className={s.carouselBtn} aria-label="Previous">‹</button>
            <button className={s.carouselBtn} aria-label="Next">›</button>
          </div>
        </div>

        <div className={s.carsRow}>
          {filteredCars.map((car) => (
            <div
              key={car._id}
              className={s.carCard}
              onClick={() => router.push(`/cars/${car._id}`)}
            >
              <div
                className={s.carImg}
                style={{
                  backgroundImage: `url('${car.images?.[0]
                      ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${car.images[0]}`
                      : "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80"
                    }')`,
                }}
              >
                <span className={`${s.carBadge} ${s.badge_blue}`}>Verified</span>
                <button
                  className={s.carWish}
                  aria-label="Add to wishlist"
                  onClick={(e) => e.stopPropagation()}
                >
                  🤍
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
                <p className={s.carSpecs}>{car.mileage.toLocaleString()} Miles</p>
                {car.location && <p className={s.carSpecs}>📍 {car.location}</p>}
                <div className={s.btnBuyWrap}>
                  <button className={s.btnBuy}>Instant Purchase</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer top ── */}
      <footer>
        <div className={s.footerMid}>
          <div>
            <div className={s.footerBrand}>VIBES</div>
            <div className={s.footerCopy}>
              © 2025 VIBES Global Marketplace. All Rights Reserved.
            </div>
          </div>
          <div className={s.footerTrust}>
            {["Buyer Protection", "Seller Guarantee", "Privacy first", "Terms of Service"].map(
              (t) => (
                <div key={t} className={s.trustItem}>{t.replace(" ", "\n")}</div>
              )
            )}
          </div>
          <div className={s.footerIcons}>
            <button className={s.iconBtn} aria-label="Settings">⚙️</button>
            <button className={s.iconBtn} aria-label="Language">🌐</button>
          </div>
        </div>

        <div className={s.footerBottom}>
          <div className={s.footerFeatures}>
            {FOOTER_FEATURES.map((f) => (
              <div key={f.title}>
                <div className={s.featIconWrap}>{f.icon}</div>
                <div className={s.featTitle}>{f.title}</div>
                <div className={s.featDesc}>{f.desc}</div>
              </div>
            ))}
          </div>
          <div className={s.footerLinks}>
            {["Privacy Policy", "Terms of Service", "Verified Seller Program", "Support"].map(
              (l) => (
                <Link key={l} href="#" className={s.footerLink}>{l}</Link>
              )
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}