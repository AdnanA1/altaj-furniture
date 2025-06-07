'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ProductImagesProps {
  productId: string;
}

const fallbackImages = [
  '/PHOTO-2025-04-26-01-25-01 3.jpg',
  '/PHOTO-2025-04-26-01-21-46.jpg',
  '/PHOTO-2025-04-26-01-21-42.jpg',
  '/PHOTO-2025-04-26-01-18-18 5.jpg'
];

const ProductImages = ({ productId }: ProductImagesProps) => {
  const [images, setImages] = useState<string[]>(fallbackImages);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error('Not found');
        const product = await res.json();
        if (product.imageUrl) {
          setImages([product.imageUrl]);
        }
      } catch {
        setImages(fallbackImages);
      }
    }
    if (productId) fetchProduct();
  }, [productId]);

  return (
    <div className="">
      <div className="h-[500px] relative">
        <Image
          src={images[index]}
          alt=""
          fill
          sizes="50vw"
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex justify-between gap-4 mt-8">
        {images.map((img, i) => (
          <div
            className="w-1/4 h-32 relative gap-4 mt-8 cursor-pointer"
            key={img}
            onClick={() => setIndex(i)}
          >
            <Image
              src={img}
              alt=""
              fill
              sizes="30vw"
              className="object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
