import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yandex Maps API Next.js Integration",
  description: "Next.js application with Yandex Maps API integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

