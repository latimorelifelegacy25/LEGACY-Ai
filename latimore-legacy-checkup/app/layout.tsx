import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Legacy Protection Checkup | Latimore Life & Legacy LLC",
  description:
    "A guided Latimore Life & Legacy education funnel for protection, retirement income, taxes, and legacy planning."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
