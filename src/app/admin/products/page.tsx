'use client';
import { supabase } from 'lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  inventory: number;
  category_id?: string;
}

interface Category {
  id: string;
  name: string;
}

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    inventory: 0,
    category_id: ''
  });
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user || user.app_metadata?.role !== 'admin') {
        router.push('/admin/login');
      }
    });
  }, [router]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch {
      showToast('error', 'Failed to fetch products');
    }
    setLoading(false);
  }

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCategories(data);
    } catch {}
  }

  function openForm(product?: Product) {
    if (product) {
      setEditing(product);
      setForm({
        name: product.name,
        description: product.description || '',
        price: product.price,
        imageUrl: product.imageUrl || '',
        inventory: product.inventory,
        category_id: product.category_id || ''
      });
    } else {
      setEditing(null);
      setForm({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        inventory: 0,
        category_id: ''
      });
    }
    setShowForm(true);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.name || form.price <= 0) {
      showToast('error', 'Name and price are required');
      return;
    }
    try {
      if (editing) {
        const res = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing.id, ...form })
        });
        if (!res.ok) throw new Error();
        showToast('success', 'Product updated');
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (!res.ok) throw new Error();
        showToast('success', 'Product added');
      }
      setShowForm(false);
      fetchProducts();
    } catch {
      showToast('error', 'Failed to save product');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Product deleted');
      fetchProducts();
    } catch {
      showToast('error', 'Failed to delete product');
    }
  }

  // Search and pagination
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          className="bg-altaj text-white px-4 py-2 rounded shadow hover:bg-altaj-dark"
          onClick={() => openForm()}
        >
          + Add Product
        </button>
      </div>
      <div className="flex gap-4 mb-4 items-center">
        <input
          className="border p-2 rounded w-64"
          placeholder="Search products..."
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
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Inventory</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-2 font-medium">{p.name}</td>
                <td className="p-2">{p.description}</td>
                <td className="p-2">${p.price}</td>
                <td className="p-2">{p.inventory}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    title="Edit"
                    onClick={() => openForm(p)}
                  >
                    ✏️
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    title="Delete"
                    onClick={() => handleDelete(p.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {!loading && paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  No products found.
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
      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            className="bg-white p-8 rounded shadow-lg w-full max-w-md flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <h2 className="text-xl font-bold mb-2">
              {editing ? 'Edit' : 'Add'} Product
            </h2>
            <input
              className="border p-2 rounded"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <textarea
              className="border p-2 rounded"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <input
              className="border p-2 rounded"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
              required
            />
            <input
              className="border p-2 rounded"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              type="number"
              placeholder="Inventory"
              value={form.inventory}
              onChange={(e) =>
                setForm({ ...form, inventory: Number(e.target.value) })
              }
              required
            />
            <label className="text-sm font-medium" htmlFor="category-select">
              Category
            </label>
            <select
              id="category-select"
              className="border p-2 rounded"
              value={form.category_id || ''}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
            >
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-altaj text-white px-4 py-2 rounded"
              >
                {editing ? 'Update' : 'Add'} Product
              </button>
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
