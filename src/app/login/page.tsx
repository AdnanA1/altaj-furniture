'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!email) {
      setError('Email required');
      setLoading(false);
      return;
    }
    try {
      if (mode === 'login') {
        // Try to find customer
        const res = await fetch(
          `/api/customers?email=${encodeURIComponent(email)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.id) {
            localStorage.setItem('customer', JSON.stringify(data));
            localStorage.setItem('last_checkout_email', email);
            router.push('/');
            return;
          } else {
            setMode('register');
            setError('No account found. Please register.');
            setLoading(false);
            return;
          }
        }
      } else {
        // Register new customer
        if (!name) {
          setError('Name required');
          setLoading(false);
          return;
        }
        const res = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email })
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('customer', JSON.stringify(data));
          localStorage.setItem('last_checkout_email', email);
          router.push('/');
          return;
        } else {
          const data = await res.json();
          if (
            res.status === 409 &&
            data.error === 'Email is already registered.'
          ) {
            setMode('login');
            setError('Email is already registered. Please log in.');
          } else {
            setError(data.error || 'Registration failed');
          }
        }
      }
    } catch {
      setError('Login/registration failed');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2 text-altaj">
          {mode === 'login' ? 'Customer Login' : 'Register'}
        </h1>
        {/* Google Auth Section */}
        {status === 'loading' ? (
          <div>Loading session...</div>
        ) : session ? (
          <>
            <div className="text-green-600 text-sm mb-2">
              Logged in as {session.user?.email}
            </div>
            <button
              className="bg-gray-300 text-black px-4 py-2 rounded mb-4"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            onClick={() => signIn('google')}
          >
            Sign in with Google
          </button>
        )}
        {/* Divider */}
        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        {/* Email Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <input
            className="border p-2 rounded"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {mode === 'register' && (
            <input
              className="border p-2 rounded"
              placeholder="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <button
            type="submit"
            className="bg-altaj text-white px-4 py-2 rounded mt-2"
            disabled={loading}
          >
            {loading
              ? mode === 'login'
                ? 'Logging in...'
                : 'Registering...'
              : mode === 'login'
              ? 'Login'
              : 'Register'}
          </button>
        </form>
        <div className="text-sm mt-2">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="text-blue-500 underline"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                className="text-blue-500 underline"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
