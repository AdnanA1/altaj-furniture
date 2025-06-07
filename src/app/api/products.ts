import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // List all products
    const products = await prisma.product.findMany({
      include: { fabrics: true }
    });
    return res.status(200).json(products);
  }
  if (req.method === 'POST') {
    // Create a new product
    const { name, description, price, imageUrl, inventory } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, imageUrl, inventory }
    });
    return res.status(201).json(product);
  }
  if (req.method === 'PUT') {
    // Update a product
    const { id, ...data } = req.body;
    const product = await prisma.product.update({ where: { id }, data });
    return res.status(200).json(product);
  }
  if (req.method === 'DELETE') {
    // Delete a product by id
    const { id } = req.body;
    await prisma.product.delete({ where: { id } });
    return res.status(204).end();
  }
  res.status(405).json({ error: 'Method not allowed' });
}
