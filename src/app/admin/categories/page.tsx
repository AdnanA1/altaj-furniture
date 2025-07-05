'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  category_id?: string;
}

const PAGE_SIZE = 10;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAssign, setShowAssign] = useState<string | null>(null);
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
    fetchCategories();
    fetchProducts();
  }, []);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch {
      showToast('error', 'Failed to fetch categories');
    }
    setLoading(false);
  }

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(data);
    } catch {}
  }

  function openForm(category?: Category) {
    if (category) {
      setEditing(category);
      setForm({ name: category.name, description: category.description || '' });
    } else {
      setEditing(null);
      setForm({ name: '', description: '' });
    }
    setShowForm(true);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.name) {
      showToast('error', 'Name is required');
      return;
    }
    try {
      if (editing) {
        const res = await fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing.id, ...form })
        });
        if (!res.ok) throw new Error();
        showToast('success', 'Category updated');
      } else {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (!res.ok) throw new Error();
        showToast('success', 'Category added');
      }
      setShowForm(false);
      fetchCategories();
    } catch {
      showToast('error', 'Failed to save category');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Category deleted');
      fetchCategories();
    } catch {
      showToast('error', 'Failed to delete category');
    }
  }

  async function handleAssignProduct(categoryId: string, productId: string) {
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, category_id: categoryId })
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Product assigned');
      fetchProducts();
    } catch {
      showToast('error', 'Failed to assign product');
    }
  }

  async function handleUnassignProduct(productId: string) {
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, category_id: null })
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Product unassigned');
      fetchProducts();
    } catch {
      showToast('error', 'Failed to unassign product');
    }
  }

  // Search and pagination
  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          className="bg-altaj text-white px-4 py-2 rounded shadow hover:bg-altaj-dark"
          onClick={() => openForm()}
        >
          + Add Category
        </button>
      </div>
      <div className="flex gap-4 mb-4 items-center">
        <input
          className="border p-2 rounded w-64"
          placeholder="Search categories..."
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
      <div className="overflow-x-auto rounded shadow mt-8">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Actions</th>
              <th className="p-2 text-left">Products</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-2 font-medium">{c.name}</td>
                <td className="p-2">{c.description}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    title="Edit"
                    onClick={() => openForm(c)}
                  >
                    ✏️
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    title="Delete"
                    onClick={() => handleDelete(c.id)}
                  >
                    🗑️
                  </button>
                  <button
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    title="Assign Products"
                    onClick={() => setShowAssign(c.id)}
                  >
                    📦
                  </button>
                </td>
                <td className="p-2">
                  {products
                    .filter((p) => p.category_id === c.id)
                    .map((p) => (
                      <span
                        key={p.id}
                        className="inline-block bg-gray-200 rounded px-2 py-1 mr-1 mb-1 text-xs"
                      >
                        {p.name}
                        <button
                          className="ml-1 text-red-500 hover:underline"
                          onClick={() => handleUnassignProduct(p.id)}
                          title="Unassign"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                </td>
              </tr>
            ))}
            {!loading && paginated.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-400">
                  No categories found.
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
              {editing ? 'Edit' : 'Add'} Category
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
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-altaj text-white px-4 py-2 rounded"
              >
                {editing ? 'Update' : 'Add'} Category
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
      {/* Assign Products Modal */}
      {showAssign && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2">Assign Products</h2>
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {products
                .filter((p) => p.category_id !== showAssign)
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center border-b py-1"
                  >
                    <span>{p.name}</span>
                    <button
                      className="bg-altaj text-white px-2 py-1 rounded"
                      onClick={() => handleAssignProduct(showAssign, p.id)}
                    >
                      Assign
                    </button>
                  </div>
                ))}
              {products.filter((p) => p.category_id !== showAssign).length ===
                0 && (
                <div className="text-gray-400 text-center">
                  No unassigned products
                </div>
              )}
            </div>
            <button
              className="bg-gray-300 px-4 py-2 rounded mt-2"
              onClick={() => setShowAssign(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
