import Image from 'next/image';
import { Button } from '../components/ui/button';

const products = [
  {
    id: 1,
    name: 'Traditional Sofa Set',
    price: '$2,999',
    image: '/images/living-room/arabic-sofa-set.jpg',
    category: 'Living Room'
  },
  {
    id: 2,
    name: 'Dining Table Set',
    price: '$1,999',
    image: '/images/dining-room/dining-set.jpg',
    category: 'Dining Room'
  },
  {
    id: 3,
    name: 'Queen Bed Frame',
    price: '$1,499',
    image: '/images/bedroom/bed-frame.jpg',
    category: 'Bedroom'
  },
  {
    id: 4,
    name: 'Office Desk',
    price: '$899',
    image: '/images/office/desk.jpg',
    category: 'Office'
  }
];

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <div key={product.id} className="group relative">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-primary font-semibold mt-2">{product.price}</p>
          </div>
          <Button className="w-full mt-4">View Details</Button>
        </div>
      ))}
    </div>
  );
}
