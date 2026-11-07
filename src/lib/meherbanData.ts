import { MeherbanCategory, MeherbanProduct, HeroSlide, PromoBanner, InstagramPost } from '@/types/meherban';

export const MEHERBAN_CATEGORIES: MeherbanCategory[] = [
  {
    id: 'men',
    slug: 'men',
    name: 'Men',
    description: 'Modern essentials, sharp tailoring & premium streetwear silhouettes.',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85',
    tagline: 'Shop Now →',
    count: 42,
  },
  {
    id: 'women',
    slug: 'women',
    name: 'Women',
    description: 'Effortless luxury, structured blazers & elevated wardrobe staples.',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85',
    tagline: 'Shop Now →',
    count: 58,
  },
  {
    id: 'unisex',
    slug: 'unisex',
    name: 'Unisex',
    description: 'Gender-fluid minimalist hoodies, heavy oversized tees & knitwear.',
    imageUrl:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85',
    tagline: 'Shop Now →',
    count: 36,
  },
  {
    id: 'accessories',
    slug: 'accessories',
    name: 'Accessories',
    description: 'Handcrafted leather goods, polarized eyewear & steel timepieces.',
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
    tagline: 'Shop Now →',
    count: 29,
  },
];

export const MEHERBAN_PRODUCTS: MeherbanProduct[] = [
  {
    id: 'prod-oversized-tee',
    title: 'Oversized T-Shirt',
    slug: 'oversized-t-shirt',
    subtitle: 'Streetwear Luxury Graphic Tee',
    description:
      'Crafted from 240 GSM combed compact cotton for a premium heavyweight drape, breathable feel, and long-lasting shape. Features high-density typography print on the back.',
    price: 1499,
    originalPrice: 1899,
    rating: 4.9,
    reviewCount: 128,
    categoryName: 'Men',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=85',
    ],
    colorSwatches: [
      { name: 'Onyx Black', hex: '#111111' },
      { name: 'Charcoal Grey', hex: '#666666' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockQuantity: 45,
    isTrending: true,
    isFeatured: true,
    badge: 'HOT',
  },
  {
    id: 'prod-classic-hoodie',
    title: 'Classic Hoodie',
    slug: 'classic-hoodie',
    subtitle: 'Heavyweight Minimalist Fleece Hoodie',
    description:
      '420 GSM pre-shrunk French Terry fleece. Designed with dropped shoulder seams, double-layered drawstring-free hood, and dense ribbed trims for an ultra-clean drape.',
    price: 2499,
    originalPrice: 2999,
    rating: 5.0,
    reviewCount: 94,
    categoryName: 'Unisex',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=85',
    ],
    colorSwatches: [
      { name: 'Oatmeal Beige', hex: '#E6DEC9' },
      { name: 'Midnight Black', hex: '#161616' },
      { name: 'Muted Olive', hex: '#525B49' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockQuantity: 45,
    isTrending: true,
    isFeatured: true,
    badge: 'BESTSELLER',
  },
  {
    id: 'prod-wide-leg-pants',
    title: "Women's Wide Leg Pants",
    slug: 'womens-wide-leg-pants',
    subtitle: 'High-Waisted Tailored Pleated Trousers',
    description:
      'Tailored high-rise pleated trousers cut from structured fluid crepe fabric. Features sharp front knife pleats, slant pockets, and a clean hook-and-bar closure.',
    price: 2199,
    originalPrice: 2699,
    rating: 4.8,
    reviewCount: 76,
    categoryName: 'Women',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=85',
    ],
    colorSwatches: [
      { name: 'Sand Khaki', hex: '#C7B299' },
      { name: 'Cocoa Brown', hex: '#584333' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stockQuantity: 30,
    isTrending: true,
    isFeatured: true,
    badge: 'TRENDING',
  },
  {
    id: 'prod-women-kurti',
    title: "Women's Embroidered Cotton Kurti",
    slug: 'womens-embroidered-cotton-kurti',
    subtitle: 'Festive Elegance & Breathable Daily Wear',
    description:
      'Crafted from 100% premium combed cotton with delicate neckline thread embroidery, side slits, and a relaxed graceful silhouette.',
    price: 1850,
    originalPrice: 2350,
    rating: 4.9,
    reviewCount: 42,
    categoryName: 'Women',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    ],
    colorSwatches: [
      { name: 'Maroon', hex: '#800000', inStock: true, stockQuantity: 20 },
      { name: 'Navy Blue', hex: '#000080', inStock: true, stockQuantity: 15 },
      { name: 'Black', hex: '#000000', inStock: true, stockQuantity: 25 },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockQuantity: 60,
    isTrending: true,
    isFeatured: true,
    badge: 'NEW',
  },
  {
    id: 'prod-women-linen-shirt',
    title: "Women's Oversized Linen Shirt",
    slug: 'womens-oversized-linen-shirt',
    subtitle: 'Effortless Summer Casual Button-Down',
    description:
      'Breathable pure linen-cotton blend with mother-of-pearl buttons, dropped shoulders, and curved high-low hem.',
    price: 1699,
    originalPrice: 2099,
    rating: 4.8,
    reviewCount: 57,
    categoryName: 'Women',
    images: [
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    ],
    colorSwatches: [
      { name: 'White', hex: '#FFFFFF', inStock: true, stockQuantity: 30 },
      { name: 'Beige', hex: '#F5F5DC', inStock: true, stockQuantity: 20 },
      { name: 'Pink', hex: '#FFC0CB', inStock: true, stockQuantity: 15 },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockQuantity: 65,
    isTrending: true,
    isFeatured: true,
    badge: 'POPULAR',
  },
  {
    id: 'prod-sunglasses-unisex',
    title: 'Sunglasses (Unisex)',
    slug: 'sunglasses-unisex',
    subtitle: 'Polarized Geometric Acetate Eyewear',
    description:
      'Handcrafted glossy Italian acetate frames fitted with polarized Category 3 UV400 dark lenses, metallic core temples, and signature 5-barrel hinges.',
    price: 1299,
    originalPrice: 1799,
    rating: 4.9,
    reviewCount: 112,
    categoryName: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=85',
    ],
    colorSwatches: [
      { name: 'Jet Black', hex: '#0B0B0B' },
      { name: 'Dark Tortoiseshell', hex: '#42281D' },
    ],
    sizes: ['One Size'],
    inStock: true,
    stockQuantity: 20,
    isTrending: true,
    isFeatured: true,
    badge: 'NEW',
  },
  {
    id: 'prod-leather-crossbody',
    title: 'Leather Crossbody Bag',
    slug: 'leather-crossbody-bag',
    subtitle: 'Saffiano Textured Flap Bag',
    description:
      'Structured flap crossbody bag crafted in scratch-resistant micro-grain vegan leather. Fitted with concealed magnetic snap closure and adjustable webbing strap.',
    price: 1299,
    originalPrice: 1999,
    rating: 4.7,
    reviewCount: 83,
    categoryName: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85',
    ],
    colorSwatches: [
      { name: 'Sleek Black', hex: '#1A1A1A' },
      { name: 'Warm Cognac', hex: '#87512F' },
    ],
    sizes: ['One Size'],
    inStock: true,
    stockQuantity: 20,
    isTrending: true,
    isFeatured: true,
    badge: 'POPULAR',
  },
  {
    id: 'prod-luxury-watch',
    title: 'Luxury Watch',
    slug: 'luxury-watch',
    subtitle: 'Stealth Black Chronograph Timepiece',
    description:
      'Surgical 316L ion-plated matte black stainless steel casing. Sapphire glass anti-reflective dial with precise Japanese quartz movement and 5ATM water resistance.',
    price: 4999,
    originalPrice: 6499,
    rating: 5.0,
    reviewCount: 65,
    categoryName: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=85',
    ],
    colorSwatches: [
      { name: 'Matte Black', hex: '#111111' },
      { name: 'Champagne Gold', hex: '#CDB17F' },
    ],
    sizes: ['42mm Case'],
    inStock: true,
    stockQuantity: 15,
    isTrending: true,
    isFeatured: true,
    badge: 'PREMIUM',
  },
];

export const INSTAGRAM_POSTS = [
  {
    id: 'ig-1',
    imageUrl:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=85',
    likes: '1.4k',
    tag: '@meherban.daily',
  },
  {
    id: 'ig-2',
    imageUrl:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=85',
    likes: '2.1k',
    tag: '#WearYourStory',
  },
  {
    id: 'ig-3',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=85',
    likes: '980',
    tag: '@meherban.homme',
  },
  {
    id: 'ig-4',
    imageUrl:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=85',
    likes: '3.2k',
    tag: '#MeherbanUnisex',
  },
  {
    id: 'ig-5',
    imageUrl:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=85',
    likes: '1.8k',
    tag: '#SneakersAndBoots',
  },
  {
    id: 'ig-6',
    imageUrl:
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=85',
    likes: '870',
    tag: '@meherban.gear',
  },
  {
    id: 'ig-7',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85',
    likes: '2.7k',
    tag: '#ModernSilhouette',
  },
  {
    id: 'ig-8',
    imageUrl:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=85',
    likes: '1.5k',
    tag: '#LeatherDetails',
  },
];

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    tagline: "MEN'S & WOMEN'S COLLECTION",
    headlineLine1: 'STYLE FOR',
    headlineLine2: 'EVERY YOU',
    subcategories: 'Clothing | Fashion Accessories | Unisex',
    imageUrl:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85',
    ctaPrimary: 'SHOP NOW →',
    ctaSecondary: 'EXPLORE',
  },
  {
    id: 2,
    tagline: 'AUTUMN / WINTER EDIT',
    headlineLine1: 'TIMELESS',
    headlineLine2: 'MINIMALISM',
    subcategories: 'Heavyweight Knits | Structured Crepe | Eyewear',
    imageUrl:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85',
    ctaPrimary: 'DISCOVER →',
    ctaSecondary: 'LOOKBOOK',
  },
  {
    id: 3,
    tagline: 'STREET LUXE EDIT',
    headlineLine1: 'URBAN',
    headlineLine2: 'REDEFINED',
    subcategories: 'Graphic Hoodies | Leather Bags | Timepieces',
    imageUrl:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=85',
    ctaPrimary: 'SHOP NOW →',
    ctaSecondary: 'DETAILS',
  },
];

export const DEFAULT_PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'men-promo',
    category: 'Men',
    title: "MEN'S COLLECTION",
    subtitle: 'Classic meets modern.',
    cta: 'SHOP NOW →',
    bgClass: 'bg-[#1F1A18] text-white',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'women-promo',
    category: 'Women',
    title: "WOMEN'S COLLECTION",
    subtitle: 'Elegance in every detail.',
    cta: 'SHOP NOW →',
    bgClass: 'bg-[#9C7F6E] text-white',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'accessories-promo',
    category: 'Accessories',
    title: 'ACCESSORIES',
    subtitle: 'Complete your look.',
    cta: 'SHOP NOW →',
    bgClass: 'bg-[#241E1C] text-white',
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85',
  },
];
