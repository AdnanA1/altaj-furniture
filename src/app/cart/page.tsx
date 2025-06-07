'use client';
import { useLanguage } from '@/components/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { language } = useLanguage();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">
          {language === 'ar' ? 'السلة فارغة' : 'Your cart is empty'}
        </h1>
        <Link href="/categories" className="text-altaj underline">
          {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
      </h1>
      <ul className="divide-y">
        {cartItems.map((item) => (
          <li key={item.cartItemId} className="flex gap-4 py-4 items-center">
            <Image
              src={item.img1 || '/PHOTO-2025-04-26-01-14-50 4.jpg'}
              alt={
                typeof item.name === 'object' ? item.name[language] : item.name
              }
              width={72}
              height={96}
              className="object-cover rounded-md"
            />
            <div className="flex-1">
              <div className="font-semibold">
                {typeof item.name === 'object'
                  ? item.name[language]
                  : item.name}
              </div>
              {item.options && (
                <div className="text-xs text-gray-500 mt-1">
                  {item.options.fabric && (
                    <div>
                      {language === 'ar' ? 'القماش:' : 'Fabric:'}{' '}
                      {item.options.fabric}
                    </div>
                  )}
                  {item.options.width && item.options.length && (
                    <div>
                      {language === 'ar' ? 'الأبعاد:' : 'Dimensions:'}{' '}
                      {item.options.width} x {item.options.length}
                      {item.options.height
                        ? ` x ${item.options.height}`
                        : ''}{' '}
                      ft
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span>{language === 'ar' ? 'الكمية' : 'Qty.'}</span>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.cartItemId, Number(e.target.value))
                  }
                  className="w-12 px-1 py-0.5 border rounded text-center"
                  aria-label={language === 'ar' ? 'الكمية' : 'Qty.'}
                />
                <button
                  className="text-red-500 hover:underline ml-2"
                  onClick={() => removeFromCart(item.cartItemId)}
                >
                  {language === 'ar' ? 'إزالة' : 'Remove'}
                </button>
              </div>
            </div>
            <div className="font-bold text-altaj">${item.price}</div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center mt-8 text-lg font-semibold">
        <span>{language === 'ar' ? 'المجموع' : 'Total'}:</span>
        <span>${getCartTotal()}</span>
      </div>
      <Link
        href="/checkout"
        className="block mt-8 bg-altaj text-white text-center py-3 rounded-lg font-bold hover:bg-opacity-90"
      >
        {language === 'ar' ? 'الدفع' : 'Proceed to Checkout'}
      </Link>
    </div>
  );
}
