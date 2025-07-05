'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const navItems = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Products', href: '/admin/products' },
  { name: 'Fabrics', href: '/admin/fabrics' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Customers', href: '/admin/customers' },
  { name: 'Accounting', href: '/admin/accounting' },
  { name: 'Categories', href: '/admin/categories' }
];

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user || user.app_metadata?.role !== 'admin') {
        router.push('/admin/login');
      } else {
        setUser(user);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const user = session?.user;
        if (!user || user.app_metadata?.role !== 'admin') {
          router.push('/admin/login');
        } else {
          setUser(user);
        }
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [pathname, router]);

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`p-2 rounded hover:bg-gray-200 ${
                pathname === item.href ? 'bg-gray-200 font-bold' : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
