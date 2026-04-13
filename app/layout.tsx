import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WasNun.jetzt – Dein Sofort-Helfer bei Arbeitslosigkeit',
  description: 'In 3 Minuten weißt du was du legal dazuverdienen darfst. Kostenlos, klar, ohne Behörden-Stress.',
  keywords: 'arbeitslos, bürgergeld rechner, ALG1 freibetrag, nebenverdienst',
  openGraph: {
    title: 'WasNun.jetzt',
    description: 'Dein kostenloser Sofort-Helfer bei Arbeitslosigkeit',
    type: 'website', locale: 'de_DE',
  },
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
