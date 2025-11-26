import type { Metadata } from "next";
import YandexMapsScript from "@/components/YandexMapsScript";
import "./globals.css";

export const metadata: Metadata = {
  title: "Зона доставки от КАДа",
  description: "Next.js application with Yandex Maps API integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <YandexMapsScript />
        {children}
      </body>
    </html>
  );
}

