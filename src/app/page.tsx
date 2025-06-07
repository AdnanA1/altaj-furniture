'use client';
import CategoryList from '@/components/CategoryList';
import { useLanguage } from '@/components/LanguageContext';
import ProductList from '@/components/ProductList';
import Slider from '@/components/Slider';

const HomePage = () => {
  const { language } = useLanguage();
  return (
    <div className="">
      <Slider />
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:m-32 2xl:px-64">
        <h1 className="text-2xl">
          {language === 'ar' ? 'منتجات مميزة' : 'Featured Products'}
        </h1>
        <ProductList />
      </div>
      <div className="mt-24">
        <h1 className="text-2xl px-4 md:px-8 lg:px-16 xl:m-32 2xl:px-64 mb-12">
          {language === 'ar' ? 'الفئات' : 'Categories'}
        </h1>
        <CategoryList />
      </div>
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:m-32 2xl:px-64">
        <h1 className="text-2xl">
          {language === 'ar' ? 'منتجات جديدة' : 'New Products'}
        </h1>
        <ProductList />
      </div>
    </div>
  );
};

export default HomePage;
