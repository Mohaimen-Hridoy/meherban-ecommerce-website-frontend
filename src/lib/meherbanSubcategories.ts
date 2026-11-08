import { MeherbanProduct } from '@/types/meherban';

export interface SubcategoryMeta {
  id: string;
  name: string;
  nameBn: string;
}

export const SUBCATEGORIES_BY_CATEGORY: Record<string, SubcategoryMeta[]> = {
  Men: [
    { id: 'panjabi', name: 'Panjabi', nameBn: 'পাঞ্জাবি' },
    { id: 'shirts', name: 'Shirts', nameBn: 'শার্ট' },
    { id: 'tshirts', name: 'T-Shirts', nameBn: 'টি-শার্ট' },
    { id: 'polo', name: 'Polo', nameBn: 'পোলো' },
    { id: 'pants', name: 'Pants & Trousers', nameBn: 'প্যান্ট ও ট্রাউজার' },
    { id: 'kabli', name: 'Kabli & Co-ords', nameBn: 'কাবলি সেট' },
  ],
  Women: [
    { id: 'threepiece', name: 'Three Piece & Salwar', nameBn: 'থ্রি পিস' },
    { id: 'saree', name: 'Saree', nameBn: 'শাড়ি' },
    { id: 'kurti', name: 'Kurti & Tunics', nameBn: 'কুর্তি' },
    { id: 'abaya', name: 'Abaya & Borka', nameBn: 'বোরকা ও আবায়া' },
    { id: 'tops', name: 'Tops & Shirts', nameBn: 'টপস ও শার্ট' },
    { id: 'pants', name: 'Pants & Palazzo', nameBn: 'প্যান্ট ও পালাজো' },
    { id: 'hijab', name: 'Dupatta & Hijab', nameBn: 'দোপাট্টা ও হিজাব' },
  ],
  Accessories: [
    { id: 'watches', name: 'Watches', nameBn: 'ঘড়ি' },
    { id: 'bags', name: 'Bags & Wallets', nameBn: 'ব্যাগ ও ওয়ালেট' },
    { id: 'sunglasses', name: 'Eyewear / Sunglasses', nameBn: 'সানগ্লাস' },
    { id: 'perfume', name: 'Perfume & Attar', nameBn: 'পারফিউম ও আতর' },
    { id: 'belts', name: 'Belts & Leather', nameBn: 'বেল্ট' },
    { id: 'jewelry', name: 'Jewelry', nameBn: 'জুয়েলারি' },
  ],
  Unisex: [
    { id: 'hoodies', name: 'Hoodies & Sweatshirts', nameBn: 'হুডি' },
    { id: 'tshirts', name: 'T-Shirts', nameBn: 'টি-শার্ট' },
    { id: 'outerwear', name: 'Outerwear', nameBn: 'আউটারওয়্যার' },
  ],
  Clothing: [
    { id: 'men', name: "Men's Wear", nameBn: 'মেনস ওয়্যার' },
    { id: 'women', name: "Women's Wear", nameBn: 'ওমেন্স ওয়্যার' },
    { id: 'tees', name: 'T-Shirts & Polos', nameBn: 'টি-শার্ট ও পোলো' },
  ],
};

/**
 * Automatically infers product subcategory from title, subtitle, and description
 * if an explicit subcategory has not been assigned.
 */
export function inferSubcategory(product: {
  title?: string;
  subtitle?: string;
  description?: string;
  categoryName?: string;
  subcategory?: string;
}): string {
  if (product.subcategory && product.subcategory.trim().length > 0) {
    return product.subcategory.trim();
  }

  const text = `${product.title || ''} ${product.subtitle || ''} ${product.description || ''}`.toLowerCase();
  const cat = (product.categoryName || '').toLowerCase();

  // Men & Women Traditional
  if (/panjabi|punjabi|পাঞ্জাবি/i.test(text)) return 'Panjabi';
  if (/kabli|co-ord|কো-অর্ড|কাবলি/i.test(text)) return 'Kabli & Co-ords';
  if (/three[\s-]?piece|3[\s-]?piece|salwar|থ্রি[\s-]?পিস|সালোয়ার/i.test(text)) return 'Three Piece & Salwar';
  if (/saree|shari|শাড়ি|jamdani|জামদানি/i.test(text)) return 'Saree';
  if (/kurti|tunic|কুর্তি/i.test(text)) return 'Kurti & Tunics';
  if (/abaya|borka|burqa|বোরকা|আবায়া/i.test(text)) return 'Abaya & Borka';
  if (/hijab|dupatta|scarf|হিজাব|ওড়না|দোপাট্টা/i.test(text)) return 'Dupatta & Hijab';

  // Accessories
  if (/watch|timepiece|chronograph|ঘড়ি|ঘরি/i.test(text)) return 'Watches';
  if (/sunglass|sunglasses|eyewear|glasses|সানগ্লাস|চশমা/i.test(text)) return 'Eyewear / Sunglasses';
  if (/bag|crossbody|handbag|backpack|tote|clutch|ব্যাগ|wallet|মানিব্যাগ|ওয়ালেট/i.test(text)) return 'Bags & Wallets';
  if (/perfume|attar|fragrance|itar|সুগন্ধি|আতর|পারফিউম/i.test(text)) return 'Perfume & Attar';
  if (/belt|leather belt|বেল্ট/i.test(text)) return 'Belts & Leather';
  if (/jewelry|jewellery|necklace|earring|bracelet|ring|গহনা/i.test(text)) return 'Jewelry';

  // Western & Casual Wear
  if (/polo|পোলো/i.test(text)) return 'Polo';
  if (/hoodie|sweatshirt|fleece|হুডি/i.test(text)) return 'Hoodies & Sweatshirts';
  if (/t-shirt|tshirt|tee|টি-শার্ট|টি শার্ট/i.test(text)) return 'T-Shirts';
  if (/pant|pants|trouser|trousers|chino|denim|jeans|palazzo|প্যান্ট|ট্রাউজার|পালাজো/i.test(text)) {
    return cat === 'women' ? 'Pants & Palazzo' : 'Pants & Trousers';
  }
  if (/shirt|button-down|linen shirt|শার্ট/i.test(text)) {
    return cat === 'women' ? 'Tops & Shirts' : 'Shirts';
  }

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

  // Filter products belonging to this category
  const targetProducts = isAll
    ? products
    : products.filter(
        (p) => (p.categoryName || '').trim().toLowerCase() === normCat.toLowerCase()
      );

  // Collect predefined subcategories for this category
  const standardList = (!isAll && SUBCATEGORIES_BY_CATEGORY[normCat]) || [];
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
      nameBn: 'সব ধরন',
      count: targetProducts.length,
    },
  ];

  // Add standard subcategories that have products, or first standard ones
  standardList.forEach((s) => {
    const count = countsMap.get(s.name.toLowerCase()) || 0;
    options.push({
      name: s.name,
      nameBn: s.nameBn,
      count,
    });
  });

  // Add any custom subcategories discovered from products
  countsMap.forEach((count, key) => {
    if (!standardNameSet.has(key) && key !== 'all' && key !== 'general') {
      const meta = subcategoryMetaMap.get(key);
      if (meta) {
        options.push({
          name: meta.name,
          nameBn: meta.nameBn,
          count,
        });
      }
    }
  });

  // If there are general items, append General at the end if count > 0
  const generalCount = countsMap.get('general') || 0;
  if (generalCount > 0 && !standardNameSet.has('general')) {
    options.push({
      name: 'General',
      nameBn: 'অন্যান্য',
      count: generalCount,
    });
  }

  return options;
}
