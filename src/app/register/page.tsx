'use client';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Send magic link/OTP
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { name, phone, address }, // Store extra fields in user_metadata
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    setLoading(false);
    if (error) setMessage('حدث خطأ أثناء إرسال الرابط. / Error sending link.');
    else setMessage('تحقق من بريدك الإلكتروني! / Check your email!');
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 max-w-sm mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="البريد الإلكتروني / Email"
        required
        className="input input-bordered w-full"
        dir="ltr"
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="الاسم / Name"
        className="input input-bordered w-full"
        dir="auto"
      />
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="رقم الهاتف / Phone"
        className="input input-bordered w-full"
        dir="ltr"
      />
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="العنوان / Address"
        className="input input-bordered w-full"
        dir="auto"
      />
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? '...' : 'إنشاء حساب / Create Account'}
      </button>
      <div className="text-center text-sm">{message}</div>
    </form>
  );
}
