import "./globals.css";
import { AppLayout } from "@/components/layout";
import { ReactNode } from "react";

export const metadata = {
  title: "TradingMine",
  description: "AI-assisted stock trading workstation"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
