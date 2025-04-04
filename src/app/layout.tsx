import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '../components/header';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Altaj Furniture - Luxury Arabic Furniture',
  description:
    'Discover our collection of handcrafted Arabic furniture that brings elegance and comfort to your home.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
