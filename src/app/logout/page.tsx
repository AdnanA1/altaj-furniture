'use client';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LogoutPage() {
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function doLogout() {
      await supabase.auth.signOut();
      setMessage('تم تسجيل الخروج. / Logged out.');
      setTimeout(() => router.push('/'), 1200);
    }
    doLogout();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div>{message || '...'} </div>
    </div>
  );
}
