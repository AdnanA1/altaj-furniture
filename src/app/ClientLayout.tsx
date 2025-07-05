'use client';
import Footer from '@/components/Footer';
import { LanguageProvider, useLanguage } from '@/components/LanguageContext';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/contexts/CartContext'; // Import CartProvider
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function ClientLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <CartProvider>
          <LanguageWrapper>{children}</LanguageWrapper>
        </CartProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}

function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  return (
    <div
      lang={language === 'ar' ? 'ar' : 'en'}
      dir={language === 'ar' ? 'ar' : 'en'}
    >
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
