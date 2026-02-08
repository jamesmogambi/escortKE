import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MessageAlert from "@/components/MessageAlert";
import "quill/dist/quill.core.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Viewport configuration for responsive design
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "dark",
};

// Enhanced metadata
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://escort-site.com",
  ),

  // Title configuration
  title: {
    default: "Premium Escorts in Kenya | Verified Companions",
    template: "%s | YourSiteName", // Dynamic title template
  },

  // Description
  description:
    "Find verified escorts in Kenya. Browse professional companions with real photos, reviews, rates, and contact information. Safe and discreet bookings.",
  // Point to your generated icons
  // icons: {
  //   icon: [
  //     // App favicon (generated from icon.tsx)
  //     { url: "/icon?t=1", type: "image/png" }, // Add timestamp for cache busting

  //     // Fallback to static icons
  //     { url: "/favicon.ico" },
  //     { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
  //     { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
  //   ],

  //   apple: [
  //     { url: "/apple-icon?t=1", type: "image/png" }, // Generated apple icon
  //     { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  //   ],

  //   other: [
  //     {
  //       rel: "mask-icon",
  //       url: "/safari-pinned-tab.svg",
  //       color: "#000000",
  //     },
  //   ],
  // },
  // Keywords
  keywords: [
    "escorts Kenya",
    "Nairobi escorts",
    "Mombasa escorts",
    "premium companions",
    "verified escorts",
    "Kenya escorts",
    "local escorts",
    "companionship",
    "adult services",
    "discreet dating",
    "professional escorts",
  ].join(", "),

  // Authors
  authors: [{ name: "YourSiteName" }],

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "/",
    siteName: "YourSiteName",
    title: "Premium Escorts in Kenya | Verified Companions",
    description:
      "Find verified escorts in Kenya with real photos, reviews, and contact information.",
    images: [
      {
        url: "/og-image.jpg", // Create this image (1200x630px)
        width: 1200,
        height: 630,
        alt: "YourSiteName - Premium Escorts in Kenya",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    site: "@yoursite", // Replace with your Twitter handle
    creator: "@yoursite",
    title: "Premium Escorts in Kenya",
    description: "Verified companions with real photos and reviews.",
    images: ["/twitter-image.jpg"], // Create this image (1200x600px)
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification (add your own)
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },

  // Manifest
  manifest: "/manifest.json",

  // Canonical
  alternates: {
    canonical: "/",
    languages: {
      "en-KE": "/",
    },
  },

  // Category for adult content
  category: "Adult",

  // Other metadata for SEO
  other: {
    rating: "RTA-5042-1996-1400-1577-RTA", // Required for adult content
    classification: "Adult Content",
    distribution: "global",
    language: "en",
    robots: "index, follow",
    "revisit-after": "7 days",
    author: "YourSiteName",
    copyright: `© ${new Date().getFullYear()} YourSiteName. All rights reserved.`,
    "geo.region": "KE",
    "geo.placename": "Kenya",
    "geo.position": "-1.286389;36.817223", // Nairobi coordinates
    ICBM: "-1.286389, 36.817223",
    "og:price:currency": "KES",
    "fb:app_id": "your-facebook-app-id", // If using Facebook login
  },
};

// JSON-LD Structured Data for homepage
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "YourSiteName",
  description: "Premium escort directory for Kenya",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://escort-site.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://escort-site.com"}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "YourSiteName",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://escort-site.com",
    logo: {
      "@type": "ImageObject",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://escort-site.com"}/logo.png`,
      width: 600,
      height: 60,
    },
  },
  inLanguage: "en-KE",
  countryOfOrigin: "KE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en-KE">
        {/* Structured Data */}
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />

          {/* Preconnect to important domains */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />

          {/* Preload critical assets */}
          <link rel="preload" href="/background.jpg" as="image" />

          {/* Apple Touch Icon */}
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <meta name="apple-mobile-web-app-title" content="YourSiteName" />
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

          {/* PWA Configuration */}
          <link rel="manifest" href="/manifest.json" />

          {/* Security headers would be in next.config.js */}
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased text-white bg-dark-slate min-h-screen flex flex-col`}
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
              alt="Grayscale Background"
              fill
              priority
              quality={100}
              style={{
                objectFit: "cover",
                filter: "grayscale(100%)",
              }}
            />
          </div>

          <header>
            <Header />
          </header>
          {/* <MessageAlert /> */}

          {/* Main Content Scrolls Above */}
          <main className="  bg-black/80 flex-1 py-4  w-full ">{children}</main>

          <Footer />
          <Toaster position="bottom-left" />
        </body>
      </html>
    </ClerkProvider>
  );
}
