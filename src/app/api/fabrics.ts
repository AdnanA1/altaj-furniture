import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // List all fabrics
    const fabrics = await prisma.fabric.findMany();
    return res.status(200).json(fabrics);
  }
  if (req.method === 'POST') {
    // Create a new fabric
    const { name, swatchUrl, pricePerFoot } = req.body;
    const fabric = await prisma.fabric.create({
      data: { name, swatchUrl, pricePerFoot }
    });
    return res.status(201).json(fabric);
  }
  if (req.method === 'PUT') {
    // Update a fabric
    const { id, ...data } = req.body;
    const fabric = await prisma.fabric.update({ where: { id }, data });
    return res.status(200).json(fabric);
  }
  if (req.method === 'DELETE') {
    // Delete a fabric by id
    const { id } = req.body;
    await prisma.fabric.delete({ where: { id } });
    return res.status(204).end();
  }
  res.status(405).json({ error: 'Method not allowed' });
}
