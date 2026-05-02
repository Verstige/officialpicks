import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Harry's Picks | Expert Sports Handicapping",
  description: "Harry's Picks offers expert sports picks and betting advice for football, baseball, basketball, and more. Unlock winning strategies, free picks, and daily predictions to boost your betting success.",
  keywords: "sports picks, handicapping, football picks, baseball picks, basketball picks, MLB picks, NFL picks, NBA picks, Uncle Harry",
  openGraph: {
    title: "Harry's Picks | Expert Sports Handicapping",
    description: "Expert sports picks from Uncle Harry — Football, Baseball, Basketball, Horse Racing. Join 10,000+ members.",
    url: "https://harryspicks.com",
    siteName: "Harry's Picks",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111827',
              color: '#fff',
              border: '1px solid #1E2A3A',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#F5A623', secondary: '#070B14' }
            }
          }}
        />
      </body>
    </html>
  );
}
