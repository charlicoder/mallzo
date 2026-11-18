// Storefront menu. Slugs must match productapi/catalog/taxonomy.py; names live in lib/i18n.ts.
export type SubCategory = { slug: string; icon?: string };
export type MenuCategory = { slug: string; subs: SubCategory[] };

export const MENU: MenuCategory[] = [
  {
    slug: "apparel",
    subs: ["suiting-blazers", "sweaters-cardigans", "tops-tees-blouses", "clothing", "pullovers"].map((slug) => ({ slug })),
  },
  {
    slug: "footwear",
    subs: [
      { slug: "womens-shoes", icon: "👠" },
      { slug: "sneakers-sports", icon: "👟" },
      { slug: "boots", icon: "🥾" },
      { slug: "heels-pumps", icon: "👡" },
      { slug: "flats-loafers", icon: "🥿" },
      { slug: "sandals-slippers", icon: "🩴" },
    ],
  },
  {
    slug: "handbags",
    subs: [
      { slug: "tote-shoulder", icon: "👜" },
      { slug: "crossbody", icon: "🎒" },
      { slug: "clutches-wallets", icon: "👛" },
      { slug: "luxury-bags", icon: "💎" },
      { slug: "travel-bags", icon: "🧳" },
      { slug: "backpacks", icon: "🎒" },
    ],
  },
  {
    slug: "beauty-skincare",
    subs: [
      { slug: "skincare", icon: "🧴" },
      { slug: "makeup", icon: "💄" },
      { slug: "hair-care", icon: "💇" },
      { slug: "fragrance", icon: "🌸" },
      { slug: "nail-care", icon: "💅" },
      { slug: "bath-body", icon: "🛁" },
    ],
  },
  {
    slug: "health-care",
    subs: [
      { slug: "vitamins-supplements", icon: "💊" },
      { slug: "personal-care", icon: "🧼" },
      { slug: "oral-care", icon: "🦷" },
      { slug: "wellness", icon: "🧘" },
      { slug: "medical-first-aid", icon: "🩺" },
      { slug: "fitness-recovery", icon: "🏋️" },
    ],
  },
  {
    slug: "home-living",
    subs: [
      { slug: "kitchen-dining", icon: "🍳" },
      { slug: "bedding-bath", icon: "🛏️" },
      { slug: "decor", icon: "🪴" },
      { slug: "furniture", icon: "🛋️" },
      { slug: "storage-organization", icon: "🧺" },
      { slug: "lighting", icon: "💡" },
      { slug: "garden-outdoor", icon: "🌿" },
    ],
  },
];

export const findCategory = (slug: string) => MENU.find((c) => c.slug === slug);
