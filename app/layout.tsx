import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OilDog Crypto Bot',
  openGraph: {
    title: 'OliDog Crypto Bot',
    type: 'website',
    // url: 'https://traintimesnyc.com',
    // siteName: 'Train Times NYC',
    description: 'IYKYK',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
