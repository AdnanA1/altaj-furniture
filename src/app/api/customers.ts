import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { email } = req.query;
    if (email && typeof email === 'string') {
      const customer = await prisma.customer.findUnique({ where: { email } });
      if (!customer) return res.status(200).json({});
      return res.status(200).json(customer);
    }
    // List all customers
    const customers = await prisma.customer.findMany();
    return res.status(200).json(customers);
  }
  if (req.method === 'POST') {
    // Create a new customer
    const { name, email, address, phone } = req.body;
    try {
      const customer = await prisma.customer.create({
        data: { name, email, address, phone }
      });
      return res.status(201).json(customer);
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return res.status(409).json({ error: 'Email is already registered.' });
      }
      return res.status(500).json({ error: 'Failed to register customer.' });
    }
  }
  if (req.method === 'PUT') {
    // Update a customer
    const { id, ...data } = req.body;
    const customer = await prisma.customer.update({ where: { id }, data });
    return res.status(200).json(customer);
  }
  if (req.method === 'DELETE') {
    // Delete a customer by id
    const { id } = req.body;
    await prisma.customer.delete({ where: { id } });
    return res.status(204).end();
  }
  res.status(405).json({ error: 'Method not allowed' });
}
