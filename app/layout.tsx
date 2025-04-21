import type { Metadata } from "next";
import config from "@/config";
import "./globals.css";
import { GoogleTagManager } from '@next/third-parties/google'
import { OpenPanelComponent } from '@openpanel/nextjs';
import { SessionProvider } from "next-auth/react"
import { Toaster } from 'react-hot-toast';
import FooterWrapper from "@/components/ui/FooterWrapper";
import { GuestProvider } from "@/components/GuestContext";
import FeedbackButton from "@/components/feedback/FeedbackButton";

export const metadata: Metadata = {
  ...config.metadata,
  icons: {
    icon: '/brand/icons/favicon.ico',
    shortcut: '/brand/icons/favicon-16x16.png',
    apple: '/brand/icons/apple-touch-icon.png',
  },
  manifest: '/brand/icons/site.webmanifest',
  themeColor: '#3A7CA5',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/brand/brand-colors.css" />
        <link rel="apple-touch-icon" sizes="180x180" href="/brand/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/brand/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/brand/icons/favicon-16x16.png" />
        <link rel="manifest" href="/brand/icons/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#3A7CA5" />
        <meta name="theme-color" content="#3A7CA5" />
      </head>
      <SessionProvider>
        <GuestProvider>
          <body
            className="antialiased min-h-screen flex flex-col"
          >
            <Toaster position="top-center" />
            <main className="flex-grow">
              {children}
            </main>
            <FooterWrapper />
            <FeedbackButton />
          </body>
        </GuestProvider>
      </SessionProvider>
      {/* Google Tag Manager */}
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
      )}
      
      {/* OpenPanel Analytics */}
      {process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID && (
        <OpenPanelComponent
          clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID}
          trackScreenViews={true}
          // trackAttributes={true}
          // trackOutgoingLinks={true}
          // If you have a user id, you can pass it here to identify the user
          // profileId={'123'}
        />
      )}
    </html>
  );
}
