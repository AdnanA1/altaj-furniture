'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('admin_token', data.token);
      router.push('/admin');
    } else {
      setError(data.error || 'Login failed');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        className="bg-white p-8 rounded shadow-lg w-full max-w-md flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-2 text-altaj">Admin Login</h1>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <input
          className="border p-2 rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-altaj text-white px-4 py-2 rounded mt-2"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
