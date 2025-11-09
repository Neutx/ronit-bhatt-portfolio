import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import ServiceWorkerRegistration from '@/src/components/ServiceWorkerRegistration'
import { LoaderProvider } from '@/src/contexts/LoaderContext'
import Loader from '@/src/components/Loader'
import ProgressTracker from '@/src/components/ProgressTracker'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
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
          <ProgressTracker />
          <Loader />
          {children}
        </LoaderProvider>
      </body>
    </html>
  )
}

