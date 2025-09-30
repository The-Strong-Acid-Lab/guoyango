import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./Providers";
import { Analytics } from "@vercel/analytics/next";
import { Amplitude } from "@/app/amplitude";

const alibabaPuHuiTi = localFont({
  src: [
    {
      path: "../../public/fonts/AlibabaPuHuiTi-3-35-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/AlibabaPuHuiTi-3-45-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/AlibabaPuHuiTi-3-55-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/AlibabaPuHuiTi-3-65-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/AlibabaPuHuiTi-3-75-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/AlibabaPuHuiTi-3-85-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/AlibabaPuHuiTi-3-95-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/AlibabaPuHuiTi-3-105-Heavy.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/AlibabaPuHuiTi-3-115-Black.woff2",
      weight: "950",
      style: "normal",
    },
  ],
  variable: "--font-alibaba-puhuiti",
  display: "swap",
});

export const metadata: Metadata = {
  title: "国烟Go-北美华人专门代购国烟-品质保证",
  description:
    "国烟Go是北美华人中国香烟代购和香烟现货网站,专为北美华人代购正品国烟,支持微信、支付宝等多种付款方式,代购香烟国烟,上国烟Go,7-10天到货。美国哪里买烟,加拿大哪里买烟,湾区买烟,多伦多国烟",
  keywords: "北美国烟，正品国烟，加拿大国烟，北美买烟，美国买烟",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${alibabaPuHuiTi.variable} font-sans antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Toaster position="top-center" />
            <NavBar />
            <Amplitude />
            <main className="flex-1">
              {children}
              <Analytics />
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
