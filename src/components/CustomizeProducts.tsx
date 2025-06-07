'use client';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';

interface Fabric {
  id?: string;
  name: string;
  swatchUrl?: string;
  pricePerFoot: number;
  image?: string;
}

const fallbackFabrics: Fabric[] = [
  {
    name: 'Red',
    pricePerFoot: 10,
    image: '/PHOTO-2025-04-26-01-18-24 6.jpg'
  },
  {
    name: 'Blue',
    pricePerFoot: 12,
    image: '/PHOTO-2025-04-26-01-18-24 3.jpg'
  },
  {
    name: 'Green',
    pricePerFoot: 15,
    image: '/PHOTO-2025-04-26-01-18-24 5.jpg'
  }
];

interface CustomizeProductsProps {
  initialValues?: {
    width?: string;
    length?: string;
    height?: string;
    fabric?: string;
  };
  onSave?: (data: {
    width: string;
    length: string;
    height: string;
    fabric: string;
    price: number;
    fabricObj: Fabric;
  }) => void;
  product?: any;
}

const CustomizeProducts = ({
  initialValues,
  onSave,
  product
}: CustomizeProductsProps) => {
  const { language } = useLanguage();
  const router = useRouter();
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [height, setHeight] = useState('');
  const [fabrics, setFabrics] = useState<Fabric[]>(fallbackFabrics);
  const [selectedFabric, setSelectedFabric] = useState<Fabric>(
    fallbackFabrics[0]
  );
  const [errors, setErrors] = useState<{
    width?: string;
    length?: string;
    height?: string;
  }>({});
  const [success, setSuccess] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchFabrics() {
      try {
        const res = await fetch('/api/fabrics');
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setFabrics(data);
        setSelectedFabric(data[0]);
      } catch {
        setFabrics(fallbackFabrics);
        setSelectedFabric(fallbackFabrics[0]);
      }
    }
    fetchFabrics();
  }, []);

  useEffect(() => {
    if (initialValues) {
      setWidth(initialValues.width || '');
      setLength(initialValues.length || '');
      setHeight(initialValues.height || '');
      if (initialValues.fabric) {
        const found = fabrics.find((f) => f.name === initialValues.fabric);
        if (found) setSelectedFabric(found);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues, fabrics]);

  const area = Number(width) * Number(length);
  const price = area && selectedFabric ? area * selectedFabric.pricePerFoot : 0;

  const validate = () => {
    const newErrors: { width?: string; length?: string; height?: string } = {};
    if (!width || Number(width) <= 0) {
      newErrors.width =
        language === 'ar'
          ? 'العرض يجب أن يكون أكبر من الصفر'
          : 'Width must be greater than zero';
    }
    if (!length || Number(length) <= 0) {
      newErrors.length =
        language === 'ar'
          ? 'الطول يجب أن يكون أكبر من الصفر'
          : 'Length must be greater than zero';
    }
    if (height && Number(height) < 0) {
      newErrors.height =
        language === 'ar'
          ? 'الارتفاع لا يمكن أن يكون سالباً'
          : 'Height cannot be negative';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrSave = () => {
    if (!validate()) return;
    if (onSave) {
      onSave({
        width,
        length,
        height,
        fabric: selectedFabric.name,
        price,
        fabricObj: selectedFabric
      });
    } else {
      addToCart({
        id: product?.id || 'custom',
        name:
          typeof product?.name === 'object'
            ? product?.name[language]
            : product?.name ||
              (language === 'ar'
                ? `مفروشات مخصصة (${selectedFabric.name})`
                : `Custom Furniture (${selectedFabric.name})`),
        options: { width, length, height, fabric: selectedFabric.name },
        price,
        img1:
          product?.imageUrl ||
          product?.img1 ||
          selectedFabric.swatchUrl ||
          selectedFabric.image ||
          ''
      });
      router.push('/cart');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h4 className="font-medium">
        {language === 'ar' ? 'اختر القماش' : 'Choose fabric'}
      </h4>
      <ul
        className="flex items-center gap-3"
        aria-label={language === 'ar' ? 'اختيار القماش' : 'Fabric selection'}
      >
        {fabrics.map((fabric) => (
          <li key={fabric.name} className="relative">
            <button
              type="button"
              aria-label={fabric.name}
              className={`w-12 h-12 rounded-full ring-2 focus:outline-none focus:ring-4 flex items-center justify-center overflow-hidden border-2 ${
                selectedFabric.name === fabric.name
                  ? 'ring-altaj border-altaj'
                  : 'ring-gray-300 border-transparent'
              }`}
              onClick={() => setSelectedFabric(fabric)}
              role="button"
            >
              <img
                src={fabric.swatchUrl || fabric.image || ''}
                alt={fabric.name}
                className="object-cover w-full h-full rounded-full"
              />
            </button>
            {selectedFabric.name === fabric.name && (
              <span className="absolute -top-2 -right-2 bg-altaj text-white text-xs rounded-full px-2 py-0.5">
                {language === 'ar' ? 'محدد' : 'Selected'}
              </span>
            )}
          </li>
        ))}
      </ul>
      <h4 className="font-medium">
        {language === 'ar' ? 'أدخل الأبعاد (قدم)' : 'Enter dimensions (feet)'}
      </h4>
      <div className="flex gap-2">
        <div className="flex flex-col">
          <input
            type="number"
            min="1"
            placeholder={language === 'ar' ? 'العرض' : 'Width'}
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className={`ring-1 ring-altaj rounded-md py-1 px-2 w-20 ${
              errors.width ? 'border-red-500' : ''
            }`}
            aria-label={language === 'ar' ? 'العرض' : 'Width'}
          />
          {errors.width && (
            <span className="text-xs text-red-500">{errors.width}</span>
          )}
        </div>
        <div className="flex flex-col">
          <input
            type="number"
            min="1"
            placeholder={language === 'ar' ? 'الطول' : 'Length'}
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className={`ring-1 ring-altaj rounded-md py-1 px-2 w-20 ${
              errors.length ? 'border-red-500' : ''
            }`}
            aria-label={language === 'ar' ? 'الطول' : 'Length'}
          />
          {errors.length && (
            <span className="text-xs text-red-500">{errors.length}</span>
          )}
        </div>
        <div className="flex flex-col">
          <input
            type="number"
            min="0"
            placeholder={
              language === 'ar' ? 'الارتفاع (اختياري)' : 'Height (optional)'
            }
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={`ring-1 ring-altaj rounded-md py-1 px-2 w-28 ${
              errors.height ? 'border-red-500' : ''
            }`}
            aria-label={language === 'ar' ? 'الارتفاع' : 'Height'}
          />
          {errors.height && (
            <span className="text-xs text-red-500">{errors.height}</span>
          )}
        </div>
      </div>
      <div className="text-sm text-gray-600">
        {language === 'ar' ? 'السعر لكل قدم:' : 'Price per foot:'}{' '}
        <span className="font-bold">${selectedFabric.pricePerFoot}</span>
      </div>
      <div className="text-lg font-semibold">
        {language === 'ar' ? 'الإجمالي:' : 'Total:'} ${price || 0}
      </div>
      {success && (
        <div className="text-green-600 text-sm">
          {language === 'ar' ? 'تمت الإضافة إلى السلة!' : 'Added to cart!'}
        </div>
      )}
      <button
        className="rounded-2xl ring-1 ring-altaj text-altaj w-max py-2 px-4 text-xs hover:bg-altaj hover:text-white"
        onClick={handleAddOrSave}
        disabled={
          !width ||
          !length ||
          !!errors.width ||
          !!errors.length ||
          !!errors.height
        }
      >
        {onSave
          ? language === 'ar'
            ? 'حفظ التعديلات'
            : 'Save Changes'
          : language === 'ar'
          ? 'أضف إلى السلة'
          : 'Add to Cart'}
      </button>
    </div>
  );
};

export default CustomizeProducts;
