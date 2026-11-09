import { MeherbanProduct } from '@/types/meherban';

export interface SubcategoryMeta {
  id: string;
  name: string;
  nameBn: string;
}

export function getStandardCategoryKey(categoryName?: string): string {
  const c = (categoryName || '').trim().toLowerCase();
  if (c.startsWith('men')) return 'Men';
  if (c.startsWith('women')) return 'Women';
  if (c.startsWith('unisex')) return 'Unisex';
  if (c.startsWith('access')) return 'Accessories';
  if (c.startsWith('cloth')) return 'Clothing';
  return categoryName?.trim() || 'Men';
}

/**
 * Exact category & subcategory lists defined for Meherban:
 * - Men: T - Shirts, Shirts, Pants & Trousers, Footwear, Traditional Wear, Hoodies & Sweatshirts, Jackets
 *   (Polo, Kabli set, and Men's Accessories removed as requested)
 * - Women: Tops & T-Shirts, Shirts, Dresses, Footwear, Traditional Wear, Pants & Trousers,
 *   Hoodies & Sweatshirts, Jackets & Blazers, Co-Ord Sets, Bags
 *   (Women's Accessories removed as requested)
 * - Unisex: T-Shirts, Shirts, Footwear, Pants & Joggers, Hoodies & Sweatshirts
 * - Accessories: Sunglasses, Watches, Wallets, Belts, Caps & Hats, Jewelry, Perfumes & Fragrances
 */
export const SUBCATEGORIES_BY_CATEGORY: Record<string, SubcategoryMeta[]> = {
  Men: [
    { id: 't-shirts', name: 'T - Shirts', nameBn: 'টি-শার্ট' },
    { id: 'shirts', name: 'Shirts', nameBn: 'শার্ট' },
    { id: 'pants-trousers', name: 'Pants & Trousers', nameBn: 'প্যান্ট ও ট্রাউজার' },
    { id: 'footwear', name: 'Footwear', nameBn: 'ফুটওয়্যার' },
    { id: 'traditional-wear', name: 'Traditional Wear', nameBn: 'পাঞ্জাবি ও ট্র্যাডিশনাল' },
    { id: 'hoodies-sweatshirts', name: 'Hoodies & Sweatshirts', nameBn: 'হুডি ও সোয়েটশার্ট' },
    { id: 'jackets', name: 'Jackets', nameBn: 'জ্যাকেট' },
  ],
  Women: [
    { id: 'tops-tshirts', name: 'Tops & T-Shirts', nameBn: 'টপস ও টি-শার্ট' },
    { id: 'shirts', name: 'Shirts', nameBn: 'শার্ট' },
    { id: 'dresses', name: 'Dresses', nameBn: 'ড্রেস ও গাউন' },
    { id: 'footwear', name: 'Footwear', nameBn: 'ফুটওয়্যার' },
    { id: 'traditional-wear', name: 'Traditional Wear', nameBn: 'শাড়ি ও ট্র্যাডিশনাল' },
    { id: 'pants-trousers', name: 'Pants & Trousers', nameBn: 'প্যান্ট ও ট্রাউজার' },
    { id: 'hoodies-sweatshirts', name: 'Hoodies & Sweatshirts', nameBn: 'হুডি ও সোয়েটশার্ট' },
    { id: 'jackets-blazers', name: 'Jackets & Blazers', nameBn: 'জ্যাকেট ও ব্লেজার' },
    { id: 'coord-sets', name: 'Co-Ord Sets', nameBn: 'কো-অর্ড সেট' },
    { id: 'bags', name: 'Bags', nameBn: 'ব্যাগ ও পার্স' },
  ],
  Unisex: [
    { id: 't-shirts', name: 'T-Shirts', nameBn: 'টি-শার্ট' },
    { id: 'shirts', name: 'Shirts', nameBn: 'শার্ট' },
    { id: 'footwear', name: 'Footwear', nameBn: 'ফুটওয়্যার' },
    { id: 'pants-joggers', name: 'Pants & Joggers', nameBn: 'প্যান্ট ও জগার্স' },
    { id: 'hoodies-sweatshirts', name: 'Hoodies & Sweatshirts', nameBn: 'হুডি ও সোয়েটশার্ট' },
  ],
  Accessories: [
    { id: 'sunglasses', name: 'Sunglasses', nameBn: 'সানগ্লাস' },
    { id: 'watches', name: 'Watches', nameBn: 'ঘড়ি' },
    { id: 'wallets', name: 'Wallets', nameBn: 'মানিব্যাগ ও ওয়ালেট' },
    { id: 'belts', name: 'Belts', nameBn: 'বেল্ট' },
    { id: 'caps-hats', name: 'Caps & Hats', nameBn: 'ক্যাপ ও হ্যাট' },
    { id: 'jewelry', name: 'Jewelry', nameBn: 'জুয়েলারি ও গহনা' },
    { id: 'perfumes-fragrances', name: 'Perfumes & Fragrances', nameBn: 'পারফিউম ও সুগন্ধি' },
  ],
  Clothing: [
    { id: 't-shirts', name: 'T - Shirts', nameBn: 'টি-শার্ট' },
    { id: 'shirts', name: 'Shirts', nameBn: 'শার্ট' },
    { id: 'pants-trousers', name: 'Pants & Trousers', nameBn: 'প্যান্ট ও ট্রাউজার' },
    { id: 'traditional-wear', name: 'Traditional Wear', nameBn: 'ট্র্যাডিশনাল ওয়্যার' },
    { id: 'hoodies-sweatshirts', name: 'Hoodies & Sweatshirts', nameBn: 'হুডি ও সোয়েটশার্ট' },
    { id: 'jackets', name: 'Jackets', nameBn: 'জ্যাকেট' },
  ],
};

