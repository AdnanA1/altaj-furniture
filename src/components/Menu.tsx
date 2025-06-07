'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Menu = () => {
  const [open, setOpen] = useState(false);
  const { cartItems } = useCart();
  const router = useRouter();

  const handleNav = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div className="">
      <Image
        src="/menu.png"
        alt=""
        width={28}
        height={28}
        className="cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="fixed bg-black text-white left-0 top-0 w-full h-full flex flex-col items-center justify-center gap-8 text-xl z-50">
          <button
            className="absolute top-6 right-8 text-3xl"
            onClick={() => setOpen(false)}
          >
            &times;
          </button>
          <button onClick={() => handleNav('/')}>Homepage</button>
          <button onClick={() => handleNav('/categories')}>Shop</button>
          <button onClick={() => handleNav('/deals')}>Deals</button>
          <button onClick={() => handleNav('/about')}>About</button>
          <button onClick={() => handleNav('/contact')}>Contact</button>
          <button onClick={() => handleNav('/cart')} className="relative">
            Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-4 w-6 h-6 bg-altaj rounded-full text-white text-sm flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
          <button onClick={() => handleNav('/login')}>Login</button>
        </div>
      )}
    </div>
  );
};

export default Menu;
