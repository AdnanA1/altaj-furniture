'use client';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone || !form.email) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      // Create or find customer
      const customerRes = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          address: form.address,
          phone: form.phone
        })
      });
      const customer = await customerRes.json();
      // Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          items: cartItems.map((item) => ({
            productId: item.id !== 'custom' ? item.id : undefined,
            fabricId: undefined, // Optionally map fabric name to id
            width: item.options?.width ? Number(item.options.width) : undefined,
            length: item.options?.length
              ? Number(item.options.length)
              : undefined,
            height: item.options?.height
              ? Number(item.options.height)
              : undefined,
            price: item.price,
            quantity: item.quantity
          })),
          total: getCartTotal(),
          status: 'pending'
        })
      });
      if (!orderRes.ok) throw new Error('Order failed');
      clearCart();
      router.push('/order-confirmation');
    } catch (err) {
      setError('Order failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          className="border p-2 rounded"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          className="bg-altaj text-white px-4 py-2 rounded mt-2"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <ul className="mb-4">
          {cartItems.map((item) => (
            <li key={item.cartItemId} className="mb-2">
              <span className="font-medium">
                {typeof item.name === 'object' ? item.name.en : item.name}
              </span>{' '}
              x{item.quantity} - ${item.price}
              {item.options && (
                <div className="text-xs text-gray-500">
                  {item.options.fabric && (
                    <span>Fabric: {item.options.fabric} </span>
                  )}
                  {item.options.width && item.options.length && (
                    <span>
                      Dimensions: {item.options.width} x {item.options.length}
                      {item.options.height
                        ? ` x ${item.options.height}`
                        : ''}{' '}
                      ft
                    </span>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="font-bold">Total: ${getCartTotal()}</div>
      </div>
    </div>
  );
};

export default CheckoutPage;
