"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import s from "./car.module.css";

// ── Mock data — replace with real API call ────────────────────────────────────
const CAR_DB: Record<string, CarDetail> = {
  "2023-porsche-911": {
    id: "2023-porsche-911",
    name: "2024 GT Masterclass",
    subtitle: "Limited Edition Performance Variant • 1,200 Miles",
    price: "Rs.10,480,500",
    marketNote: "Rs.4,49900 below market average",
    badge: "VERIFIED SELLER",
    badge2: "NEW ARRIVAL",
    images: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&q=80",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=400&q=80",
    ],
    specs: {
      engine: { label: "ENGINE", value: "4.0L V8 Bi-Turbo", sub: "503 Horsepower" },
      transmission: { label: "TRANSMISSION", value: "9-Speed Dual Clutch", sub: "Sport+ Response" },
      drivetrain: { label: "DRIVETRAIN", value: "All-Wheel Drive", sub: "Adaptive Handling" },
    },
    history: {
      singleOwner: true,
      zeroAccidents: true,
      fullService: true,
      lastInspection: "August 12, 2024",
    },
    seller: {
      name: "Marcus Sterling",
      role: "Elite Performance Dealer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80",
      rating: 5.0,
    },
    description: `This 2024 GT Masterclass represents the pinnacle of modern performance and grand touring comfort. Meticulously maintained by its first owner and stored in a climate-controlled facility, the vehicle retains its original factory scent and pristine finish. The obsidian black interior features hand-stitched leather and premium carbon fiber trim throughout.

Equipped with the Track Performance Package, this model includes upgraded carbon ceramic brakes, adaptive suspension damping, and the premium surround-sound system. Every service has been performed at certified dealerships, ensuring the mechanical integrity of this exceptional machine.`,
  },
  "2024-audi-q8-etron": {
    id: "2024-audi-q8-etron",
    name: "2024 Audi Q8 e-tron",
    subtitle: "Premium Electric SUV • 51 Miles",
    price: "Rs.10,480,500",
    marketNote: "Rs.2,00,000 below market average",
    badge: "CERTIFIED",
    badge2: "ELECTRIC",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&q=80",
    ],
    specs: {
      engine: { label: "MOTOR", value: "Dual Electric", sub: "408 Horsepower" },
      transmission: { label: "TRANSMISSION", value: "Single-Speed", sub: "Automatic" },
      drivetrain: { label: "DRIVETRAIN", value: "All-Wheel Drive", sub: "Quattro AWD" },
    },
    history: {
      singleOwner: true,
      zeroAccidents: true,
      fullService: true,
      lastInspection: "October 5, 2024",
    },
    seller: {
      name: "Audi Certified",
      role: "Official Audi Dealer",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&q=80",
      rating: 4.9,
    },
    description: `The 2024 Audi Q8 e-tron sets a new benchmark for electric luxury SUVs. With only 51 miles on the odometer, this vehicle is essentially new and comes with the full Audi factory warranty. The advanced dual-motor system delivers instant torque and a range of over 300 miles on a single charge.

The interior features Audi's latest MMI touch response system with a 10.1-inch display, premium Bang & Olufsen sound system, and massaging front seats. The panoramic sunroof and ambient lighting system create an unparalleled cabin experience.`,
  },
  "2022-bmw-m8": {
    id: "2022-bmw-m8",
    name: "2022 BMW M8",
    subtitle: "Competition Package • 16,880 Miles",
    price: "Rs.10,480,500",
    marketNote: "Rs.1,50,000 below market average",
    badge: "FEATURED",
    badge2: "PERFORMANCE",
    images: [
      "https://images.unsplash.com/photo-1555652736-e92021d28a10?w=800&q=80",
      "https://images.unsplash.com/photo-1617531653332-bd46c16f7d5e?w=400&q=80",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&q=80",
      "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=400&q=80",
    ],
    specs: {
      engine: { label: "ENGINE", value: "4.4L V8 TwinPower", sub: "617 Horsepower" },
      transmission: { label: "TRANSMISSION", value: "8-Speed M Steptronic", sub: "Sport Automatic" },
      drivetrain: { label: "DRIVETRAIN", value: "All-Wheel Drive", sub: "M xDrive" },
    },
    history: {
      singleOwner: true,
      zeroAccidents: true,
      fullService: true,
      lastInspection: "July 20, 2024",
    },
    seller: {
      name: "BMW Performance",
      role: "Certified BMW Dealer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80",
      rating: 4.8,
    },
    description: `The 2022 BMW M8 Competition represents the absolute pinnacle of BMW's performance lineup. This meticulously maintained example has been driven sparingly and serviced exclusively at BMW dealerships. The Competition Package adds an additional 17 horsepower and sport-tuned suspension for an even more dynamic driving experience.

The Merino leather interior with M carbon fiber trim creates a cockpit-like atmosphere that perfectly complements the car's performance credentials. The Bowers & Wilkins Diamond surround sound system provides concert-hall audio quality on the move.`,
  },
};

