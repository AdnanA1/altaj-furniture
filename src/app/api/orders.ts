import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // If email is provided, return orders for that customer
    const { email } = req.query;
    if (email && typeof email === 'string') {
      const customer = await prisma.customer.findUnique({ where: { email } });
      if (!customer) return res.status(200).json([]);
      const orders = await prisma.order.findMany({
        where: { customerId: customer.id },
        include: { items: true, customer: true },
        orderBy: { createdAt: 'asc' }
      });
      return res.status(200).json(orders);
    }
    // List all orders with items (admin)
    const orders = await prisma.order.findMany({
      include: { items: true, customer: true }
    });
    return res.status(200).json(orders);
  }
  if (req.method === 'POST') {
    // Create a new order with items
    const { customerId, items, total, status } = req.body;
    const order = await prisma.order.create({
      data: {
        customerId,
        total,
        status,
        items: {
          create: items
        }
      },
      include: { items: true, customer: true }
    });
    return res.status(201).json(order);
  }
  if (req.method === 'PUT') {
    // Update an order
    const { id, ...data } = req.body;
    const order = await prisma.order.update({ where: { id }, data });
    return res.status(200).json(order);
  }
  if (req.method === 'DELETE') {
    // Delete an order by id
    const { id } = req.body;
    await prisma.order.delete({ where: { id } });
    return res.status(204).end();
  }
  res.status(405).json({ error: 'Method not allowed' });
}
