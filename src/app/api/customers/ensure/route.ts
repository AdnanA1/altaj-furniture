import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Get Supabase session from cookies
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { cookie: request.headers.get('cookie') || '' } } }
  );
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Check if customer exists
  let customer = await prisma.customer.findUnique({
    where: { email: user.email }
  });
  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        email: user.email,
        name: user.user_metadata?.name || '',
        phone: user.user_metadata?.phone || '',
        address: user.user_metadata?.address || ''
      }
    });
  }
  return NextResponse.json({ customer });
}
