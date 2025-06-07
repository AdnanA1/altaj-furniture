import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';

const CategoryList = () => {
  const { language } = useLanguage();
  const categories = [
    {
      name: { en: 'Living Room', ar: 'غرفة المعيشة' },
      img: '/PHOTO-2025-04-26-01-18-18 5.jpg'
    },
    {
      name: { en: 'Bedroom', ar: 'غرفة النوم' },
      img: '/PHOTO-2025-04-26-01-18-18 4.jpg'
    },
    {
      name: { en: 'Dining', ar: 'غرفة الطعام' },
      img: '/PHOTO-2025-04-26-01-18-18 3.jpg'
    },
    {
      name: { en: 'Curtains & Drapes', ar: ' و بردايات ستاير ' },
      img: '/PHOTO-2025-04-26-01-18-18 2.jpg'
    },
    {
      name: { en: 'Kids', ar: 'غرفة الأطفال' },
      img: '/PHOTO-2025-04-26-01-18-17 5.jpg'
    },
    {
      name: { en: 'Outdoor', ar: 'خارجي' },
      img: '/PHOTO-2025-04-26-01-18-17 4.jpg'
    }
  ];
  return (
    <div className="px-4 overflow-x-scroll scrollbar-hide">
      <div className="flex gap-4 md:gap-8">
        {categories.map((cat, idx) => (
          <Link
            href={`/categories/${cat.name.en
              .toLowerCase()
              .replace(/\s+/g, '-')}`}
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
            key={idx}
          >
            <div className="relative bg-slate-100 w-full h-96">
              <Image
                src={cat.img}
                alt=""
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
            <h1 className="mt-8 font-light text-xl tracking-wide">
              {cat.name[language]}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
