'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';

const Slides = [
  {
    id: 1,
    title: { en: 'Summer Sale Collections', ar: 'تخفيضات الصيف' },
    description: { en: 'Sale! Up to 50% off', ar: 'تخفيضات حتى 50%' },
    img: '/PHOTO-2025-04-26-01-14-51.jpg',
    url: '/categories',
    bg: 'bg-gradient-to-r from-yellow-50 to-pink-50'
  },
  {
    id: 2,
    title: { en: 'Modern Furniture', ar: 'أثاث عصري' },
    description: { en: 'Discover our new arrivals', ar: 'اكتشف أحدث المنتجات' },
    img: '/PHOTO-2025-04-26-01-14-50 4.jpg',
    url: '/categories',
    bg: 'bg-gradient-to-r from-pink-50 to-blue-50'
  },
  {
    id: 3,
    title: { en: 'Classic Designs', ar: 'تصاميم كلاسيكية' },
    description: {
      en: 'Timeless elegance for your home',
      ar: 'أناقة خالدة لمنزلك'
    },
    img: '/PHOTO-2025-04-26-01-18-24 9.jpg',
    url: '/categories',
    bg: 'bg-gradient-to-r from-blue-50 to-yellow-50'
  }
];
const Slider = () => {
  const { language } = useLanguage();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const intervale = setInterval(() => {
      setCurrent((prev) => (prev === Slides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(intervale);
  }, []);

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden">
      <div
        className="w-max h-full flex transition-all ease-in-out duration-1000"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {Slides.map((slide) => (
          <div
            className={`${slide.bg} w-screen h-full flex flex-col gap-16 xl:flex-row`}
            key={slide.id}
          >
            {/* TEXT CONTAINER */}
            <div className="h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-8 2xl:gap-12 text-center">
              <h2 className="text-xl lg:text-3xl 2xl:text-5xl">
                {slide.description[language]}
              </h2>
              <h1 className="text-5xl lg:text-6xl 2xl:text-8xl font-semibold">
                {slide.title[language]}
              </h1>
              <Link href={slide.url}>
                <button className="rounded-md bg-black text-white py-3 px-4 ">
                  {language === 'ar' ? 'تسوق الان' : 'SHOP NOW'}
                </button>
              </Link>
            </div>
            {/* IMAGE CONTAINER */}
            <div className="h-1/2 xl:w-1/2 xl:h-full relative">
              <Image
                src={slide.img}
                alt=""
                fill
                sizes="100%"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute m-auto left-1/2 bottom-8 flex gap-4">
        {Slides.map((slide, index) => (
          <div
            className={`w-3 h-3  rounded-full ring-1 ring-gray-600 cursor-pointer flex items-center justify-center ${
              current === index ? 'scale-150' : ''
            }`}
            key={slide.id}
            onClick={() => setCurrent(index)}
          >
            {current === index && (
              <div className="w-[6px] h-[6px] bg-gray-600 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
