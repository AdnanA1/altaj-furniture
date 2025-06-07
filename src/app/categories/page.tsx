'use client';
import { useLanguage } from '@/components/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    name: { en: 'Living Room', ar: 'غرفة المعيشة' },
    img: '/PHOTO-2025-04-26-01-18-18 5.jpg'
  },
  {
    name: { en: 'Bedroom', ar: 'غرفة النوم' },
    img: '/PHOTO-2025-04-26-01-18-18 4.jpg'
  },
  {
    name: { en: 'Dining', ar: 'غرفة الطعام' },
    img: '/PHOTO-2025-04-26-01-18-18 3.jpg'
  },
  {
    name: { en: 'Curtains & Drapes', ar: ' و بردايات ستاير ' },
    img: '/PHOTO-2025-04-26-01-18-18 2.jpg'
  },
  {
    name: { en: 'Kids', ar: 'غرفة الأطفال' },
    img: '/PHOTO-2025-04-26-01-18-17 5.jpg'
  },
  {
    name: { en: 'Outdoor', ar: 'خارجي' },
    img: '/PHOTO-2025-04-26-01-18-17 4.jpg'
  }
];

export default function CategoriesPage() {
  const { language } = useLanguage();
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 mt-12">
      <h1 className="text-3xl font-bold mb-8">
        {language === 'ar' ? 'الفئات' : 'Categories'}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.map((cat, idx) => (
          <Link
            href={`/categories/${cat.name.en
              .toLowerCase()
              .replace(/\s+/g, '-')}`}
            key={idx}
            className="block rounded-lg shadow hover:shadow-lg transition overflow-hidden bg-white"
          >
            <div className="relative w-full h-56">
              <Image
                src={cat.img}
                alt={cat.name.en}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 text-center text-lg font-medium">
              {cat.name[language]}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
