'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface Customer {
  id: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });
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
  }, [router]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    try {
      const res = await fetch('/api/customers');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setCustomers(data);
    } catch {
      setToast({ message: 'Failed to fetch customers.', type: 'error' });
      setCustomers([]);
    }
    setLoading(false);
  }

  function openForm(customer: Customer) {
    setEditing(customer);
    setForm({
      name: customer.name,
      email: customer.email,
      address: customer.address || '',
      phone: customer.phone || ''
    });
    setShowForm(true);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (editing) {
      try {
        const res = await fetch('/api/customers', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing.id, ...form })
        });
        if (!res.ok) throw new Error('Failed');
        setToast({ message: 'Customer updated.', type: 'success' });
      } catch {
        setToast({ message: 'Failed to update customer.', type: 'error' });
      }
      setShowForm(false);
      fetchCustomers();
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch('/api/customers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error('Failed');
      setToast({ message: 'Customer deleted.', type: 'success' });
    } catch {
      setToast({ message: 'Failed to delete customer.', type: 'error' });
    }
    setShowDelete(null);
    fetchCustomers();
  }

  // Search and pagination
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.address || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.phone || '').toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Customers</h1>
      </div>
      <div className="flex gap-4 mb-4 items-center">
        <input
          className="border p-2 rounded w-64"
          placeholder="Search customers..."
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
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-2 font-medium">{c.name}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.address}</td>
                <td className="p-2">{c.phone}</td>
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
                    onClick={() => setShowDelete(c.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {!loading && paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  No customers found.
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
            <h2 className="text-xl font-bold mb-2">Edit Customer</h2>
            <input
              className="border p-2 rounded"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="border p-2 rounded"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              type="email"
            />
            <input
              className="border p-2 rounded"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="bg-altaj text-white px-4 py-2 rounded flex-1"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded flex-1"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-sm flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2">Delete Customer?</h2>
            <div>
              Are you sure you want to delete this customer? This action cannot
              be undone.
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
