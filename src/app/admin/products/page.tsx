'use client';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  inventory: number;
  fabrics?: any[];
}

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
    inventory: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  function openForm(product?: Product) {
    if (product) {
      setEditing(product);
      setForm({
        name: product.name,
        description: product.description || '',
        price: product.price,
        imageUrl: product.imageUrl || '',
        inventory: product.inventory
      });
    } else {
      setEditing(null);
      setForm({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        inventory: 0
      });
    }
    setShowForm(true);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (editing) {
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, ...form })
      });
    } else {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    }
    setShowForm(false);
    fetchProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchProducts();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          className="bg-altaj text-white px-4 py-2 rounded"
          onClick={() => openForm()}
        >
          + Add Product
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border rounded shadow text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Description</th>
              <th className="p-2">Price</th>
              <th className="p-2">Inventory</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2 font-medium">{p.name}</td>
                <td className="p-2">{p.description}</td>
                <td className="p-2">${p.price}</td>
                <td className="p-2">{p.inventory}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => openForm(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(p.id)}
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
