import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Total sales
    const totalSales = await prisma.order.aggregate({ _sum: { total: true } });
    // Total orders
    const totalOrders = await prisma.order.count();
    // Total customers
    const totalCustomers = await prisma.customer.count();
    // Sales by product
    const salesByProduct = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { price: true, quantity: true },
      _count: { _all: true }
    });
    res.status(200).json({
      totalSales: totalSales._sum.total || 0,
      totalOrders,
      totalCustomers,
      salesByProduct
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch accounting data' });
  } finally {
    await prisma.$disconnect();
  }
}
