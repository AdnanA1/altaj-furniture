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
    const products = await prisma.product.findMany({
      include: { fabrics: true, category: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      imageUrl,
      inventory,
      categoryId,
      fabricIds
    } = body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        inventory,
        categoryId,
        fabrics: fabricIds
          ? { connect: fabricIds.map((id: string) => ({ id })) }
          : undefined
      },
      include: { fabrics: true, category: true }
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const product = await prisma.product.update({
      where: { id },
      data,
      include: { fabrics: true, category: true }
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    await prisma.product.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
