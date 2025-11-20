// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '../contexts/AuthContext'
import { Plus_Jakarta_Sans } from 'next/font/google'

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta'
})

export const metadata: Metadata = {
  title: 'Ramein',
  description: 'Sistem Informasi Manajemen Kegiatan',
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={plusJakarta.className} suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
