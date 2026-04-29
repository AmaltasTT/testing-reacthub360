import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Kigent Labs - Brand Growth Dashboard',
  description: 'Track your brand growth, analyze performance across platforms, and get AI-powered insights to accelerate your personal brand journey.',
  authors: [{ name: 'Kigent Labs' }],
  openGraph: {
    title: 'Kigent Labs - Brand Growth Dashboard',
    description: 'Track your brand growth, analyze performance across platforms, and get AI-powered insights.',
    type: 'website',
    images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kigent Labs - Brand Growth Dashboard',
    description: 'Track your brand growth and get AI-powered insights.',
    images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
