export interface ImageData {
  id: string;
  src: string;
  alt: string;
  description: string;
  category: 'living-room' | 'dining-room' | 'bedroom' | 'office' | 'showroom';
  source: 'instagram' | 'facebook' | 'pinterest';
  postUrl: string;
}

export const images: ImageData[] = [
  {
    id: '1',
    src: '/images/living-room/luxury-sofa-set.jpg',
    alt: 'Luxury Arabic Sofa Set',
    description:
      'Elegant living room featuring our premium Arabic sofa set with intricate woodwork and plush cushions.',
    category: 'living-room',
    source: 'instagram',
    postUrl: 'https://instagram.com/altajfurniture'
  },
  {
    id: '2',
    src: '/images/dining-room/arabic-dining-set.jpg',
    alt: 'Traditional Arabic Dining Set',
    description:
      'Beautiful dining room showcasing our handcrafted Arabic dining set with detailed woodwork.',
    category: 'dining-room',
    source: 'facebook',
    postUrl: 'https://facebook.com/altajfurniture'
  },
  {
    id: '3',
    src: '/images/bedroom/master-bedroom.jpg',
    alt: 'Master Bedroom Suite',
    description:
      'Stunning master bedroom featuring our premium Arabic bedroom suite with ornate headboard.',
    category: 'bedroom',
    source: 'instagram',
    postUrl: 'https://instagram.com/altajfurniture'
  },
  {
    id: '4',
    src: '/images/office/executive-desk.jpg',
    alt: 'Executive Office Desk',
    description:
      'Professional office setup with our handcrafted Arabic executive desk and matching chair.',
    category: 'office',
    source: 'pinterest',
    postUrl: 'https://pinterest.com/altajfurniture'
  },
  {
    id: '5',
    src: '/images/showroom/store-front.jpg',
    alt: 'Altaj Furniture Showroom',
    description:
      'Visit our showroom at 4907 Schaefer Rd to explore our extensive collection.',
    category: 'showroom',
    source: 'instagram',
    postUrl: 'https://instagram.com/altajfurniture'
  },
  {
    id: '6',
    src: '/images/living-room/arabic-coffee-table.jpg',
    alt: 'Arabic Coffee Table',
    description:
      'Handcrafted Arabic coffee table with intricate woodwork and brass inlays.',
    category: 'living-room',
    source: 'facebook',
    postUrl: 'https://facebook.com/altajfurniture'
  },
  {
    id: '7',
    src: '/images/dining-room/arabic-sideboard.jpg',
    alt: 'Arabic Sideboard',
    description:
      'Elegant sideboard with traditional Arabic design and ample storage space.',
    category: 'dining-room',
    source: 'instagram',
    postUrl: 'https://instagram.com/altajfurniture'
  },
  {
    id: '8',
    src: '/images/bedroom/guest-bedroom.jpg',
    alt: 'Guest Bedroom Set',
    description:
      'Comfortable guest bedroom featuring our Arabic bedroom collection.',
    category: 'bedroom',
    source: 'pinterest',
    postUrl: 'https://pinterest.com/altajfurniture'
  },
  {
    id: '9',
    src: '/images/office/bookshelf.jpg',
    alt: 'Arabic Bookshelf',
    description:
      'Handcrafted Arabic bookshelf with adjustable shelves and decorative details.',
    category: 'office',
    source: 'instagram',
    postUrl: 'https://instagram.com/altajfurniture'
  },
  {
    id: '10',
    src: '/images/showroom/interior-view.jpg',
    alt: 'Showroom Interior',
    description:
      "Explore our showroom's elegant display of premium Arabic furniture.",
    category: 'showroom',
    source: 'facebook',
    postUrl: 'https://facebook.com/altajfurniture'
  }
];

export const categories = [
  {
    id: 'living-room',
    name: 'Living Room',
    description: 'Elegant living room furniture with traditional Arabic design'
  },
  {
    id: 'dining-room',
    name: 'Dining Room',
    description: 'Beautiful dining sets and accessories for your home'
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    description: 'Comfortable and stylish bedroom furniture'
  },
  {
    id: 'office',
    name: 'Office',
    description: 'Professional office furniture with traditional touches'
  },
  {
    id: 'showroom',
    name: 'Showroom',
    description: 'Visit our store to see our collection in person'
  }
];

export function getImagesByCategory(category: string): ImageData[] {
  return images.filter((image) => image.category === category);
}

export function getFeaturedImages(): ImageData[] {
  return images.filter((image) => image.featured);
}