/**
 * Normalizes legacy subcategory names into the newly established taxonomy.
 */
function normalizeLegacySubcategory(sub: string, stdCat: string): string | null {
  const s = sub.trim().toLowerCase();

  // Handle Men legacy mappings
  if (stdCat === 'Men') {
    if (s === 'panjabi' || s === 'kabli & co-ords' || s === 'kabli') return 'Traditional Wear';
    if (s === 'polo') return 'T - Shirts';
    if (s === "men's accessories" || s === 'watches') return 'Watches';
    if (s === 'tshirts' || s === 't-shirts') return 'T - Shirts';
  }

  // Handle Women legacy mappings
  if (stdCat === 'Women') {
    if (s === 'threepiece' || s === 'three piece & salwar' || s === 'saree' || s === 'kurti & tunics' || s === 'kurti' || s === 'abaya & borka' || s === 'dupatta & hijab') {
      return 'Traditional Wear';
    }
    if (s === 'pants & palazzo') return 'Pants & Trousers';
    if (s === 'tops & shirts') return 'Tops & T-Shirts';
    if (s === 'bags & wallets') return 'Bags';
    if (s === "women's accessories") return 'Bags';
  }

  // Handle Accessories legacy mappings
  if (stdCat === 'Accessories') {
    if (s === 'watches') return 'Watches';
    if (s === 'eyewear / sunglasses' || s === 'sunglasses') return 'Sunglasses';
    if (s === 'bags & wallets' || s === 'wallets') return 'Wallets';
    if (s === 'perfume & attar' || s === 'perfumes & fragrances') return 'Perfumes & Fragrances';
    if (s === 'belts & leather' || s === 'belts') return 'Belts';
    if (s === 'jewelry') return 'Jewelry';
  }

  // Check if it already exactly matches a standard subcategory
  const list = SUBCATEGORIES_BY_CATEGORY[stdCat] || [];
  const directMatch = list.find(
    (item) => item.name.toLowerCase() === s || item.name.replace(/[\s-]+/g, '').toLowerCase() === s.replace(/[\s-]+/g, '')
  );
  if (directMatch) {
    return directMatch.name;
  }

  return null;
}

/**
 * Automatically infers product subcategory from title, subtitle, and description
 * if an explicit subcategory has not been assigned, or maps legacy values.
 */
