import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';

// Define ProductType to include id
interface ProductType {
  id: string;
  name: string | { en: string; ar: string };
  description?: string;
  price: number;
  imageUrl?: string;
  img1?: string;
  img2?: string;
}

const ProductList = () => {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      // Map API fields to UI fields
      setProducts(
        data.map((p: any) => ({
          id: p.id,
          name:
            typeof p.name === 'object' ? p.name : { en: p.name, ar: p.name },
          description: p.description,
          price: p.price,
          imageUrl: p.imageUrl,
          img1: p.imageUrl || '/PHOTO-2025-04-26-01-18-24 6.jpg',
          img2: p.imageUrl || '/PHOTO-2025-04-26-01-18-24 10.jpg'
        }))
      );
    } catch {
      // fallback to static data if fetch fails
      setProducts([
        {
          id: 'sofa-set-001',
          name: { en: 'Sofa Set', ar: 'طقم كنب' },
          description: 'Luxury modern sofa set.',
          price: 49,
          img1: '/PHOTO-2025-04-26-01-18-24 6.jpg',
          img2: '/PHOTO-2025-04-26-01-18-24 10.jpg'
        },
        {
          id: 'classic-chair-002',
          name: { en: 'Classic Chair', ar: 'كرسي كلاسيكي' },
          description: 'Elegant classic chair.',
          price: 49,
          img1: '/PHOTO-2025-04-26-01-15-02 7.jpg',
          img2: '/PHOTO-2025-04-26-01-18-24 3.jpg'
        }
      ]);
    }
    setLoading(false);
  }

  const handleAddToCart = (product: ProductType) => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      img1: product.img1 || product.imageUrl || ''
    };
    addToCart(productToAdd, 1);
    // Optionally, add some user feedback here, like a toast notification
    console.log(
      `${
        typeof product.name === 'object' ? product.name[language] : product.name
      } added to cart`
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {products.map((product) => (
        <div
          key={product.id}
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
        >
          <div className="relative w-full h-80">
            <Image
              src={product.img1 || product.imageUrl || ''}
              alt=""
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
            />
            <Image
              src={product.img2 || product.imageUrl || ''}
              alt=""
              fill
              sizes="25vw"
            />
          </div>
          <div className="flex justify-between">
            <span className="font-medium">
              {typeof product.name === 'object'
                ? product.name[language]
                : product.name}
            </span>
            <span className="font-semibold">${product.price}</span>
          </div>
          <div className="text-sm text-gray-500">{product.description}</div>
          <button
            onClick={() => handleAddToCart(product)}
            className="rounded-2xl ring-1 ring-altaj text-altaj w-max py-2 px-4 text-xs hover:bg-altaj hover:text-white"
          >
            {language === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
