'use client';

import Image from 'next/image';
import { useState } from 'react';

const images = [
  {
    id: 1,
    img: '/PHOTO-2025-04-26-01-25-01 3.jpg'
  },
  {
    id: 2,
    img: '/PHOTO-2025-04-26-01-21-46.jpg'
  },
  {
    id: 3,
    img: '/PHOTO-2025-04-26-01-21-42.jpg'
  },
  {
    id: 4,
    img: '/PHOTO-2025-04-26-01-18-18 5.jpg'
  }
];

const ProductImages = () => {
  const [index, setIndex] = useState(0);

  return (
    <div className="">
      <div className="h-[500px] relative">
        <Image
          src={images[index].img}
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
            key={img.id}
            onClick={() => setIndex(i)}
          >
            <Image
              src={img.img}
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
