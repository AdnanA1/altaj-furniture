'use client';
import Footer from '@/components/Footer';
import { LanguageProvider, useLanguage } from '@/components/LanguageContext';
import Navbar from '@/components/Navbar';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/contexts/CartContext'; // Import CartProvider

const inter = Inter({ subsets: ['latin'] });

export default function ClientLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <CartProvider> {/* Wrap LanguageWrapper (or its children) with CartProvider */}
        <LanguageWrapper>{children}</LanguageWrapper>
      </CartProvider>
    </LanguageProvider>
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
