import Image from 'next/image';
import React from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-500">Material: {product.material}</p>
          {product.dimensions && (
            <p className="text-sm text-gray-500">
              Dimensions: {product.dimensions}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">
            ${product.price.toLocaleString()}
          </span>
          <Button variant="outline">View Details</Button>
        </div>
      </div>
    </Card>
  );
}
