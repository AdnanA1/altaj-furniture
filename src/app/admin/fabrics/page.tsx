'use client';
import { useEffect, useState } from 'react';

interface Fabric {
  id: string;
  name: string;
  swatchUrl?: string;
  pricePerFoot: number;
}

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

  useEffect(() => {
    fetchFabrics();
  }, []);

  async function fetchFabrics() {
    setLoading(true);
    const res = await fetch('/api/fabrics');
    const data = await res.json();
    setFabrics(data);
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
    if (editing) {
      await fetch('/api/fabrics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, ...form })
      });
    } else {
      await fetch('/api/fabrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    }
    setShowForm(false);
    fetchFabrics();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this fabric?')) return;
    await fetch('/api/fabrics', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchFabrics();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Fabrics</h1>
        <button
          className="bg-altaj text-white px-4 py-2 rounded"
          onClick={() => openForm()}
        >
          + Add Fabric
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border rounded shadow text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Swatch</th>
              <th className="p-2">Price/ft</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fabrics.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="p-2 font-medium">{f.name}</td>
                <td className="p-2">
                  {f.swatchUrl ? (
                    <img
                      src={f.swatchUrl}
                      alt={f.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No swatch</span>
                  )}
                </td>
                <td className="p-2">${f.pricePerFoot}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => openForm(f)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(f.id)}
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
              placeholder="Price per foot"
              value={form.pricePerFoot}
              onChange={(e) =>
                setForm({ ...form, pricePerFoot: Number(e.target.value) })
              }
              required
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
