'use client';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthCallback() {
  const [message, setMessage] = useState('جارٍ التحقق... / Verifying...');
  const router = useRouter();

  useEffect(() => {
    async function handleAuth() {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        setMessage('فشل التحقق. / Verification failed.');
        return;
      }
      // Call backend to ensure customer profile exists
      const res = await fetch('/api/customers/ensure', { method: 'POST' });
      if (res.ok) {
        setMessage('تم تسجيل الدخول! / Logged in!');
        setTimeout(() => router.push('/'), 1500);
      } else {
        setMessage('حدث خطأ في إنشاء الحساب. / Error creating account.');
      }
    }
    handleAuth();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div>{message}</div>
    </div>
  );
}
