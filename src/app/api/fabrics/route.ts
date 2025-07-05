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
    const fabrics = await prisma.fabric.findMany();
    return NextResponse.json(fabrics);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch fabrics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, swatchUrl, pricePerFoot } = body;
    const fabric = await prisma.fabric.create({
      data: { name, swatchUrl, pricePerFoot }
    });
    return NextResponse.json(fabric, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create fabric' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const fabric = await prisma.fabric.update({
      where: { id },
      data
    });
    return NextResponse.json(fabric);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update fabric' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    await prisma.fabric.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete fabric' },
      { status: 500 }
    );
  }
}
