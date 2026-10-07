import type { Metadata, Viewport } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { LayerOSProvider } from "@/lib/store";
import { ThemeProvider } from "@/lib/theme/context";

export const metadata: Metadata = {
  title: "LayerOS - AI-Powered Layer Poultry ERP (Maharashtra)",
  description: "AI-Powered Layer Poultry & Egg Business Management Web App for commercial layer farms in Maharashtra, India.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#1F4D3A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mr" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('layeros_theme_mode');
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF8F3] dark:bg-[#0F1A15] text-[#0B1E15] dark:text-[#F0F5F2]">
        <ThemeProvider>
          <I18nProvider>
            <LayerOSProvider>
              {children}
            </LayerOSProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
