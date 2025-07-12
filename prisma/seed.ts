const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Categories
  await prisma.category.createMany({
    data: [
      { name: 'Sofas', description: 'Comfortable sofas' },
      { name: 'Chairs', description: 'Stylish chairs' },
      { name: 'Tables', description: 'Modern tables' }
    ],
    skipDuplicates: true
  });

  // Fabrics
  await prisma.fabric.createMany({
    data: [
      { name: 'Cotton', swatchUrl: '/swatches/cotton.jpg', pricePerFoot: 10 },
      { name: 'Linen', swatchUrl: '/swatches/linen.jpg', pricePerFoot: 15 },
      { name: 'Velvet', swatchUrl: '/swatches/velvet.jpg', pricePerFoot: 20 }
    ],
    skipDuplicates: true
  });

  // Products
  const categories = await prisma.category.findMany();
  await prisma.product.createMany({
    data: [
      {
        name: 'Modern Sofa',
        description: 'A stylish modern sofa.',
        price: 499,
        imageUrl: '/products/sofa.jpg',
        inventory: 10,
        categoryId: categories[0]?.id
      },
      {
        name: 'Classic Armchair',
        description: 'A comfortable classic armchair.',
        price: 299,
        imageUrl: '/products/armchair.jpg',
        inventory: 15,
        categoryId: categories[1]?.id
      }
    ],
    skipDuplicates: true
  });

  // Customers
  await prisma.customer.createMany({
    data: [
      {
        name: 'John Doe',
        email: 'customer@example.com',
        address: '123 Main St',
        phone: '555-1234'
      }
    ],
    skipDuplicates: true
  });

  // Admin User
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
