'use client';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Products', href: '/admin/products' },
  { name: 'Fabrics', href: '/admin/fabrics' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Customers', href: '/admin/customers' },
  { name: 'Accounting', href: '/admin/accounting' }
];

const JWT_SECRET = 'supersecretkey123'; // Should match API

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/admin/login') return;
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('admin_token')
        : null;
    if (!token) {
      router.push('/admin/login');
      return;
    }
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      localStorage.removeItem('admin_token');
      router.push('/admin/login');
    }
  }, [pathname, router]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col p-4 gap-4">
        <div className="text-2xl font-bold mb-8 text-altaj">Admin</div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded hover:bg-altaj hover:text-white transition-colors font-medium"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-8">
          <div className="text-lg font-semibold">Altaj Admin Dashboard</div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Admin</span>
            <img
              src="/logo1.svg"
              alt="Logo"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
