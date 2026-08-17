import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Visual Memory Archive — Your private visual universe',
  description: 'A dark visual universe for collecting memories, places, interests, stories, notes, and moments.',
  applicationName: 'Visual Memory Archive',
  keywords: ['visual memory archive', 'digital universe', 'private archive', 'memories', 'collections', 'places', 'notes'],
  authors: [{ name: 'Shreya Sarkar' }],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Visual Memory Archive — Your private visual universe',
    description: 'A dark visual universe for collecting memories, places, interests, stories, notes, and moments.',
    type: 'website',
    siteName: 'Visual Memory Archive',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased bg-black text-white selection:bg-[#c8a2ff]/30 selection:text-white">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
