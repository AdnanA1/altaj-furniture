'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define the shape of a product and a cart item
interface ProductOptions {
  width?: string;
  length?: string;
  height?: string;
  fabric?: string;
  [key: string]: any;
}

interface Product {
  id: string;
  name: { en: string; ar: string } | string;
  price: number;
  img1: string;
  options?: ProductOptions;
}

interface CartItem extends Product {
  quantity: number;
  cartItemId: string; // Unique per cart entry
}

// Define the shape of the cart context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  editCartItem: (cartItemId: string) => void;
}

// Create the context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Define the props for the CartProvider
interface CartProviderProps {
  children: ReactNode;
}

// Create the CartProvider component
export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const addToCart = (product: Product, quantity: number = 1) => {
    // For custom products, always add as a new item (unique cartItemId)
    const cartItemId = uuidv4();
    setCartItems((prevItems) => [
      ...prevItems,
      { ...product, quantity, cartItemId }
    ]);
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartItemId !== cartItemId)
    );
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const editCartItem = (cartItemId: string) => {
    setEditingItemId(cartItemId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        editCartItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
