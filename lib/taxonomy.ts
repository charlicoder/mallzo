// Storefront menu. Slugs must match productapi/catalog/taxonomy.py; names live in lib/i18n.ts.
export type SubCategory = { slug: string; icon?: string };
export type MenuCategory = { slug: string; subs: SubCategory[] };

export const MENU: MenuCategory[] = [
  {
    slug: "apparel",
    subs: ["suiting-blazers", "sweaters-cardigans", "tops-tees-blouses", "clothing", "pullovers"].map((slug) => ({ slug })),
  },
  {
    slug: "footwear-bags",
    subs: ["womens-shoes", "sneakers-sports", "boots", "handbags", "luxury-bags", "travel-bags", "backpacks"].map((slug) => ({ slug })),
  },
  {
    slug: "beauty-health",
    subs: [
      { slug: "skincare", icon: "🧴" },
      { slug: "makeup", icon: "💄" },
      { slug: "hair-care", icon: "💇" },
      { slug: "fragrance", icon: "🌸" },
      { slug: "vitamins-supplements", icon: "💊" },
      { slug: "personal-care", icon: "🧼" },
      { slug: "wellness", icon: "🧘" },
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
