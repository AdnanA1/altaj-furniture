import Image from 'next/image';
import { useLanguage } from './LanguageContext';
import { useCart } from '@/contexts/CartContext'; // Adjusted path

// Define ProductType to include id
interface ProductType {
  id: string;
  name: { en: string; ar: string };
  desc: { en: string; ar: string };
  price: number;
  img1: string;
  img2: string;
}

const ProductList = () => {
  const { language } = useLanguage();
  const { addToCart } = useCart(); // Get addToCart from context

  const products: ProductType[] = [ // Add type annotation
    {
      id: 'sofa-set-001', // Added ID
      name: { en: 'Sofa Set', ar: 'طقم كنب' },
      desc: { en: 'Luxury modern sofa set.', ar: 'طقم كنب فاخر عصري.' },
      price: 49,
      img1: '/PHOTO-2025-04-26-01-18-24 6.jpg',
      img2: '/PHOTO-2025-04-26-01-18-24 10.jpg'
    },
    {
      id: 'classic-chair-002', // Added ID
      name: { en: 'Classic Chair', ar: 'كرسي كلاسيكي' },
      desc: { en: 'Elegant classic chair.', ar: 'كرسي أنيق كلاسيكي.' },
      price: 49,
      img1: '/PHOTO-2025-04-26-01-15-02 7.jpg',
      img2: '/PHOTO-2025-04-26-01-18-24 3.jpg'
    },
    {
      id: 'wooden-table-003', // Added ID
      name: { en: 'Wooden Table', ar: 'طاولة خشبية' },
      desc: { en: 'Solid wood table.', ar: 'طاولة من الخشب الصلب.' },
      price: 49,
      img1: '/PHOTO-2025-04-26-01-18-24 11.jpg',
      img2: '/PHOTO-2025-04-26-01-18-23 2.jpg'
    },
    {
      id: 'bed-set-004', // Added ID
      name: { en: 'Bed Set', ar: 'سرير نوم' },
      desc: { en: 'Comfortable bed set.', ar: 'طقم سرير مريح.' },
      price: 49,
      img1: '/PHOTO-2025-04-26-01-18-24.jpg',
      img2: '/PHOTO-2025-04-26-01-18-24 5.jpg'
    }
  ];

  const handleAddToCart = (product: ProductType) => {
    // Construct the product object matching the CartContext's Product interface
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      img1: product.img1,
      // img2 is not part of CartContext Product, so we don't pass it
    };
    addToCart(productToAdd, 1); // Add 1 quantity by default
    // Optionally, add some user feedback here, like a toast notification
    console.log(`${product.name[language]} added to cart`);
  };

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {products.map((product) => ( // Removed idx as key, using product.id
        <div
          key={product.id} // Use product.id as key
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
        >
          <div className="relative w-full h-80">
            <Image
              src={product.img1}
              alt=""
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
            />
            <Image src={product.img2} alt="" fill sizes="25vw" />
          </div>
          <div className="flex justify-between">
            <span className="font-medium">{product.name[language]}</span>
            <span className="font-semibold">${product.price}</span>
          </div>
          <div className="text-sm text-gray-500">{product.desc[language]}</div>
          <button
            onClick={() => handleAddToCart(product)} // Call handleAddToCart
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
