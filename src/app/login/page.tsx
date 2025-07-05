'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
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
    setError('');
    setLoading(true);
    if (!email) {
      setError('Email required');
      setLoading(false);
      return;
    }
    try {
      if (mode === 'login') {
        const { data, error: loginError } =
          await supabase.auth.signInWithPassword({ email, password });
        if (loginError) {
          setError(loginError.message);
          setLoading(false);
          return;
        }
        setUser(data.user);
        localStorage.setItem('customer', JSON.stringify(data.user));
        localStorage.setItem('last_checkout_email', email);
        const isAdmin = data.user?.user_metadata?.role === 'admin';
        router.push(isAdmin ? '/admin' : '/');
        return;
      } else {
        if (!name) {
          setError('Name required');
          setLoading(false);
          return;
        }
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } } // Do not allow user to set role here
        });
        // NOTE: Admin roles must be set by a privileged user or via the Supabase dashboard, not by the user.
        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
        setUser(data.user);
        localStorage.setItem('customer', JSON.stringify(data.user));
        localStorage.setItem('last_checkout_email', email);
        const isAdmin = data.user?.user_metadata?.role === 'admin';
        router.push(isAdmin ? '/admin' : '/');
        return;
      }
    } catch {
      setError('Login/registration failed');
    }
    setLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('customer');
    localStorage.removeItem('last_checkout_email');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2 text-altaj">
          {mode === 'login' ? 'Customer Login' : 'Register'}
        </h1>
        {/* Supabase Auth Section */}
        {user ? (
          <>
            <div className="text-green-600 text-sm mb-2">
              Logged in as {user.email}
            </div>
            <button
              className="bg-gray-300 text-black px-4 py-2 rounded mb-4"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
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