export function inferSubcategory(product: {
  title?: string;
  subtitle?: string;
  description?: string;
  categoryName?: string;
  subcategory?: string;
}): string {
  const stdCat = getStandardCategoryKey(product.categoryName);

  if (product.subcategory && product.subcategory.trim().length > 0) {
    const legacyNormalized = normalizeLegacySubcategory(product.subcategory, stdCat);
    if (legacyNormalized) {
      return legacyNormalized;
    }
    // Return explicit subcategory if custom defined
    return product.subcategory.trim();
  }

  const text = `${product.title || ''} ${product.subtitle || ''} ${product.description || ''}`.toLowerCase();

  // ==========================================
  // MEN SUB-CATEGORIES
  // ==========================================
  if (stdCat === 'Men') {
    if (/panjabi|punjabi|পাঞ্জাবি|kabli|কাবলি|pajama|pyjama|পায়জামা|kurta|শেরওয়ানি|sherwani|fotua|ফতুয়া|lungi|লুঙ্গি|traditional/i.test(text)) {
      return 'Traditional Wear';
    }
    if (/hoodie|sweatshirt|sweater|fleece|হুডি|সোয়েটশার্ট|সোয়েটার/i.test(text)) {
      return 'Hoodies & Sweatshirts';
    }
    if (/jacket|bomber|windbreaker|blazer|coat|জ্যাকেট|কোট|ব্লেজার/i.test(text)) {
      return 'Jackets';
    }
    if (/shoe|shoes|sneaker|sneakers|loafer|loafers|sandal|sandals|slipper|slippers|boot|boots|footwear|slide|slides|জুতো|জুতা|স্যান্ডেল/i.test(text)) {
      return 'Footwear';
    }
    if (/pant|pants|trouser|trousers|chino|chinos|denim|jeans|jogger|joggers|cargo|cargos|প্যান্ট|ট্রাউজার|জিন্স|কার্গো/i.test(text)) {
      return 'Pants & Trousers';
    }
    if (/t[\s-]?shirt|tshirt|tee|tees|polo|টি-শার্ট|টি শার্ট|পোলো/i.test(text)) {
      return 'T - Shirts';
    }
    if (/shirt|shirts|button-down|oxford|linen shirt|শার্ট/i.test(text)) {
      return 'Shirts';
    }
    return 'T - Shirts';
  }

  // ==========================================
  // WOMEN SUB-CATEGORIES
  // ==========================================
  if (stdCat === 'Women') {
    if (/co-ord|coord|two-piece|matching set|কো-অর্ড|কোঅর্ড/i.test(text)) {
      return 'Co-Ord Sets';
    }
    if (/dress|dresses|gown|gowns|frock|maxi|মিডি|ড্রেস|গাউন|ফ্রক/i.test(text)) {
      return 'Dresses';
    }
    if (/saree|shari|শাড়ি|jamdani|জামদানি|three[\s-]?piece|3[\s-]?piece|থ্রি[\s-]?পিস|salwar|সালোয়ার|kurti|কুর্তি|tunic|kameez|কামিজ|abaya|borka|burqa|বোরকা|আবায়া|hijab|dupatta|scarf|হিজাব|ওড়না|দোপাট্টা|traditional/i.test(text)) {
      return 'Traditional Wear';
    }
    if (/bag|bags|handbag|handbags|crossbody|tote|backpack|clutch|purse|ব্যাগ|পার্স/i.test(text)) {
      return 'Bags';
    }
    if (/heel|heels|shoe|shoes|sneaker|sneakers|sandal|sandals|flat|flats|boot|boots|জুতো|জুতা|হিল|স্যান্ডেল/i.test(text)) {
      return 'Footwear';
    }
    if (/hoodie|sweatshirt|sweater|fleece|হুডি|সোয়েটশার্ট/i.test(text)) {
      return 'Hoodies & Sweatshirts';
    }
    if (/jacket|jackets|blazer|blazers|coat|cardigan|জ্যাকেট|ব্লেজার|কার্ডিগান/i.test(text)) {
      return 'Jackets & Blazers';
    }
    if (/pant|pants|trouser|trousers|palazzo|legging|leggings|denim|jeans|প্যান্ট|পালাজো|লেগিংস|জিন্স/i.test(text)) {
      return 'Pants & Trousers';
    }
    if (/top|tops|crop top|crop-top|t[\s-]?shirt|tshirt|tee|tees|টপ|টপস|টি-শার্ট/i.test(text)) {
      return 'Tops & T-Shirts';
    }
    if (/shirt|shirts|button-down|blouse|শার্ট|ব্লাউজ/i.test(text)) {
      return 'Shirts';
    }
    return 'Tops & T-Shirts';
  }

  // ==========================================
  // UNISEX SUB-CATEGORIES
  // ==========================================
  if (stdCat === 'Unisex') {
    if (/hoodie|sweatshirt|fleece|sweater|হুডি|সোয়েটশার্ট/i.test(text)) {
      return 'Hoodies & Sweatshirts';
    }
    if (/shoe|shoes|sneaker|sneakers|sandal|sandals|slide|slides|boot|boots|জুতো|জুতা/i.test(text)) {
      return 'Footwear';
    }
    if (/jogger|joggers|sweatpant|sweatpants|track pant|pant|pants|trouser|trousers|জগার্স|প্যান্ট/i.test(text)) {
      return 'Pants & Joggers';
    }
    if (/t[\s-]?shirt|tshirt|tee|tees|polo|টি-শার্ট|পোলো/i.test(text)) {
      return 'T-Shirts';
    }
    if (/shirt|shirts|linen shirt|button-down|শার্ট/i.test(text)) {
      return 'Shirts';
    }
    return 'T-Shirts';
  }

  // ==========================================
  // ACCESSORIES SUB-CATEGORIES
  // ==========================================
  if (stdCat === 'Accessories') {
    if (/sunglass|sunglasses|shade|shades|eyewear|glasses|সানগ্লাস|চশমা/i.test(text)) {
      return 'Sunglasses';
    }
    if (/watch|watches|timepiece|chronograph|ঘড়ি|ঘরি/i.test(text)) {
      return 'Watches';
    }
    if (/wallet|wallets|purse|billfold|cardholder|money clip|মানিব্যাগ|ওয়ালেট/i.test(text)) {
      return 'Wallets';
    }
    if (/belt|belts|leather belt|buckle|বেল্ট/i.test(text)) {
      return 'Belts';
    }
    if (/cap|caps|hat|hats|beanie|snapback|fedora|ক্যাপ|হ্যাট|টুপি/i.test(text)) {
      return 'Caps & Hats';
    }
    if (/jewelry|jewellery|necklace|earring|earrings|bracelet|bangle|ring|chain|pendant|গহনা|চুড়ি|মালা|দুল|আংটি/i.test(text)) {
      return 'Jewelry';
    }
    if (/perfume|perfumes|fragrance|fragrances|attar|itar|cologne|eau de|body mist|পারফিউম|আতর|সুগন্ধি/i.test(text)) {
      return 'Perfumes & Fragrances';
    }
    return 'Sunglasses';
  }

  // Fallback for general clothing or unknown category
  if (/panjabi|punjabi|পাঞ্জাবি|saree|shari|traditional/i.test(text)) return 'Traditional Wear';
  if (/hoodie|sweatshirt/i.test(text)) return 'Hoodies & Sweatshirts';
  if (/shoe|sneaker|footwear/i.test(text)) return 'Footwear';
  if (/pant|trouser|jeans/i.test(text)) return 'Pants & Trousers';
  if (/t[\s-]?shirt|tee/i.test(text)) return 'T - Shirts';
  if (/shirt/i.test(text)) return 'Shirts';

  return 'General';
}

