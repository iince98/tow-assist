import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pannenhelfer - Schnelle Abschleppdienst in Hamburg',
  description: 'Ihr zuverlässiger Partner für Abschleppdienst und Pannenhilfe in Hamburg. 24/7 verfügbar, schnelle Hilfe bei Autopannen.',
  keywords: 'Abschleppdienst, Pannenhilfe, Hamburg, Auto, Panne, Abschleppservice',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            
            {/* Footer with legal links */}
            <footer className="bg-gray-900 text-white py-8">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <p className="text-gray-400">
                      © {new Date().getFullYear()} Road Help GmbH. Alle Rechte vorbehalten.
                    </p>
                  </div>
                  
                  <div className="flex space-x-6">
                    <Link 
                      href="/impressum" 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Impressum
                    </Link>
                    <Link 
                      href="/datenschutz" 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Datenschutz
                    </Link>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}