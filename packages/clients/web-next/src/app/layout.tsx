import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App",
  description: "Built on the product template",
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body className="bg-surface-muted text-text-DEFAULT antialiased">{children}</body>
    </html>
  );
}
