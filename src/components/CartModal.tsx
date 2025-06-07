'use client';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import { useState } from 'react';
import { useLanguage } from './LanguageContext';

const CartModal = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    editCartItem
  } = useCart();
  const { language } = useLanguage();
  const [open, setOpen] = useState(true);

  const emptyCartText = language === 'ar' ? 'السلة فارغة' : 'Cart is Empty';
  const shoppingCartText = language === 'ar' ? 'سلة التسوق' : 'Shopping Cart';
  const availableText = language === 'ar' ? 'متوفر' : 'Available';
  const quantityText = language === 'ar' ? 'الكمية' : 'Qty.';
  const removeText = language === 'ar' ? 'إزالة' : 'Remove';
  const editText = language === 'ar' ? 'تعديل' : 'Edit';
  const subtotalText = language === 'ar' ? 'المجموع الفرعي' : 'Subtotal';
  const shippingText =
    language === 'ar'
      ? 'الشحن والضرائب تحسب عند الدفع.'
      : 'Shipping and taxes calculated at checkout.';
  const viewCartText = language === 'ar' ? 'عرض السلة' : 'View Cart';
  const checkoutText = language === 'ar' ? 'الدفع' : 'Checkout';

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={() => setOpen(false)}
      />
      <div className="fixed top-16 right-4 z-50 w-[350px] max-w-full p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white flex flex-col min-h-[200px] max-h-[80vh]">
        <button
          className="absolute top-2 right-2 text-xl text-gray-500 hover:text-black"
          onClick={() => setOpen(false)}
          aria-label="Close cart"
        >
          ×
        </button>
        {cartItems.length === 0 ? (
          <div className="text-center py-8">{emptyCartText}</div>
        ) : (
          <>
            <h2 className="text-xl mb-4">{shoppingCartText}</h2>
            {/* LIST  */}
            <div className="flex flex-col gap-8 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  className="flex gap-4 border-b pb-4 relative"
                  key={item.cartItemId}
                >
                  <Image
                    src={item.img1 || '/PHOTO-2025-04-26-01-14-50 4.jpg'}
                    alt={
                      typeof item.name === 'object'
                        ? item.name[language]
                        : item.name
                    }
                    width={72}
                    height={96}
                    className="object-cover rounded-md"
                  />
                  <div className="flex flex-col justify-between w-full">
                    {/* TOP */}
                    <div>
                      {/* TITLE */}
                      <div className="flex items-center justify-between gap-8">
                        <h3 className="font-semibold">
                          {typeof item.name === 'object'
                            ? item.name[language]
                            : item.name}
                        </h3>
                        <div className="p-1 bg-gray-50 rounded-sm">
                          ${item.price}
                        </div>
                      </div>
                      {/* OPTIONS */}
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
                      {/* DESC */}
                      <div className="text-sm text-gray-500">
                        {availableText}
                      </div>
                    </div>
                    {/* BOTTOM */}
                    <div className="flex justify-between items-center text-sm mt-2 gap-2">
                      {item.options ? (
                        <>
                          <button
                            className="text-blue-500 hover:underline"
                            onClick={() => editCartItem(item.cartItemId)}
                          >
                            {editText}
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{quantityText}</span>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.cartItemId,
                                Number(e.target.value)
                              )
                            }
                            className="w-12 px-1 py-0.5 border rounded text-center"
                            aria-label={quantityText}
                          />
                        </div>
                      )}
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => removeFromCart(item.cartItemId)}
                      >
                        {removeText}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* BOTTOM */}
            <div className="mt-4">
              <div className="flex items-center justify-between font-semibold">
                <span>{subtotalText}</span>
                <span>${getCartTotal()}</span>
              </div>
              <p className="text-gray-500 text-sm mt-2 mb-4">{shippingText}</p>
              <div className="flex justify-between text-sm gap-2">
                <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">
                  {viewCartText}
                </button>
                <button className="rounded-md py-3 px-4 bg-black text-white">
                  {checkoutText}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartModal;
