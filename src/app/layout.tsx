import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import ServiceWorkerRegistration from '@/src/components/ServiceWorkerRegistration'
import { LoaderProvider } from '@/src/contexts/LoaderContext'
import Loader from '@/src/components/Loader'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
// Only used for MenuPopup labels (weight 400), which are not part of first paint
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-space-grotesk',
  preload: false,
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RONIT BHATT',
  description: 'Film Director | Cinematographer | Editor | Writer',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full w-full overflow-hidden">
      <body className={`${inter.variable} ${spaceGrotesk.variable} h-full w-full overflow-hidden`}>
        <LoaderProvider>
          <ServiceWorkerRegistration />
          <Loader />
          {children}
        </LoaderProvider>
      </body>
    </html>
  )
}
