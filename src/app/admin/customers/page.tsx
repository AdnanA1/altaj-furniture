'use client';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    const res = await fetch('/api/customers');
    const data = await res.json();
    setCustomers(data);
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
      await fetch('/api/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, ...form })
      });
      setShowForm(false);
      fetchCustomers();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this customer?')) return;
    await fetch('/api/customers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchCustomers();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Customers</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border rounded shadow text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Address</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-2 font-medium">{c.name}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.address}</td>
                <td className="p-2">{c.phone}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => openForm(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
}
