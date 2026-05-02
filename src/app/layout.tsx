import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Official Picks | Expert Sports Handicapping',
  description: 'Official Picks offers expert sports picks and betting analysis for NFL, NBA, MLB, College Sports, and Horse Racing. Built on deep statistical analysis. Don\'t bet blind — bet with us.',
  keywords: 'sports picks, handicapping, football picks, basketball picks, horse racing, MLB, NFL, NBA, betting advice, expert picks',
  openGraph: {
    title: 'Official Picks | Expert Sports Handicapping',
    description: 'Expert sports picks and betting analysis. NFL, NBA, MLB, College Sports, and Horse Racing.',
    siteName: 'Official Picks',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          body {
            background: var(--navy);
          }
        `}</style>
      </head>
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--navy-card)',
              color: '#fff',
              border: '1px solid var(--navy-border)',
              borderRadius: '12px',
              fontSize: '15px',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#22C55E', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  )
}