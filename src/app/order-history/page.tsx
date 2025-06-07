'use client';
import { useEffect, useState } from 'react';

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [fabrics, setFabrics] = useState<any[]>([]);

  useEffect(() => {
    // Try to get email from localStorage (from last checkout)
    const lastEmail = localStorage.getItem('last_checkout_email') || '';
    setEmail(lastEmail);
    if (lastEmail) fetchOrders(lastEmail);
    fetchProducts();
    fetchFabrics();
  }, []);

  async function fetchOrders(email: string) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setOrders(data);
    } catch {
      setError('Failed to fetch orders.');
      setOrders([]);
    }
    setLoading(false);
  }

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setProducts(data);
    } catch {}
  }

  async function fetchFabrics() {
    try {
      const res = await fetch('/api/fabrics');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setFabrics(data);
    } catch {}
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      localStorage.setItem('last_checkout_email', email);
      fetchOrders(email);
    }
  };

  function getProductInfo(productId: string) {
    return products.find((p) => p.id === productId);
  }
  function getFabricInfo(fabricId: string) {
    return fabrics.find((f) => f.id === fabricId);
  }

  if (!email)
    return (
      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
          <label htmlFor="email">Enter your email to view order history:</label>
          <input
            id="email"
            type="email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            className="bg-altaj text-white px-4 py-2 rounded"
            type="submit"
          >
            View Orders
          </button>
        </form>
      </div>
    );

  if (loading) return <div className="max-w-2xl mx-auto p-4">Loading...</div>;
  if (error)
    return <div className="max-w-2xl mx-auto p-4 text-red-500">{error}</div>;
  if (orders.length === 0)
    return <div className="max-w-2xl mx-auto p-4">No orders found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {orders.map((order, idx) => (
        <div key={order.id || idx} className="border rounded p-4 mb-6">
          <div className="mb-2 font-semibold">
            Order placed on: {new Date(order.createdAt).toLocaleString()}
          </div>
          <div className="mb-1">Name: {order.customer?.name}</div>
          <div className="mb-1">Address: {order.customer?.address}</div>
          <div className="mb-1">Phone: {order.customer?.phone}</div>
          <div className="mb-1">Email: {order.customer?.email}</div>
          <h2 className="text-lg font-semibold mt-2 mb-1">Items</h2>
          <ul>
            {order.items.map((item: any) => {
              const product = item.productId
                ? getProductInfo(item.productId)
                : null;
              const fabric = item.fabricId
                ? getFabricInfo(item.fabricId)
                : null;
              return (
                <li key={item.id} className="mb-1 flex items-center gap-2">
                  {product && product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <span className="font-medium">
                    {product ? product.name : item.productId || 'Custom'}
                  </span>{' '}
                  x{item.quantity} - ${item.price}
                  {fabric && <span> | Fabric: {fabric.name}</span>}
                  {item.width && item.length && (
                    <span>
                      {' '}
                      | Dimensions: {item.width} x {item.length}
                      {item.height ? ` x ${item.height}` : ''} ft
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="font-bold mt-2">Total: ${order.total}</div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
