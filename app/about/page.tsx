"use client";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import s from "./about.module.css";

export default function AboutPage() {
  const { user } = useAuth();

  return (
    <div className={s.page}>
      {/* Navbar */}
      <nav className={s.nav}>
        <Link href="/home" className={s.navBrand}>VIBES</Link>
        <div className={s.navLinks}>
          <Link href="/home" className={s.navLink}>Buy</Link>
          <Link href="/sell" className={s.navLink}>Sell</Link>
          <Link href="/about" className={`${s.navLink} ${s.navLinkActive}`}>About</Link>
        </div>
        {user ? (
          <Link href="/profile" className={s.btnAccount}>
            {user.fullName?.split(" ")[0] ?? "Account"}
          </Link>
        ) : (
          <Link href="/login" className={s.btnAccount}>Account</Link>
        )}
      </nav>

      {/* Hero */}
      <section className={s.hero}>
        <p className={s.heroTag}>About VIBES</p>
        <h1 className={s.heroTitle}>
          A trusted marketplace for buying and selling vehicles in Nepal.
        </h1>
        <p className={s.heroSub}>
          Every listing on VIBES is verified before it goes live, and every purchase
          is protected — from the first deposit to the final sale.
        </p>
      </section>

      {/* How it works */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>How VIBES works</h2>
        <p className={s.sectionSub}>
          A simple, secure path from browsing to owning your next vehicle.
        </p>
        <div className={s.steps}>
          <div className={s.step}>
            <div className={s.stepNum}>1</div>
            <h3 className={s.stepTitle}>Browse verified listings</h3>
            <p className={s.stepDesc}>
              Every vehicle is reviewed by our admin team before it appears on the
              marketplace, so you're only ever browsing real, checked listings.
            </p>
          </div>
          <div className={s.step}>
            <div className={s.stepNum}>2</div>
            <h3 className={s.stepTitle}>Reserve with a deposit</h3>
            <p className={s.stepDesc}>
              Found the one? Pay a small deposit through eSewa to book it for a
              test drive — this takes it off the market so no one else can claim it.
            </p>
          </div>
          <div className={s.step}>
            <div className={s.stepNum}>3</div>
            <h3 className={s.stepTitle}>Test drive & complete</h3>
            <p className={s.stepDesc}>
              After your test drive, go ahead with the purchase, or cancel and get
              your deposit back (minus a small flat fee).
            </p>
          </div>
        </div>
      </section>

      {/* Trust features */}
      <section className={s.section} style={{ paddingTop: 0 }}>
        <h2 className={s.sectionTitle}>Why sellers and buyers trust us</h2>
        <div className={s.trustGrid}>
          <div className={s.trustCard}>
            <div className={s.trustIcon}>🛡️</div>
            <h3 className={s.trustTitle}>Buyer Protection</h3>
            <p className={s.trustDesc}>
              Every listing goes through admin review, and deposits are only
              released once a booking is confirmed.
            </p>
          </div>
          <div className={s.trustCard}>
            <div className={s.trustIcon}>✅</div>
            <h3 className={s.trustTitle}>Seller Guarantee</h3>
            <p className={s.trustDesc}>
              Sellers keep full control of their listings and are notified
              instantly when a buyer reserves their vehicle.
            </p>
          </div>
          <div className={s.trustCard}>
            <div className={s.trustIcon}>💬</div>
            <h3 className={s.trustTitle}>Always-on Assistant</h3>
            <p className={s.trustDesc}>
              Our built-in assistant can help you find the right vehicle or
              answer questions about how buying and selling works, any time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={s.cta}>
        <h2 className={s.ctaTitle}>Ready to find your next vehicle?</h2>
        <div className={s.ctaBtns}>
          <Link href="/home" className={s.btnPrimary}>Browse Listings</Link>
          <Link href="/sell" className={s.btnSecondary}>Sell Your Vehicle</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={s.footer}>
        <div className={s.footerBrand}>VIBES</div>
        <div className={s.footerCopy}>© 2026 VIBES Global Marketplace. All Rights Reserved.</div>
      </footer>
    </div>
  );
}