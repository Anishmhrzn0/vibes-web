import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import ChatWidget from "./components/assistant/ChatWidget";

export const metadata: Metadata = {
  title: "VIBES — Secure Sign In",
  description: "Access your premium automotive dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}