import { ClerkProvider } from '@clerk/nextjs'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Viewport } from 'next'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

// Structured data schemas
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "KENYADIVAS",
  "url": "https://kenyadivas.com",
  // Add your other structured data here
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  // Add your organization schema here
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 0.75,
  minimumScale: 0.75,
  maximumScale: 1,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "dark",
}

export const metadata = {
  title: 'KENYADIVAS - Premier Escorts in Kenya',
  description: 'Discover the finest escorts in Kenya. Professional, discreet, and unforgettable experiences.',
  metadataBase: new URL('https://kenyadivas.com'),
  keywords: ['escorts Kenya', 'Nairobi escorts', 'premium escorts', 'KENYADIVAS'],
  authors: [{ name: 'KENYADIVAS' }],
  creator: 'KENYADIVAS',
  publisher: 'KENYADIVAS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en-KE">
        <head>
          {/* Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />

          {/* Preconnect to important domains */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link rel="preconnect" href="https://images.unsplash.com" />
          <link rel="preconnect" href="https://client.crisp.chat" />

          {/* Preload critical assets */}
          <link rel="preload" href="/background.jpg" as="image" />
          <link rel="preload" href="/logo.png" as="image" />

          {/* Apple Touch Icon */}
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <meta name="apple-mobile-web-app-title" content="KENYADIVAS" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />

          {/* Microsoft Tiles */}
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
          <meta name="msapplication-config" content="/browserconfig.xml" />

          {/* Additional meta tags */}
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="application-name" content="KENYADIVAS" />

          {/* Language and region */}
          <meta name="language" content="English" />
          <meta name="geo.country" content="KE" />
          <meta name="geo.region" content="KE-30" />

          {/* PWA Configuration */}
          <link rel="manifest" href="/manifest.json" />

          {/* RSS Feed */}
          <link
            rel="alternate"
            type="application/rss+xml"
            title="KENYADIVAS - Latest Escorts"
            href="/rss.xml"
          />

          {/* Sitemap */}
          <link
            rel="sitemap"
            type="application/xml"
            title="Sitemap"
            href="/sitemap.xml"
          />
        </head>
        <body
          className={`${GeistSans.variable} ${GeistMono.variable} antialiased text-white bg-dark-slate min-h-screen flex flex-col`}
        >
          {/* Fixed Grayscale Background */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: -1,
              overflow: "hidden",
            }}
          >
            <Image
              src="/background.jpg"
              alt="KENYADIVAS Background"
              fill
              priority
              quality={100}
              style={{
                objectFit: "cover",
                filter: "grayscale(100%)",
              }}
            />
          </div>

          {/* Header - auto height */}
          <header className="w-full z-10 relative">
            <Header />
          </header>

          {/* Main Content - flex-1 ensures it takes remaining space */}
          <main className="bg-black/80 flex-1 py-4 w-full relative z-10">
            <TooltipProvider>
              <div className="container mx-auto px-4">
                {children}
              </div>
            </TooltipProvider>
          </main>

          {/* Footer - automatically pushed to bottom by flex-1 on main */}
          <footer className="w-full relative z-10">
            <Footer />
          </footer>
          
          {/* Toaster for notifications */}
          <Toaster position="bottom-left" />
        </body>
      </html>
    </ClerkProvider>
  )
}