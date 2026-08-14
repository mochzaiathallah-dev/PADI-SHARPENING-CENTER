import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AppProvider } from "../context/AppContext";
import NavigationProgress from "../components/NavigationProgress";
import { getSiteSettings } from "./admin/actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Padi Sharpening Center - Jasa Asah Pisau Profesional & Alat Sembelih",
  description: "Pusat layanan asah pisau profesional, penjualan alat tajam, dan pelatihan di Surabaya. Kembalikan ketajaman bilah Anda dengan presisi tinggi bersama Padi Solutions.",
  keywords: "Jasa asah pisau Surabaya, Jasa asah pisau terdekat, Asah pisau profesional dan terbaik, jasa asah termurah, Jasa asah paling terpercaya Jual pisau sembelih termurah, Pelatihan asah pisau paling terpercaya, Batu asah berkualitas daerah Surabaya, Padi Sharpening Center, Jasa juru sembelih halal bersertifikat BNSP, Jasa aqiqah terdekat dan terpercaya, Jual hewan ternak terbaik, Jasa jagal profesional, Jual aksesoris pisau termurah, Jasa aqiqah terbaik dan termurah, Jual batu asah terdekat, jual batu asah termurah dan terpercaya, Jual pisau Terdekat, Jual pisau termurah dan terpercaya, jasa asah pisau indonesia, jual hewan ternak indonesia, jual hewan ternak terpercaya dan termurah, ",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://sharpening.padigroup.my.id",
    title: "Padi Sharpening Center - Jasa Asah Pisau Profesional & Alat Sembelih",
    description: "Pusat layanan asah pisau profesional, penjualan alat tajam, dan pelatihan di Surabaya. Kembalikan ketajaman bilah Anda dengan presisi tinggi bersama Padi Solutions.",
    siteName: "Padi Sharpening Center",
    images: [
      {
        url: "https://sharpening.padigroup.my.id/logo.webp",
        width: 1200,
        height: 630,
        alt: "Padi Sharpening Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Padi Sharpening Center - Jasa Asah Pisau Profesional & Alat Sembelih",
    description: "Pusat layanan asah pisau profesional, penjualan alat tajam, dan pelatihan di Surabaya. Kembalikan ketajaman bilah Anda dengan presisi tinggi bersama Padi Solutions.",
    images: ["https://sharpening.padigroup.my.id/logo.webp"],
  },
  other: {
    "geo.region": "ID-JI",
    "geo.placename": "Surabaya",
    "geo.position": "-7.3193;112.7990",
    "ICBM": "-7.3193, 112.7990",
  },
  verification: {
    google: "sC6q7THR5ffMt8fqoBtrN5TKS8ffOJVd8wz25q-VNh4",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const rawPhone = settings?.footerPhone || "+628123456789";
  const cleanPhone = rawPhone.replace(/\D/g, "");
  const schemaPhone = cleanPhone.startsWith("0") ? "+62" + cleanPhone.slice(1) : cleanPhone.startsWith("+") ? cleanPhone : "+" + cleanPhone;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Padi Sharpening Center",
    "image": "https://sharpening.padigroup.my.id/logo.webp",
    "@id": "https://sharpening.padigroup.my.id/#localbusiness",
    "url": "https://sharpening.padigroup.my.id",
    "telephone": schemaPhone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Tambak Medokan Ayu III B / 06, Kelurahan Medokan Ayu, Kecamatan Rungkut",
      "addressLocality": "Surabaya",
      "addressRegion": "Jawa Timur",
      "postalCode": "60295",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -7.3193,
      "longitude": 112.7990
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "17:00"
    },
    "sameAs": [
      "https://www.instagram.com/padisharpening"
    ]
  };

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Instant blocking theme script to eliminate any white flash on dark mode devices */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AppProvider initialSettings={JSON.parse(JSON.stringify(settings))}>
          <NavigationProgress />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
