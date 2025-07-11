import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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
    return NextResponse.json(
      { error: 'Forbidden: Admins only' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (email) {
      const customer = await prisma.customer.findUnique({ where: { email } });
      if (!customer) return NextResponse.json([]);
      const orders = await prisma.order.findMany({
        where: { customerId: customer.id },
        include: { items: true, customer: true },
        orderBy: { createdAt: 'asc' }
      });
      return NextResponse.json(orders);
    }
    const orders = await prisma.order.findMany({
      include: { items: true, customer: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, items, total, status } = body;
    const order = await prisma.order.create({
      data: {
        customerId,
        total,
        status,
        items: { create: items }
      },
      include: { items: true, customer: true }
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const order = await prisma.order.update({
      where: { id },
      data,
      include: { items: true, customer: true }
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    await prisma.order.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
