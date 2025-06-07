import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';

const Footer = () => {
  const { language } = useLanguage();
  return (
    <div className="py-12 px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 bg-gray-100 text-sm mt-8">
      {/* TOP */}
      <div className="flex flex-col md:flex-row justify-between gap-8">
        {/* LEFT */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo1.svg" alt="" width={80} height={80} />
            <div className="text-2xl tracking-wide text-bold">
              Altaj-مفروشات
            </div>
          </Link>
          <Link href="tel:+1(718)238-9696" className=" text-sm">
            (917)960-6993
          </Link>
          <p className="text-sm">info@altaj-furniture.com</p>
          <Link
            href="https://www.google.com/maps/dir/?api=1&destination=4907 Schaefer Rd,\tDearborn, Michigan, 48126"
            className="text-sm"
          >
            4907 Schaefer Rd, Dearborn,MI 48126
          </Link>
          <div className="flex gap-6">
            <Link href="https://www.facebook.com">
              <Image
                src="/facebook.svg"
                alt="facebook"
                width={30}
                height={30}
                objectFit="contain"
              />
            </Link>
            <Link href="https://www.instagram.com">
              <Image
                src="/instagram.svg"
                alt="instagram"
                width={30}
                height={30}
                objectFit="contain"
              />
            </Link>
            <Link href="https://www.youtube.com">
              <Image
                src="/youtube.svg"
                alt="youtube"
                width={30}
                height={30}
                objectFit="contain"
              />
            </Link>
            <Link href="https://www.x.com">
              <Image
                src="/x.png"
                alt="x"
                width={30}
                height={30}
                objectFit="contain"
              />
            </Link>
            <Link href="https://www.pinterest.com">
              <Image
                src="/pinterest.png"
                alt="facebook"
                width={30}
                height={30}
                objectFit="contain"
              />
            </Link>
          </div>
        </div>
        {/* CENTER */}
        <div className="hidden lg:flex justify-between w-1/2">
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">
              {language === 'ar' ? 'الشركة' : 'COMPANY'}
            </h1>
            <div className="flex flex-col gap-6">
              <Link href="">
                {language === 'ar' ? 'معلومات عنا' : 'About Us'}
              </Link>
              <Link href="">{language === 'ar' ? 'وظائف' : 'Careers'}</Link>
              <Link href="">{language === 'ar' ? 'شركاء' : 'Affiliates'}</Link>
              <Link href="">{language === 'ar' ? 'مدونة' : 'Blog'}</Link>
              <Link href="">
                {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">
              {language === 'ar' ? 'تسوق' : 'SHOP'}
            </h1>
            <div className="flex flex-col gap-6">
              <Link href="">
                {language === 'ar' ? 'وصل حديثاً' : 'New Arrivals'}
              </Link>
              <Link href="">
                {language === 'ar' ? 'إكسسوارات' : 'Accessories'}
              </Link>
              <Link href="">
                {language === 'ar' ? 'أثاث منزلي' : 'Residential Furniture'}
              </Link>
              <Link href="">
                {language === 'ar' ? 'أثاث تجاري' : 'Commercial Furniture'}
              </Link>
              <Link href="">
                {language === 'ar' ? 'كل المنتجات' : 'All Products'}
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">
              {language === 'ar' ? 'المساعدة' : 'HELP'}
            </h1>
            <div className="flex flex-col gap-6">
              <Link href="">
                {language === 'ar' ? 'خدمة العملاء' : 'Customer Service'}
              </Link>
              <Link href="">{language === 'ar' ? 'حسابي' : 'My Account'}</Link>
              <Link href="">
                {language === 'ar' ? 'اعثر على متجر' : 'Find a Store'}
              </Link>
              <Link href="">
                {language === 'ar' ? 'قانوني وخصوصية' : 'Legal & Privacy'}
              </Link>
              <Link href="">
                {language === 'ar' ? 'بطاقة هدية' : 'Gift Card'}
              </Link>
            </div>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-4">
          <h1 className="font-medium text-lg">
            {language === 'ar' ? 'اشترك' : 'SUBSCRIBE'}
          </h1>
          <p>
            {language === 'ar'
              ? 'كن أول من يحصل على آخر الأخبار حول العروض والاتجاهات والمزيد!'
              : 'Be the first to get the latest news about trends, promotions, and much more!'}
          </p>
          <div className="flex">
            <input
              type="text"
              placeholder={
                language === 'ar' ? 'البريد الإلكتروني' : 'Email address'
              }
              className="p-4 w-3/4"
            />
            <button className="w-1/4 bg-altaj text-white">
              {language === 'ar' ? 'اشترك' : 'JOIN'}
            </button>
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
        <div className="">© 2025 Altaj-Furniture</div>
      </div>
    </div>
  );
};

export default Footer;
