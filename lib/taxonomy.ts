// Storefront menu. Slugs must match productapi/catalog/taxonomy.py; names live in lib/i18n.ts.
export type SubCategory = { slug: string; icon?: string };
// `hidden` keeps a category out of the menu, home rows and sitemap while its page still works. Remove the flag to bring it back.
export type MenuCategory = { slug: string; subs: SubCategory[]; hidden?: boolean };

const ALL: MenuCategory[] = [
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
      { slug: "wellness", icon: "🧘" },
      { slug: "fitness-recovery", icon: "🏋️" },
    ],
  },
  {
    slug: "home-living",
    hidden: true,
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

export const MENU = ALL.filter((c) => !c.hidden);
export const findCategory = (slug: string) => ALL.find((c) => c.slug === slug);
