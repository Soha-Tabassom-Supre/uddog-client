import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Uddog (উদ্যোগ) — Small actions. Shared impact.",
  description:
    "Discover, organize, and participate in local social-service initiatives.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
       
          <div className="flex-1">{children}</div>
         
      </body>
    </html>
  );
}
