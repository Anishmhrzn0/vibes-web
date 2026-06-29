// app/layout.tsx — server component, handles metadata
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";  // ← client wrapper

export const metadata: Metadata = {
  title: "VIBES — Secure Sign In",
  description: "Access your premium automotive dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}