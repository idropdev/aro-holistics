// Content ported from aroholisticsshop.com — display-only, no commerce.
import kleanMakrosImg from "../assets/klean_makros.jpg";
import lionsManeChocolateImg from "../assets/lions_mane_chocolate.webp";
import restBlendImg from "../assets/rest_blend.webp";

export type ShelfCategory = "Juice" | "Mushrooms" | "Snacks" | "Supplements" | "Other";

export interface ShelfProduct {
  id: string;
  name: string;
  price: string; // display label only — no purchase mechanics
  unit: string;
  category: ShelfCategory;
  maker?: string;
  description: string;
  ingredients?: string[];
  image: string;
}

export const WELLNESS_PRODUCTS: ShelfProduct[] = [
  {
    id: "klean-makros",
    name: "Klean Makros Juice",
    price: "$7.00",
    unit: "bottle",
    category: "Juice",
    description:
      "Cold-pressed with apple, pear, celery, aloe vera, kale, BCAAs, peppermint, cucumber, pomegranate, lemon, diuretic herbs, rainbow chard and inulin.",
    ingredients: [
      "Apple", "Pear", "Celery", "Aloe Vera", "Kale", "BCAAs", "Peppermint",
      "Cucumber", "Pomegranate", "Lemon", "Diuretic Herbs", "Rainbow Chard", "Inulin"
    ],
    image: kleanMakrosImg
  },
  {
    id: "lions-mane-chocolate",
    name: "Lion's Mane Chocolate Bar",
    price: "$5.00",
    unit: "unit",
    category: "Mushrooms",
    maker: "El Paso Mushroom Co.",
    description:
      "Hand-made cacao bars with freeze-dried Lion's Mane mushrooms (5g per bar), ethically sourced cacao from Chiapas, Mexico.",
    ingredients: ["Cacao (Chiapas, MX)", "Freeze-dried Lion's Mane (5g/bar)"],
    image: lionsManeChocolateImg
  },
  {
    id: "rest-blend",
    name: "Rest Blend Capsules: Reishi + Ashwagandha",
    price: "$25.00",
    unit: "unit",
    category: "Mushrooms",
    maker: "El Paso Mushroom Co.",
    description:
      "100% Reishi fruiting body + organic Ashwagandha root extract. 500mg capsules, 20 servings. Certified organic, gluten-free, non-GMO, vegan.",
    ingredients: ["Reishi fruiting body", "Organic Ashwagandha root extract"],
    image: restBlendImg
  }
];

export interface Maker {
  name: string;
  category: string;
  location: string;
  /** NOTE: only El Paso Mushroom Co.'s bio is from the client site — the rest are placeholder blurbs to replace with real bios. */
  description: string;
  /** Verified handle without @ — omit until the client confirms the real account */
  instagram?: string;
  itemsOnShelf?: number;
}

export const MAKERS: Maker[] = [
  {
    name: "El Paso Mushroom Co.",
    category: "Functional mushrooms",
    location: "El Paso, TX",
    description:
      "Founded by Maximilian and Aixarret, El Paso Mushroom Co. grows functional, health-boosting fungi rooted in local agriculture. Through thoughtful cultivation and hands-on workshops, they're leading El Paso's mushroom education movement — with freshness, quality, and soul at the root of everything they do.",
    instagram: "elpasomushroom",
    itemsOnShelf: 2
  },
  {
    name: "OG Farms",
    category: "Produce",
    location: "Borderland",
    description: "Local grower supplying seasonal, sun-grown produce for the freshest possible presses."
  },
  {
    name: "The Healthy Peach 915",
    category: "Food",
    location: "El Paso, TX",
    description: "El Paso kitchen crafting wholesome, health-forward foods for the borderland community."
  },
  {
    name: "By Create & Design",
    category: "Wellness",
    location: "Borderland",
    description: "Hand-crafted wellness goods made with intention, one small batch at a time."
  },
  {
    name: "Alchemy Labs",
    category: "Wellness",
    location: "Borderland",
    description: "Small-batch wellness formulations blending modern science with traditional botanicals."
  },
  {
    name: "Amara Sea Moss",
    category: "Botanicals",
    location: "Borderland",
    description: "Wildcrafted sea moss and botanical preparations, sourced and prepared with care."
  },
  {
    name: "Aum Chanti",
    category: "Botanicals",
    location: "Borderland",
    description: "Botanical goods rooted in mindful, holistic living."
  },
  {
    name: "Dei Amore Coffee & Loose Leaf Tea",
    category: "Food",
    location: "Borderland",
    description: "Thoughtfully sourced coffee and loose leaf teas for slow mornings."
  },
  {
    name: "Cacao Coyatoc",
    category: "Cacao",
    location: "Borderland",
    description: "Traditional cacao, ethically sourced and prepared in the old way."
  }
];

export const TICKER_ITEMS = [
  "Pressed daily",
  "Sun-grown produce",
  "Bottle returns welcome",
  "No sugar added",
  "Same-day from the borderland",
  "Refrigerated end-to-end"
];

export const PILLARS = [
  {
    number: "01",
    title: "Cold-pressed, never heated",
    body: "Hydraulic press extraction preserves enzymes, vitamins, and the live phytonutrients that flash pasteurization wipes out."
  },
  {
    number: "02",
    title: "Local & curated",
    body: "Produce sourced from El Paso growers when in season; partner brands hand-picked, never paid placement."
  },
  {
    number: "03",
    title: "Same-day bottled",
    body: "Pressed and bottled the morning of pickup so what you drink is what we just made — not what shipped weeks ago."
  }
];
