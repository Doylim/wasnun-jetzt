import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WasNun.jetzt – Dein Sofort-Helfer bei Arbeitslosigkeit',
  description:
    'Du bist arbeitslos und weißt nicht was nun? In 3 Minuten weißt du was du legal dazuverdienen darfst – und wie du noch heute anfangen kannst.',
  keywords: 'arbeitslos, bürgergeld rechner, ALG1 freibetrag, nebenverdienst, jobcenter',
  openGraph: {
    title: 'WasNun.jetzt – Sofort-Helfer bei Arbeitslosigkeit',
    description: 'Kostenloser Freibetrag-Rechner + persönlicher Sofort-Plan',
    type: 'website',
    locale: 'de_DE',
  },
  robots: { index: false, follow: false }, // vor Go-Live auf true setzen
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
