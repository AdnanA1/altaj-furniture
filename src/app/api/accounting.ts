import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Admin check
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { cookie: request.headers.get('cookie') || '' } } }
  );
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Forbidden: Admins only' }), {
      status: 403
    });
  }

  try {
    const totalSales = await prisma.order.aggregate({ _sum: { total: true } });
    const totalOrders = await prisma.order.count();
    const totalCustomers = await prisma.customer.count();
    const salesByProduct = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { price: true, quantity: true },
      _count: { _all: true }
    });
    return NextResponse.json({
      totalSales: totalSales._sum.total || 0,
      totalOrders,
      totalCustomers,
      salesByProduct
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch accounting data' },
      { status: 500 }
    );
  }
}