export interface SubcategoryOption {
  name: string;
  nameBn?: string;
  count: number;
}

/**
 * Returns available subcategories for a given main category along with product counts.
 */
export function getSubcategoriesForCategory(
  categoryName: string,
  products: MeherbanProduct[]
): SubcategoryOption[] {
  const normCat = (categoryName || 'All').trim();
  const isAll = normCat.toLowerCase() === 'all' || normCat === 'Home' || !normCat;
  const stdCat = getStandardCategoryKey(categoryName);

  // Filter products belonging to this category
  const targetProducts = isAll
    ? products
    : products.filter(
        (p) => getStandardCategoryKey(p.categoryName || '').toLowerCase() === stdCat.toLowerCase()
      );

  // Predefined standard subcategories for this category
  const standardList = (!isAll && (SUBCATEGORIES_BY_CATEGORY[stdCat] || SUBCATEGORIES_BY_CATEGORY[normCat])) || [];
  const standardNameSet = new Set(standardList.map((s) => s.name.toLowerCase()));

  // Count products by subcategory
  const countsMap = new Map<string, number>();
  const subcategoryMetaMap = new Map<string, { name: string; nameBn?: string }>();

  standardList.forEach((s) => {
    subcategoryMetaMap.set(s.name.toLowerCase(), { name: s.name, nameBn: s.nameBn });
    countsMap.set(s.name.toLowerCase(), 0);
  });

  targetProducts.forEach((p) => {
    const sub = inferSubcategory(p);
    const key = sub.toLowerCase();
    countsMap.set(key, (countsMap.get(key) || 0) + 1);
    if (!subcategoryMetaMap.has(key)) {
      subcategoryMetaMap.set(key, { name: sub });
    }
  });

  const options: SubcategoryOption[] = [
    {
      name: 'All',
      nameBn: 'সব কালেকশন',
      count: targetProducts.length,
    },
  ];

  // Add all standard subcategories in exact requested order
  standardList.forEach((s) => {
    const count = countsMap.get(s.name.toLowerCase()) || 0;
    options.push({
      name: s.name,
      nameBn: s.nameBn,
      count,
    });
  });

  // If "All" is active, list unique discovered subcategories across the whole catalog
  if (isAll) {
    const globalOrder = [
      'T - Shirts',
      'Shirts',
      'Pants & Trousers',
      'Traditional Wear',
      'Hoodies & Sweatshirts',
      'Jackets',
      'Dresses',
      'Co-Ord Sets',
      'Footwear',
      'Sunglasses',
      'Watches',
      'Wallets',
      'Belts',
      'Caps & Hats',
      'Jewelry',
      'Perfumes & Fragrances',
      'Bags',
    ];
    globalOrder.forEach((name) => {
      const count = countsMap.get(name.toLowerCase()) || 0;
      if (count > 0) {
        options.push({
          name,
          count,
        });
      }
    });
  }

  return options;
}
