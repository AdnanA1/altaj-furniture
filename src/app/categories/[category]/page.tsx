'use client';
import { useLanguage } from '@/components/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const demoProducts = [
  {
    id: 'sofa-set-001',
    name: { en: 'Sofa Set', ar: 'طقم كنب' },
    description: 'Luxury modern sofa set.',
    price: 49,
    img: '/PHOTO-2025-04-26-01-18-24 6.jpg',
    category: 'living-room'
  },
  {
    id: 'classic-chair-002',
    name: { en: 'Classic Chair', ar: 'كرسي كلاسيكي' },
    description: 'Elegant classic chair.',
    price: 49,
    img: '/PHOTO-2025-04-26-01-15-02 7.jpg',
    category: 'living-room'
  },
  {
    id: 'bed-001',
    name: { en: 'Bed', ar: 'سرير' },
    description: 'Comfortable bed.',
    price: 99,
    img: '/PHOTO-2025-04-26-01-18-18 4.jpg',
    category: 'bedroom'
  },
  {
    id: 'dining-table-001',
    name: { en: 'Dining Table', ar: 'طاولة طعام' },
    description: 'Spacious dining table.',
    price: 120,
    img: '/PHOTO-2025-04-26-01-18-18 3.jpg',
    category: 'dining'
  }
];

export default function CategoryPage() {
  const { category } = useParams();
  const { language } = useLanguage();
  // category param is slug (e.g. 'living-room')
  const products = demoProducts.filter((p) => p.category === category);

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 mt-12">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {category?.toString().replace(/-/g, ' ')}
      </h1>
      {products.length === 0 ? (
        <div className="text-gray-500">No products found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link
              href={`/${product.id}`}
              key={product.id}
              className="block rounded-lg shadow hover:shadow-lg transition overflow-hidden bg-white"
            >
              <div className="relative w-full h-56">
                <Image
                  src={product.img}
                  alt={product.name.en}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-center text-lg font-medium">
                {product.name[language]}
              </div>
              <div className="p-2 text-center text-gray-500 text-sm">
                {product.description}
              </div>
              <div className="p-2 text-center font-bold text-altaj">
                ${product.price}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
