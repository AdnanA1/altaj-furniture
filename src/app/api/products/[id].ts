import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Product id required' });
  }
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch product' });
  } finally {
    await prisma.$disconnect();
  }
}
