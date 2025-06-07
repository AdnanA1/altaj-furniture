import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // List all admin users (exclude password)
    const users = await prisma.adminUser.findMany({
      select: { id: true, email: true, name: true, createdAt: true }
    });
    return res.status(200).json(users);
  }
  if (req.method === 'POST') {
    // Create a new admin user
    const { email, password, name } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.adminUser.create({
      data: { email, password: passwordHash, name },
      select: { id: true, email: true, name: true, createdAt: true }
    });
    return res.status(201).json(user);
  }
  if (req.method === 'PUT') {
    // Update an admin user
    const { id, password, ...data } = req.body;
    let updateData = { ...data };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const user = await prisma.adminUser.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, name: true, createdAt: true }
    });
    return res.status(200).json(user);
  }
  if (req.method === 'DELETE') {
    // Delete an admin user by id
    const { id } = req.body;
    await prisma.adminUser.delete({ where: { id } });
    return res.status(204).end();
  }
  res.status(405).json({ error: 'Method not allowed' });
}
