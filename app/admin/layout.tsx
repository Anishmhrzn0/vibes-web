"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import s from "./admin.module.css";

const NAV_ITEMS = [
  { href: "/admin", icon: "📊", label: "Overview" },
  { href: "/admin/users", icon: "👥", label: "Users" },
  { href: "/admin/cars", icon: "🚗", label: "Vehicles" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") return null;

  return (
    <div className={s.shell}>
      <aside className={s.sidebar}>
        <div className={s.sbBrand}>VIBES</div>
        <nav className={s.sbNav}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${s.sbItem} ${active ? s.active : ""}`}
              >
                <span className={s.sbIcon}>{item.icon}</span> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className={s.sbFooter}>
          <div className={s.sbAvatar}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.fullName} />
            ) : (
              user.fullName?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className={s.sbUserName}>{user.fullName}</div>
            <div className={s.sbUserRole}>System Admin</div>
          </div>
        </div>
      </aside>

      <div className={s.main}>
        <div className={s.topbar}>
          <div className={s.searchBar}>
            <span className={s.searchIcon}>🔍</span>
            <input type="text" placeholder="Search analytics or users..." />
          </div>
          <div className={s.topbarIcons}>
            <button className={s.iconBtn} aria-label="Notifications">🔔</button>
            <Link href="/wishlist" className={s.iconBtn} aria-label="Wishlist">🤍</Link>
          </div>
          <Link href="/profile" className={s.btnAccount}>Account</Link>
        </div>

        <div className={s.content}>{children}</div>
      </div>
    </div>
  );
}