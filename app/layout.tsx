import "./globals.css";
import { AppLayout } from "@/components/layout";
import { ReactNode } from "react";
import { getCurrentLocale } from "@/lib/locale";

export const metadata = {
  title: "TradingMine",
  description: "AI-assisted stock trading workstation"
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getCurrentLocale();

  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"}>
      <body>
        <AppLayout locale={locale}>{children}</AppLayout>
      </body>
    </html>
  );
}
