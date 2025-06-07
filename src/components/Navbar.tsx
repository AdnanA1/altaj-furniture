import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import Menu from './Menu';
import NavIcons from './NavIcons';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { language, toggleLanguage } = useLanguage();
  return (
    <div className="h-20 px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 bg-transparent relative">
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo1.svg" alt="" width={80} height={80} />
          <div className="text-2xl tracking-wide text-bold">
            Altaj-مفروشات
          </div>
        </Link>
        <Menu />
        <button
          onClick={toggleLanguage}
          className="ml-2 px-2 py-1 border rounded"
        >
          {language === 'ar' ? 'EN' : 'عربي'}
        </button>
      </div>
      {/* BIGGER SCREENS */}
      <div className="hidden md:flex items-center justify-between gap-8 h-full bg-transparent">
        {/* LEFT */}
        <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo1.svg" alt="" width={80} height={80} />
            <div className="text-2xl tracking-wide text-bold">
              Altaj-مفروشات
            </div>
          </Link>
          <div className="hidden xl:flex gap-4">
            <Link href="/">Homepage</Link>
            <Link href="/">Shop</Link>
            <Link href="/">Deals</Link>
            <Link href="/">About</Link>
            <Link href="/">Contact</Link>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-2/3 xl:w-1/2 flex items-center justify-between gap-8">
          <SearchBar />
          <NavIcons />
          <button
            onClick={toggleLanguage}
            className="ml-2 px-2 py-1 border rounded"
          >
            {language === 'ar' ? 'EN' : 'عربي'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
