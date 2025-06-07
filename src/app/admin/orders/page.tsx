'use client';
import { useEffect, useState } from 'react';

interface OrderItem {
  id: string;
  productId?: string;
  fabricId?: string;
  width?: number;
  length?: number;
  height?: number;
  price: number;
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Order {
  id: string;
  customer?: Customer;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const statusOptions = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [status, setStatus] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [fabrics, setFabrics] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchFabrics();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data);
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

  function openDetails(order: Order) {
    setSelected(order);
    setStatus(order.status);
  }

  async function handleStatusUpdate() {
    if (!selected) return;
    await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, status })
    });
    setSelected(null);
    fetchOrders();
  }

  function getProductInfo(productId: string) {
    return products.find((p) => p.id === productId);
  }
  function getFabricInfo(fabricId: string) {
    return fabrics.find((f) => f.id === fabricId);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Orders</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border rounded shadow text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Order ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-2 font-mono">{o.id.slice(0, 8)}...</td>
                <td className="p-2">{o.customer?.name || '-'}</td>
                <td className="p-2">${o.total}</td>
                <td className="p-2 capitalize">{o.status}</td>
                <td className="p-2">
                  {new Date(o.createdAt).toLocaleString()}
                </td>
                <td className="p-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => openDetails(o)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-lg flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2">Order Details</h2>
            <div>
              <strong>Order ID:</strong> {selected.id}
            </div>
            <div>
              <strong>Customer:</strong> {selected.customer?.name} (
              {selected.customer?.email})
            </div>
            <div>
              <strong>Total:</strong> ${selected.total}
            </div>
            <div>
              <strong>Status:</strong>
              <select
                className="ml-2 border p-1 rounded"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Order Status"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <button
                className="ml-2 px-2 py-1 bg-altaj text-white rounded"
                onClick={handleStatusUpdate}
              >
                Update
              </button>
            </div>
            <div>
              <strong>Date:</strong>{' '}
              {new Date(selected.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>Items:</strong>
              <ul className="mt-2 space-y-2">
                {selected.items.map((item) => {
                  const product = item.productId
                    ? getProductInfo(item.productId)
                    : null;
                  const fabric = item.fabricId
                    ? getFabricInfo(item.fabricId)
                    : null;
                  return (
                    <li
                      key={item.id}
                      className="border p-2 rounded flex items-center gap-2"
                    >
                      {product && product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div>
                        Product:{' '}
                        {product ? product.name : item.productId || '-'}
                      </div>
                      <div>
                        Fabric: {fabric ? fabric.name : item.fabricId || '-'}
                      </div>
                      <div>
                        Dimensions: {item.width || '-'} x {item.length || '-'}
                        {item.height ? ` x ${item.height}` : ''} ft
                      </div>
                      <div>Price: ${item.price}</div>
                      <div>Quantity: {item.quantity}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <button
              className="mt-4 bg-gray-300 px-4 py-2 rounded"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
