'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface Fabric {
  id: string;
  name: string;
  swatchUrl?: string;
  pricePerFoot: number;
}

const PAGE_SIZE = 10;

export default function AdminFabricsPage() {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Fabric | null>(null);
  const [form, setForm] = useState({
    name: '',
    swatchUrl: '',
    pricePerFoot: 0
  });
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
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
    fetchFabrics();
  }, []);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchFabrics() {
    setLoading(true);
    try {
      const res = await fetch('/api/fabrics');
      if (!res.ok) throw new Error('Failed to fetch fabrics');
      const data = await res.json();
      setFabrics(data);
    } catch {
      showToast('error', 'Failed to fetch fabrics');
    }
    setLoading(false);
  }

  function openForm(fabric?: Fabric) {
    if (fabric) {
      setEditing(fabric);
      setForm({
        name: fabric.name,
        swatchUrl: fabric.swatchUrl || '',
        pricePerFoot: fabric.pricePerFoot
      });
    } else {
      setEditing(null);
      setForm({ name: '', swatchUrl: '', pricePerFoot: 0 });
    }
    setShowForm(true);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.name || form.pricePerFoot <= 0) {
      showToast('error', 'Name and price per foot are required');
      return;
    }
    try {
      if (editing) {
        const res = await fetch('/api/fabrics', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing.id, ...form })
        });
        if (!res.ok) throw new Error();
        showToast('success', 'Fabric updated');
      } else {
        const res = await fetch('/api/fabrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (!res.ok) throw new Error();
        showToast('success', 'Fabric added');
      }
      setShowForm(false);
      fetchFabrics();
    } catch {
      showToast('error', 'Failed to save fabric');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this fabric?')) return;
    try {
      const res = await fetch('/api/fabrics', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Fabric deleted');
      fetchFabrics();
    } catch {
      showToast('error', 'Failed to delete fabric');
    }
  }

  // Search and pagination
  const filtered = fabrics.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Fabrics</h1>
        <button
          className="bg-altaj text-white px-4 py-2 rounded shadow hover:bg-altaj-dark"
          onClick={() => openForm()}
        >
          + Add Fabric
        </button>
      </div>
      <div className="flex gap-4 mb-4 items-center">
        <input
          className="border p-2 rounded w-64"
          placeholder="Search fabrics..."
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
              <th className="p-2 text-left">Swatch</th>
              <th className="p-2 text-left">Price/Foot</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((f) => (
              <tr key={f.id} className="border-t hover:bg-gray-50">
                <td className="p-2 font-medium">{f.name}</td>
                <td className="p-2">
                  {f.swatchUrl ? (
                    <img
                      src={f.swatchUrl}
                      alt="swatch"
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No swatch</span>
                  )}
                </td>
                <td className="p-2">${f.pricePerFoot}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    title="Edit"
                    onClick={() => openForm(f)}
                  >
                    ✏️
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    title="Delete"
                    onClick={() => handleDelete(f.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {!loading && paginated.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
                  No fabrics found.
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
              {editing ? 'Edit' : 'Add'} Fabric
            </h2>
            <input
              className="border p-2 rounded"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="border p-2 rounded"
              placeholder="Swatch URL"
              value={form.swatchUrl}
              onChange={(e) => setForm({ ...form, swatchUrl: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              type="number"
              placeholder="Price Per Foot"
              value={form.pricePerFoot}
              onChange={(e) =>
                setForm({ ...form, pricePerFoot: Number(e.target.value) })
              }
              required
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-altaj text-white px-4 py-2 rounded"
              >
                {editing ? 'Update' : 'Add'} Fabric
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
