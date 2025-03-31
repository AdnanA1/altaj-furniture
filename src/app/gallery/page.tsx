import ImageGallery from '@/components/ImageGallery';
import Image from 'next/image';

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-48 h-48 mb-6">
            <Image
              src="/images/logo/logo.png"
              alt="Altaj Furniture Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">Our Gallery</h1>
          <p className="text-gray-600 text-center max-w-2xl">
            Explore our collection of traditional Arabic furniture. Each piece
            is carefully crafted to bring elegance and comfort to your home.
          </p>
        </div>
        <ImageGallery />
      </div>
    </main>
  );
}
