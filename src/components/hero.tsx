import { Button } from '../components/ui/button';

export function Hero() {
  return (
    <section className="relative h-[600px] w-full">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative h-full">
          <img
            src="/images/hero-bg.jpg"
            alt="Luxury Arabic Furniture"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Altaj-Furniture</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Discover our collection of handcrafted furniture that brings elegance
          and comfort to your home
        </p>
        <Button size="lg" className="bg-white text-black hover:bg-white/90">
          Explore Collection
        </Button>
      </div>
    </section>
  );
}
