'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

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
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [showDelete, setShowDelete] = useState<string | null>(null);
  const PAGE_SIZE = 10;
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user || user.app_metadata?.role !== 'admin') {
        router.push('/admin/login');
      }
    });
    fetchOrders();
    fetchProducts();
    fetchFabrics();
  }, [router]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setOrders(data);
    } catch {
      setToast({ message: 'Failed to fetch orders.', type: 'error' });
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

  function openDetails(order: Order) {
    setSelected(order);
    setStatus(order.status);
  }

  async function handleStatusUpdate() {
    if (!selected) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected.id, status })
      });
      if (!res.ok) throw new Error('Failed');
      setToast({ message: 'Order status updated.', type: 'success' });
    } catch {
      setToast({ message: 'Failed to update status.', type: 'error' });
    }
    setSelected(null);
    fetchOrders();
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch('/api/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error('Failed');
      setToast({ message: 'Order deleted.', type: 'success' });
    } catch {
      setToast({ message: 'Failed to delete order.', type: 'error' });
    }
    setShowDelete(null);
    fetchOrders();
  }

  function getProductInfo(productId: string) {
    return products.find((p) => p.id === productId);
  }
  function getFabricInfo(fabricId: string) {
    return fabrics.find((f) => f.id === fabricId);
  }

  // Search and pagination
  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer?.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (o.customer?.email?.toLowerCase() || '').includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>
      <div className="flex gap-4 mb-4 items-center">
        <input
          className="border p-2 rounded w-64"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Loading...
          </div>
        )}
      </div>
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow text-white ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}
      <div className="overflow-x-auto rounded shadow">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((o) => (
              <tr key={o.id} className="border-t hover:bg-gray-50">
                <td className="p-2 font-mono">{o.id.slice(0, 8)}...</td>
                <td className="p-2">{o.customer?.name || '-'}</td>
                <td className="p-2">${o.total}</td>
                <td className="p-2 capitalize">{o.status}</td>
                <td className="p-2">
                  {new Date(o.createdAt).toLocaleString()}
                </td>
                <td className="p-2 flex gap-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    title="Details"
                    onClick={() => openDetails(o)}
                  >
                    📄
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    title="Delete"
                    onClick={() => setShowDelete(o.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {!loading && paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`px-3 py-1 rounded ${
                n === page ? 'bg-altaj text-white' : 'bg-gray-200'
              }`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
        </div>
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
      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-sm flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2">Delete Order?</h2>
            <div>
              Are you sure you want to delete this order? This action cannot be
              undone.
            </div>
            <div className="flex gap-4 justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => handleDelete(showDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
