import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoPremium — Secure Sign In",
  description: "Access your premium automotive dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
