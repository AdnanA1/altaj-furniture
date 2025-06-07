'use client';
import CustomizeProducts from '@/components/CustomizeProducts';
import { useLanguage } from '@/components/LanguageContext';
import ProductImages from '@/components/ProductImages';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const demoProducts = [
  {
    id: 'sofa-set-001',
    name: { en: 'Sofa Set', ar: 'طقم كنب' },
    description: 'Luxury modern sofa set.',
    price: 49,
    imageUrl: '/PHOTO-2025-04-26-01-18-24 6.jpg',
    img1: '/PHOTO-2025-04-26-01-18-24 6.jpg',
    category: 'living-room'
  },
  {
    id: 'classic-chair-002',
    name: { en: 'Classic Chair', ar: 'كرسي كلاسيكي' },
    description: 'Elegant classic chair.',
    price: 49,
    imageUrl: '/PHOTO-2025-04-26-01-15-02 7.jpg',
    img1: '/PHOTO-2025-04-26-01-15-02 7.jpg',
    category: 'living-room'
  },
  {
    id: 'bed-001',
    name: { en: 'Bed', ar: 'سرير' },
    description: 'Comfortable bed.',
    price: 99,
    imageUrl: '/PHOTO-2025-04-26-01-18-18 4.jpg',
    img1: '/PHOTO-2025-04-26-01-18-18 4.jpg',
    category: 'bedroom'
  },
  {
    id: 'dining-table-001',
    name: { en: 'Dining Table', ar: 'طاولة طعام' },
    description: 'Spacious dining table.',
    price: 120,
    imageUrl: '/PHOTO-2025-04-26-01-18-18 3.jpg',
    img1: '/PHOTO-2025-04-26-01-18-18 3.jpg',
    category: 'dining'
  }
];

const SinglePage = () => {
  const params = useParams();
  const { language } = useLanguage();
  const productId =
    typeof params?.slug === 'string'
      ? params.slug
      : Array.isArray(params?.slug)
      ? params.slug[0]
      : '';
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setProduct(data);
      } catch {
        // fallback to demo data
        const demo = demoProducts.find((p) => p.id === productId);
        setProduct(demo || null);
      }
      setLoading(false);
    }
    if (productId) fetchProduct();
  }, [productId]);

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      {/* IMG */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages productId={productId} />
      </div>
      {/* TEXTS */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">
          {loading
            ? 'Loading...'
            : product?.name
            ? typeof product.name === 'object'
              ? product.name[language]
              : product.name
            : 'Product Name'}
        </h1>
        <p className="text-gray-500">
          {loading ? '' : product?.description || 'No description.'}
        </p>
        <div className="h-[2px] bg-gray-100" />
        <div className="flex items-center gap-4">
          {/* Optionally show old price if available */}
          {/* <h3 className="text-xl texy-gray-500 line-through">$59</h3> */}
          <h2 className="font-medium text-2xl">
            {loading ? '' : `$${product?.price ?? '49'}`}
          </h2>
        </div>
        <div className="h-[2px] bg-gray-100" />
        <CustomizeProducts product={product} />
        <div className="h-[2px] bg-gray-100" />
        {/* Optionally more product details here */}
      </div>
    </div>
  );
};

export default SinglePage;