interface CarSpec {
  label: string;
  value: string;
  sub: string;
}

interface CarDetail {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  marketNote: string;
  badge: string;
  badge2: string;
  images: string[];
  specs: {
    engine: CarSpec;
    transmission: CarSpec;
    drivetrain: CarSpec;
  };
  history: {
    singleOwner: boolean;
    zeroAccidents: boolean;
    fullService: boolean;
    lastInspection: string;
  };
  seller: {
    name: string;
    role: string;
    avatar: string;
    rating: number;
  };
  description: string;
}

// ── Page Component ─────────────────────────────────────────────────────────────
export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [car, setCar] = useState<CarDetail | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [carId, setCarId] = useState<string>("");

  useEffect(() => {
    params.then(({ id }) => {
      setCarId(id);
      const found = CAR_DB[id];
      if (found) setCar(found);
    });
  }, [params]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;
  if (!car) return (
    <div className={s.notFound}>
      <p>Vehicle not found.</p>
      <Link href="/" className={s.backLink}>← Back to listings</Link>
    </div>
  );

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
          <span className={s.breadcrumbCurrent}>{car.name}</span>
        </div>

        <div className={s.layout}>
          {/* ── Left column ── */}
          <div className={s.leftCol}>
            {/* Title */}
            <div className={s.titleRow}>
              <div>
                <h1 className={s.carTitle}>{car.name}</h1>
                <p className={s.carSubtitle}>{car.subtitle}</p>
              </div>
              <div className={s.titleBadges}>
                <span className={s.badgeVerified}>{car.badge}</span>
                <span className={s.badgeNew}>{car.badge2}</span>
                <span className={s.titlePrice}>{car.price}</span>
              </div>
            </div>

            {/* Images */}
            <div className={s.imageSection}>
              <div className={s.mainImg}>
                <img
                  src={car.images[activeImg]}
                  alt={car.name}
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
                    <img src={img} alt={`View ${i + 2}`} className={s.thumbImg} />
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
                {Object.values(car.specs).map((spec) => (
                  <div key={spec.label} className={s.specItem}>
                    <div className={s.specLabel}>{spec.label}</div>
                    <div className={s.specValue}>{spec.value}</div>
                    <div className={s.specSub}>{spec.sub}</div>
                  </div>
                ))}
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
                    <span className={s.checkIcon}>✅</span> Single Owner Vehicle
                  </div>
                  <div className={s.historyItem}>
                    <span className={s.checkIcon}>✅</span> Zero Accidents Reported
                  </div>
                  <div className={s.historyItem}>
                    <span className={s.checkIcon}>✅</span> Full Service Record Available
                  </div>
                </div>
              </div>
              <div className={s.historyRight}>
                <div className={s.lastInspLabel}>LAST INSPECTION</div>
                <div className={s.lastInspDate}>{car.history.lastInspection}</div>
              </div>
            </div>

            {/* Description */}
            <div className={s.descCard}>
              <h3 className={s.descTitle}>Seller's Description</h3>
              {car.description.split("\n\n").map((para, i) => (
                <p key={i} className={s.descPara}>{para}</p>
              ))}
            </div>
          </div>

          {/* ── Right column ── */}
          <div className={s.rightCol}>
            {/* Price card */}
            <div className={s.priceCard}>
              <div className={s.priceLabel}>MARKET PRICE</div>
              <div className={s.priceValue}>{car.price}</div>
              <div className={s.priceNote}>✦ {car.marketNote}</div>

              <button className={s.btnBuyNow}>Buy Now</button>
              <button className={s.btnInspect}>📅 Schedule Inspection</button>
              <button className={s.btnMessage}>💬 Message Seller</button>
            </div>

            {/* Seller card */}
            <div className={s.sellerCard}>
              <img src={car.seller.avatar} alt={car.seller.name} className={s.sellerAvatar} />
              <div className={s.sellerInfo}>
                <div className={s.sellerName}>{car.seller.name}</div>
                <div className={s.sellerRole}>{car.seller.role}</div>
                <div className={s.sellerRating}>
                  {"★".repeat(Math.round(car.seller.rating))} {car.seller.rating.toFixed(1)}
                </div>
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