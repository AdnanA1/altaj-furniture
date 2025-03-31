'use client';
'use client';
'use client';
'use client';
import React from 'react';
import { Hero } from '../components/hero';
import { ProductGrid } from '../components/product-grid';
import { SocialFeed } from '../components/social-feed';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <Hero />

      {/* Featured Products Section */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>
          <ProductGrid />
        </div>
      </section>

      {/* Social Media Feed Section */}
      <SocialFeed />

      {/* About Section */}
      <section className="w-full py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Welcome to Altaj Furniture
              </h2>
              <p className="text-gray-600 mb-4">
                Located in the heart of Dearborn, Michigan, Altaj Furniture
                brings the finest Arabic furniture to your home. Our collection
                combines traditional craftsmanship with modern comfort, offering
                you the perfect blend of style and functionality.
              </p>
              <p className="text-gray-600 mb-6">
                Visit our showroom at 4907 Schaefer Rd to explore our extensive
                collection of premium furniture pieces that will transform your
                living spaces.
              </p>
              <Button>Visit Our Showroom</Button>
            </div>
            <div className="relative h-[400px]">
              <div className="absolute inset-0 bg-gray-200 rounded-lg"></div>
              {/* Add an image here later */}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Visit Us</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Location</h3>
              <p className="text-gray-600">4907 Schaefer Rd</p>
              <p className="text-gray-600">Dearborn, Michigan</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
              <p className="text-gray-600">
                Monday - Friday: 10:00 AM - 8:00 PM
              </p>
              <p className="text-gray-600">Saturday: 10:00 AM - 6:00 PM</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
