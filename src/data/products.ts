export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: 'living-room' | 'dining-room' | 'bedroom'|'restaurant-furniture'| 'office';
  features: string[];
  dimensions?: string;
  material: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Traditional Arabic Sofa Set',
    price: 2999.99,
    image: '/products/sofa-set.jpg',
    description:
      'Luxurious 3-piece sofa set featuring traditional Arabic design with intricate woodwork and premium upholstery.',
    category: 'living-room',
    features: [
      'Hand-carved wooden frame',
      'Premium fabric upholstery',
      'Includes 3 pieces: 2-seater sofa and 2 armchairs',
      'Traditional Arabic patterns'
    ],
    dimensions: 'Sofa: 84"W x 36"D x 42"H, Chairs: 32"W x 36"D x 42"H',
    material: 'Solid wood frame with premium fabric upholstery'
  },
  {
    id: 2,
    name: 'Wooden Coffee Table',
    price: 499.99,
    image: '/products/coffee-table.jpg',
    description:
      'Handcrafted wooden coffee table with traditional Arabic patterns and elegant design.',
    category: 'living-room',
    features: [
      'Hand-carved patterns',
      'Solid wood construction',
      'Sturdy and durable',
      'Traditional Arabic motifs'
    ],
    dimensions: '48"W x 28"D x 18"H',
    material: 'Solid mahogany wood'
  },
  {
    id: 3,
    name: 'Dining Set',
    price: 1999.99,
    image: '/products/dining-set.jpg',
    description:
      'Elegant 6-piece dining set with comfortable chairs and traditional Arabic design elements.',
    category: 'dining-room',
    features: [
      'Seats 6 people',
      'Matching chairs included',
      'Hand-carved details',
      'Sturdy construction'
    ],
    dimensions: 'Table: 72"W x 40"D x 30"H, Chairs: 20"W x 22"D x 42"H',
    material: 'Solid wood with premium upholstery'
  },
  {
    id: 4,
    name: 'Bed Frame',
    price: 1499.99,
    image: '/products/bed-frame.jpg',
    description:
      'Queen size bed frame with traditional Arabic headboard and elegant design.',
    category: 'bedroom',
    features: [
      'Queen size',
      'Ornate headboard',
      'Solid wood construction',
      'Traditional Arabic patterns'
    ],
    dimensions: '63"W x 83"D x 48"H',
    material: 'Solid wood with premium finish'
  },
  {
    id: 5,
    name: 'Office Desk',
    price: 799.99,
    image: '/products/office-desk.jpg',
    description:
      'Traditional Arabic style office desk with multiple storage compartments.',
    category: 'office',
    features: [
      'Multiple drawers',
      'Built-in storage',
      'Traditional design',
      'Ergonomic height'
    ],
    dimensions: '60"W x 30"D x 30"H',
    material: 'Solid wood with brass hardware'
  }
];

export const categories = [
  {
    id: 'living-room',
    name: 'Living Room',
    description: 'Elegant living room furniture with traditional Arabic design'
  },
  {
    id: 'dining-room',
    name: 'Dining Room',
    description: 'Beautiful dining sets and accessories for your home'
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    description: 'Comfortable and stylish bedroom furniture'
  },
  {
    id: 'office',
    name: 'Office',
    description: 'Professional office furniture with traditional touches'
  }
];
