'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }
    setUser(data.user);
    localStorage.setItem('admin_user', JSON.stringify(data.user));
    if (data.user?.user_metadata?.role === 'admin') {
      router.push('/admin');
    } else {
      setError('You do not have admin access.');
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('admin_user');
    }
    setLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('admin_user');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        className="bg-white p-8 rounded shadow-lg w-full max-w-md flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-2 text-altaj">Admin Login</h1>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {user ? (
          <>
            <div className="text-green-600 text-sm mb-2">
              Logged in as {user.email}
            </div>
            <button
              className="bg-gray-300 text-black px-4 py-2 rounded mb-4"
              type="button"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            type="button"
            onClick={async () => {
              setLoading(true);
              setError('');
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google'
              });
              if (error) setError(error.message);
              setLoading(false);
            }}
          >
            Sign in with Google
          </button>
        )}
        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
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
