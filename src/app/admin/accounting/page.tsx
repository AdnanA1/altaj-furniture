'use client';
import { supabase } from 'lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SalesByProduct {
  productId: string;
  _sum: { price: number | null; quantity: number | null };
  _count: { _all: number };
}

interface AccountingData {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  salesByProduct: SalesByProduct[];
}

export default function AdminAccountingPage() {
  const [data, setData] = useState<AccountingData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user || user.app_metadata?.role !== 'admin') {
        router.push('/admin/login');
      }
    });
  }, [router]);

  useEffect(() => {
    fetchAccounting();
  }, []);

  async function fetchAccounting() {
    setLoading(true);
    const res = await fetch('/api/accounting');
    const d = await res.json();
    setData(d);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Accounting Dashboard</h1>
      {loading || !data ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded shadow p-6 flex flex-col items-center">
              <div className="text-gray-500">Total Sales</div>
              <div className="text-2xl font-bold">
                ${data.totalSales.toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded shadow p-6 flex flex-col items-center">
              <div className="text-gray-500">Total Orders</div>
              <div className="text-2xl font-bold">{data.totalOrders}</div>
            </div>
            <div className="bg-white rounded shadow p-6 flex flex-col items-center">
              <div className="text-gray-500">Total Customers</div>
              <div className="text-2xl font-bold">{data.totalCustomers}</div>
            </div>
          </div>
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-bold mb-4">Sales by Product</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Product ID</th>
                  <th className="p-2">Total Sales</th>
                  <th className="p-2">Total Quantity</th>
                  <th className="p-2">Order Count</th>
                </tr>
              </thead>
              <tbody>
                {data.salesByProduct.map((p) => (
                  <tr key={p.productId} className="border-t">
                    <td className="p-2 font-mono">
                      {p.productId?.slice(0, 8) || '-'}...
                    </td>
                    <td className="p-2">
                      ${p._sum.price?.toLocaleString() || 0}
                    </td>
                    <td className="p-2">{p._sum.quantity || 0}</td>
                    <td className="p-2">{p._count._all}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
