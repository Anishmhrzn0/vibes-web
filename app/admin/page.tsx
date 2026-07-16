"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import s from "./admin.module.css";

const STATS = [
  { label: "Total Sales",           value: "Rs.4.2Lac", delta: "+12% this month", positive: true },
  { label: "Active Listings",       value: "1,284",     delta: "+5% this week",   positive: true },
  { label: "Verification Pending",  value: "42",        delta: "Action Req",      positive: false, warn: true },
  { label: "New Users",             value: "312",       delta: "+18% this month", positive: true },
];

const ACTIVITY = [
  { dot: "blue",  title: "New sale completed",   desc: "Transaction ID #49201 just finalized.",          time: "2 mins ago"  },
  { dot: "amber", title: "Verification warning", desc: 'User "SpeedMaster" flagged for invalid VIN.',    time: "45 mins ago" },
  { dot: "green", title: "New verified seller",  desc: "EuroMotors has passed all security checks.",     time: "3 hours ago" },
  { dot: "gray",  title: "System update",        desc: "AutoPremium platform core updated to v2.6.",     time: "Yesterday"   },
];

const DISTRIBUTION = [
  { label: "Sports cars",    pct: 45, color: "#e8660d" },
  { label: "Luxury SUVs",   pct: 32, color: "#2563eb"  },
  { label: "Vintage classics", pct: 23, color: "#94a3b8" },
];

interface PendingCar {
  _id: string;
  make: string;
  carModel: string;
  price: number;
  sellerId: { fullName: string } | null;
}

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState<PendingCar[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    fetch("/api/admin/cars")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPending(data);
        } else {
          setPending([]);
        }
      })
      .catch((err) => console.error("Failed to load pending cars", err));
  }, [user]);

  const handleStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/admin/cars/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      setPending((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !user || user.role !== "admin") return null;

  return (
    <div className={s.shell}>
      {/* ── Sidebar ── */}
      <aside className={s.sidebar}>
        <div className={s.sbBrand}>VIBES</div>
        <nav className={s.sbNav}>
          <div className={`${s.sbItem} ${s.active}`}>
            <span className={s.sbIcon}>📊</span> Overview
          </div>
          <Link href="/admin/users" className={s.sbItem}>
            <span className={s.sbIcon}>👥</span> Users
          </Link>
        </nav>
        <div className={s.sbFooter}>
          <div className={s.sbAvatar}>
            {user.avatar
              ? <img src={user.avatar} alt={user.fullName} />
              : user.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className={s.sbUserName}>{user.fullName}</div>
            <div className={s.sbUserRole}>System Admin</div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={s.main}>
        {/* Topbar */}
        <div className={s.topbar}>
          <div className={s.searchBar}>
            <span className={s.searchIcon}>🔍</span>
            <input type="text" placeholder="Search analytics or users..." />
          </div>
          <div className={s.topbarIcons}>
            <button className={s.iconBtn} aria-label="Notifications">🔔</button>
            <button className={s.iconBtn} aria-label="Wishlist">🤍</button>
          </div>
          <button className={s.btnAccount}>Account</button>
        </div>

        {/* Content */}
        <div className={s.content}>
          {/* Stats */}
          <div className={s.statsRow}>
            {STATS.map((st) => (
              <div key={st.label} className={s.statCard}>
                <div className={s.statLabel}>{st.label}</div>
                <div className={s.statValue}>{st.value}</div>
                <div className={`${s.statDelta} ${st.warn ? s.deltaWarn : st.positive ? s.deltaPos : s.deltaNeg}`}>
                  {st.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Middle row */}
          <div className={s.midRow}>
            {/* Listing Verification */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <span className={s.cardTitle}>Listing verification</span>
                <Link href="#" className={s.viewAll}>View all</Link>
              </div>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Seller</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((l) => (
                    <tr key={l._id}>
                      <td>
                        <div className={s.carCell}>
                          <div className={s.carThumb} style={{ background: "#dbeafe" }}>
                            <span style={{ fontSize: 14, color: "#2563eb" }}>🚗</span>
                          </div>
                          <span className={s.carName}>{l.make} {l.carModel}</span>
                        </div>
                      </td>
                      <td className={s.seller}>{l.sellerId?.fullName ?? "Unknown"}</td>
                      <td className={s.price}>Rs.{l.price.toLocaleString()}</td>
                      <td>
                        <div className={s.actionBtns}>
                          <button className={s.btnApprove} aria-label="Approve" onClick={() => handleStatus(l._id, "approved")}>✓</button>
                          <button className={s.btnReject}  aria-label="Reject" onClick={() => handleStatus(l._id, "rejected")}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent Activity */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <span className={s.cardTitle}>Recent activity</span>
                <span style={{ fontSize: 15, color: "#94a3b8" }}>🕐</span>
              </div>
              <div className={s.activityList}>
                {ACTIVITY.map((a) => (
                  <div key={a.title} className={s.actItem}>
                    <div className={`${s.actDot} ${s[`dot_${a.dot}`]}`} />
                    <div>
                      <div className={s.actTitle}>{a.title}</div>
                      <div className={s.actDesc}>{a.desc}</div>
                      <div className={s.actTime}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className={s.bottomRow}>
            {/* Revenue chart */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <span className={s.cardTitle}>Platform performance</span>
              </div>
              <div className={s.perfSub}>
                Revenue forecast
                <span className={s.onTarget}>On target</span>
              </div>
              <div className={s.perfHero}>Rs.12.4Lac</div>
              <RevenueChart />
            </div>

            {/* Distribution */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <span className={s.cardTitle}>Listing distribution</span>
              </div>
              <div className={s.distList}>
                {DISTRIBUTION.map((d) => (
                  <div key={d.label} className={s.barRow}>
                    <span className={s.barLabel}>{d.label}</span>
                    <div className={s.barTrack}>
                      <div className={s.barFill} style={{ width: `${d.pct}%`, background: d.color }} />
                    </div>
                    <span className={s.barPct}>{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={s.footerStrip}>
          <div>
            <div className={s.footerBrand}>VIBES Admin Console</div>
            <div className={s.footerSub}>© 2024 VIBES Global Marketplace. All Rights Reserved.</div>
          </div>
          <div className={s.footerLinks}>
            <Link href="#">Privacy policy</Link>
            <Link href="#">Support desk</Link>
            <Link href="#">Security protocol</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function RevenueChart() {
  const bars = [
    { month: "Jan", val: 5.2 },
    { month: "Feb", val: 7.8 },
    { month: "Mar", val: 6.1 },
    { month: "Apr", val: 9.4 },
    { month: "May", val: 8.3 },
    { month: "Jun", val: 11.2 },
    { month: "Jul", val: 12.4 },
  ];
  const max = 14;

  return (
    <div className={s.chartWrap}>
      <div className={s.chartBars}>
        {bars.map((b, i) => (
          <div key={b.month} className={s.chartCol}>
            <div
              className={s.chartBar}
              style={{
                height: `${(b.val / max) * 100}%`,
                background: i === bars.length - 1 ? "#e8660d" : "#e2e8f0",
              }}
            />
            <span className={s.chartLabel}>{b.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}