import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
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
    // Seed Fabrics
    const fabrics = await prisma.fabric.createMany({
      data: [
        { name: 'Cotton', swatchUrl: '/swatches/cotton.jpg', pricePerFoot: 10 },
        { name: 'Linen', swatchUrl: '/swatches/linen.jpg', pricePerFoot: 15 },
        { name: 'Velvet', swatchUrl: '/swatches/velvet.jpg', pricePerFoot: 20 }
      ],
      skipDuplicates: true
    });

    // Seed Products
    const products = await prisma.product.createMany({
      data: [
        {
          name: 'Modern Sofa',
          description: 'A stylish modern sofa.',
          price: 499,
          imageUrl: '/products/sofa.jpg',
          inventory: 10
        },
        {
          name: 'Classic Armchair',
          description: 'A comfortable classic armchair.',
          price: 299,
          imageUrl: '/products/armchair.jpg',
          inventory: 15
        },
        {
          name: 'Dining Table',
          description: 'A large dining table for family gatherings.',
          price: 799,
          imageUrl: '/products/dining-table.jpg',
          inventory: 5
        }
      ],
      skipDuplicates: true
    });

    // Seed Customer
    await prisma.customer.upsert({
      where: { email: 'customer@example.com' },
      update: {},
      create: {
        name: 'John Doe',
        email: 'customer@example.com',
        address: '123 Main St',
        phone: '555-1234'
      }
    });

    // Seed Admin User
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.adminUser.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: passwordHash,
        name: 'Admin'
      }
    });

    res.status(200).json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to seed database' });
  } finally {
    await prisma.$disconnect();
  }
}
