// Localization data for ARO Holistics
import kleanMakrosImg from "../assets/klean_makros.jpg";
import lionsManeChocolateImg from "../assets/lions_mane_chocolate.webp";
import restBlendImg from "../assets/rest_blend.webp";

import beetFogImg from "../assets/beet_fog.jpg";
import bellaVeraImg from "../assets/bella_vera.jpg";
import morningDewImg from "../assets/morning_dew.jpg";
import toxinPunchImg from "../assets/toxin_punch.jpg";
import wakeMeUpImg from "../assets/wake_me_up.jpg";
import fitLatinaImg from "../assets/fit_latina.jpg";

export type ShelfCategory = "Juice" | "Mushrooms" | "Snacks" | "Supplements" | "Other";

export interface ShelfProduct {
  id: string;
  name: string;
  price: string;
  unit: string;
  category: ShelfCategory;
  maker?: string;
  description: string;
  ingredients?: string[];
  image: string;
}

export interface Maker {
  name: string;
  category: string;
  location: string;
  description: string;
  instagram?: string;
  itemsOnShelf?: number;
}

export interface Juice {
  id: string;
  name: string;
  tagline: string;
  colorClass: string;
  bgGradient: string;
  ingredients: string[];
  benefits: string[];
  stats: { label: string; value: string }[];
  target: string;
  image: string;
}

export interface Review {
  author: string;
  rating: number;
  text: string;
  source: string;
  tag: string;
  url?: string;
}

// ---------------- ENGLISH DATASETS ----------------
export const WELLNESS_PRODUCTS_EN: ShelfProduct[] = [
  {
    id: "klean-makros",
    name: "Klean Makros Juice",
    price: "$7.00",
    unit: "bottle",
    category: "Juice",
    description: "Cold-pressed with apple, pear, celery, aloe vera, kale, BCAAs, peppermint, cucumber, pomegranate, lemon, diuretic herbs, rainbow chard and inulin.",
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
    description: "Hand-made cacao bars with freeze-dried Lion's Mane mushrooms (5g per bar), ethically sourced cacao from Chiapas, Mexico.",
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
    description: "100% Reishi fruiting body + organic Ashwagandha root extract. 500mg capsules, 20 servings. Certified organic, gluten-free, non-GMO, vegan.",
    ingredients: ["Reishi fruiting body", "Organic Ashwagandha root extract"],
    image: restBlendImg
  }
];

export const MAKERS_EN: Maker[] = [
  {
    name: "El Paso Mushroom Co.",
    category: "Functional mushrooms",
    location: "El Paso, TX",
    description: "Founded by Maximilian and Aixarret, El Paso Mushroom Co. grows functional, health-boosting fungi rooted in local agriculture. Through thoughtful cultivation and hands-on workshops, they're leading El Paso's mushroom education movement — with freshness, quality, and soul at the root of everything they do.",
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

export const TICKER_ITEMS_EN = [
  "Pressed daily",
  "Sun-grown produce",
  "Bottle returns welcome",
  "No sugar added",
  "Same-day from the borderland",
  "Refrigerated end-to-end"
];

export const PILLARS_EN = [
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

export const JUICES_DATA_EN: Juice[] = [
  {
    id: "beet-fog",
    name: "Beet Fog",
    tagline: "Mental Clarity & Cardiovascular Oxygenation",
    colorClass: "text-rose-400 border-rose-500/20",
    bgGradient: "from-rose-950 to-purple-950",
    ingredients: ["Romaine", "Apple", "Cucumber", "Beets", "Lemon", "Lion's Mane", "Ashwagandha"],
    benefits: ["Enhances memory & cognitive speed", "Increases nitric oxide blood flow", "Reduces chronic mental fatigue"],
    stats: [
      { label: "Enzymes", value: "100% Active" },
      { label: "Oxygenation", value: "96%" },
      { label: "Focus", value: "94%" }
    ],
    target: "Brain Function & Blood Flow",
    image: beetFogImg
  },
  {
    id: "bella-vera",
    name: "Bella Vera",
    tagline: "Gastric Rejuvenation & Deep Cellular Hydration",
    colorClass: "text-emerald-400 border-emerald-500/20",
    bgGradient: "from-teal-900 to-emerald-950",
    ingredients: ["Aloe Vera", "Honeydew Melon", "Lime", "Coconut", "Fennel"],
    benefits: ["Soothes digestive gut lining", "Boosts liver detoxification", "Supports premium skin elasticity"],
    stats: [
      { label: "Enzymes", value: "100% Active" },
      { label: "Hydration", value: "98%" },
      { label: "Hepatic", value: "92%" }
    ],
    target: "Gut & Skin Rejuvenation",
    image: bellaVeraImg
  },
  {
    id: "morning-dew",
    name: "Morning Dew",
    tagline: "Alkalizing Immune Defense & Bone Strength",
    colorClass: "text-green-400 border-green-500/20",
    bgGradient: "from-emerald-950 to-green-900",
    ingredients: ["Celery", "Spinach", "Green Apple", "Ginger", "Cucumber", "Mint", "Ashwagandha"],
    benefits: ["Alkalizes blood pH metrics", "Promotes bone cellular density", "Reduces biological stress markers"],
    stats: [
      { label: "Enzymes", value: "100% Active" },
      { label: "Immunity", value: "95%" },
      { label: "Stress", value: "90%" }
    ],
    target: "Immunity & Bone Health",
    image: morningDewImg
  },
  {
    id: "toxin-punch",
    name: "Toxin Punch",
    tagline: "Hepatic Purification & Circulation Acceleration",
    colorClass: "text-lime-400 border-lime-500/20",
    bgGradient: "from-lime-900 to-emerald-950",
    ingredients: ["Green Apple", "Celery", "Fresh Herbs", "Ginger", "Ginseng", "Ashwagandha", "Maca"],
    benefits: ["Purifies liver toxins", "Accelerates blood circulation", "Fights daily cellular fatigue"],
    stats: [
      { label: "Enzymes", value: "100% Active" },
      { label: "Detox", value: "97%" },
      { label: "Circulation", value: "92%" }
    ],
    target: "Liver Detox & Circulation",
    image: toxinPunchImg
  },
  {
    id: "wake-me-up",
    name: "Wake Me Up",
    tagline: "Probiotic Thermogenic Activation & Anti-Inflammatory Energy",
    colorClass: "text-amber-400 border-amber-500/20",
    bgGradient: "from-amber-850 to-orange-950",
    ingredients: ["Lemon", "Pineapple", "Mango", "Ginger", "Green Apple", "Celery", "Cayenne", "Coconut", "Vitamin B12", "Probiotics"],
    benefits: ["Ignites metabolic rate", "Soothes joint inflammation", "Supplies direct probiotic gut health"],
    stats: [
      { label: "Enzymes", value: "100% Active" },
      { label: "Energy", value: "99%" },
      { label: "Probiotics", value: "96%" }
    ],
    target: "Thermogenic Energy & Joints",
    image: wakeMeUpImg
  },
  {
    id: "fit-latina",
    name: "Fit Latina Lemonade",
    tagline: "Electrolyte Replenishment & BCAAs Muscular Recovery",
    colorClass: "text-pink-400 border-pink-500/20",
    bgGradient: "from-rose-800 to-pink-950",
    ingredients: ["Dragon Fruit", "Strawberry", "Pineapple", "Lemon", "Kale", "Spinach", "Rainbow Chard"],
    benefits: ["Restores active electrolytes", "Assists muscular synthesis with BCAAs", "Boosts metabolic oxygen uptake"],
    stats: [
      { label: "Enzymes", value: "100% Active" },
      { label: "BCAAs", value: "98%" },
      { label: "Electrolytes", value: "95%" }
    ],
    target: "Workout Performance & Repair",
    image: fitLatinaImg
  }
];

export const REVIEWS_DATA_EN: Review[] = [
  {
    author: "Elsa Bustillos",
    rating: 5,
    text: "If you haven't tried AroHolistics Juices yet, you are missing out!! I'm telling you, these are not any regular old juices. These juices are LIFE✨❤️ Cold pressed and fresh off the press, Every single one I have tried is an absolute Banger fr!! Monday special has me in a chokehold 😮‍💨 in the best way possible of course 😅 Give them a try and you'll see what I mean✨🙌",
    source: "El Paso, TX",
    tag: "Weekly Regular"
  },
  {
    author: "Taylor Short",
    rating: 5,
    text: "Love working with ARO Holistics. Alex is super knowledgeable on every juice and makes them custom to your needs. I've done two juice cleanses with these products and saw amazing results every time. All juices are loaded with nutritious ingredients and taste even better. Will definitely purchase again.",
    source: "El Paso, TX",
    tag: "Juice Cleanses"
  },
  {
    author: "N \"Vee\" Cubillos",
    rating: 5,
    text: "These juices are magic in a bottle ! The love poured into each recipe is definitely worth the travel for me, BUT when I can't the option for delivery is AWESOME! Alex goes over & beyond and treats his customers like close friends. Thee kindness, dedication, knowledge, and approachable energy is forever unmatched.",
    source: "El Paso, TX",
    tag: "Delivery & Service"
  }
];

// ---------------- SPANISH DATASETS ----------------
export const WELLNESS_PRODUCTS_ES: ShelfProduct[] = [
  {
    id: "klean-makros",
    name: "Jugo Klean Makros",
    price: "$7.00",
    unit: "botella",
    category: "Juice",
    description: "Prensado en frío con manzana, pera, apio, sábila, col rizada, BCAAs, menta, pepino, granada, limón, hierbas diuréticas, acelga arcoíris e inulina.",
    ingredients: [
      "Manzana", "Pera", "Apio", "Sábila (Aloe Vera)", "Col Rizada (Kale)", "BCAAs", "Menta",
      "Pepino", "Granada", "Limón", "Hierbas Diuréticas", "Acelga Arcoíris", "Inulina"
    ],
    image: kleanMakrosImg
  },
  {
    id: "lions-mane-chocolate",
    name: "Barra de Chocolate con Melena de León",
    price: "$5.00",
    unit: "unidad",
    category: "Mushrooms",
    maker: "El Paso Mushroom Co.",
    description: "Barras de cacao hechas a mano con hongos Melena de León liofilizados (5 g por barra), cacao de comercio justo de Chiapas, México.",
    ingredients: ["Cacao (Chiapas, MX)", "Melena de León liofilizada (5g/barra)"],
    image: lionsManeChocolateImg
  },
  {
    id: "rest-blend",
    name: "Cápsulas Mezcla de Descanso: Reishi + Ashwagandha",
    price: "$25.00",
    unit: "unidad",
    category: "Mushrooms",
    maker: "El Paso Mushroom Co.",
    description: "100% cuerpo fructífero de Reishi + extracto de raíz de Ashwagandha orgánica. Cápsulas de 500 mg, 20 porciones. Certificado orgánico, sin gluten, sin OGM, vegano.",
    ingredients: ["Cuerpo fructífero de Reishi", "Extracto orgánico de raíz de Ashwagandha"],
    image: restBlendImg
  }
];

export const MAKERS_ES: Maker[] = [
  {
    name: "El Paso Mushroom Co.",
    category: "Hongos funcionales",
    location: "El Paso, TX",
    description: "Fundada por Maximilian y Aixarret, El Paso Mushroom Co. cultiva hongos funcionales que mejoran la salud, arraigados en la agricultura local. A través de un cultivo consciente y talleres prácticos, están liderando el movimiento de educación sobre hongos en El Paso, con frescura, calidad y alma en el centro de todo lo que hacen.",
    instagram: "elpasomushroom",
    itemsOnShelf: 2
  },
  {
    name: "OG Farms",
    category: "Frutas y verduras",
    location: "Frontera",
    description: "Productor local que suministra frutas y verduras de temporada cultivadas al sol para obtener los prensados más frescos posibles."
  },
  {
    name: "The Healthy Peach 915",
    category: "Alimentos",
    location: "El Paso, TX",
    description: "Cocina de El Paso que elabora alimentos saludables y nutritivos para la comunidad de la frontera."
  },
  {
    name: "By Create & Design",
    category: "Bienestar",
    location: "Frontera",
    description: "Productos de bienestar hechos a mano con intención, un lote pequeño a la vez."
  },
  {
    name: "Alchemy Labs",
    category: "Bienestar",
    location: "Frontera",
    description: "Formulaciones de bienestar en lotes pequeños que combinan la ciencia moderna con la botánica tradicional."
  },
  {
    name: "Amara Sea Moss",
    category: "Botánica",
    location: "Frontera",
    description: "Musgo marino silvestre y preparaciones botánicas, obtenidos y preparados con cuidado."
  },
  {
    name: "Aum Chanti",
    category: "Botánica",
    location: "Frontera",
    description: "Productos botánicos arraigados en una vida consciente y holística."
  },
  {
    name: "Dei Amore Coffee & Loose Leaf Tea",
    category: "Alimentos",
    location: "Frontera",
    description: "Café y tés de hoja suelta obtenidos conscientemente para mañanas tranquilas."
  },
  {
    name: "Cacao Coyatoc",
    category: "Cacao",
    location: "Frontera",
    description: "Cacao tradicional, obtenido éticamente y preparado a la manera antigua."
  }
];

export const TICKER_ITEMS_ES = [
  "Prensado diariamente",
  "Cultivado al sol",
  "Se aceptan devoluciones de botellas",
  "Sin azúcar añadida",
  "El mismo día desde la frontera",
  "Refrigerado de principio a fin"
];

export const PILLARS_ES = [
  {
    number: "01",
    title: "Prensado en frío, nunca calentado",
    body: "La extracción por prensa hidráulica conserva enzimas, vitaminas y fitonutrientes vivos que la pasteurización rápida elimina."
  },
  {
    number: "02",
    title: "Local y seleccionado",
    body: "Ingredientes de productores de El Paso cuando están en temporada; marcas socias seleccionadas a mano, nunca por pago."
  },
  {
    number: "03",
    title: "Embotellado el mismo día",
    body: "Prensado y embotellado la mañana de la entrega para que bebas algo recién hecho, no algo enviado hace semanas."
  }
];

export const JUICES_DATA_ES: Juice[] = [
  {
    id: "beet-fog",
    name: "Beet Fog",
    tagline: "Claridad Mental y Oxigenación Cardiovascular",
    colorClass: "text-rose-400 border-rose-500/20",
    bgGradient: "from-rose-950 to-purple-950",
    ingredients: ["Lechuga Romana", "Manzana", "Pepino", "Betabel", "Limón", "Melena de León", "Ashwagandha"],
    benefits: ["Mejora la memoria y la velocidad cognitiva", "Aumenta el flujo sanguíneo de óxido nítrico", "Reduce la fatiga mental crónica"],
    stats: [
      { label: "Enzimas", value: "100% Activa" },
      { label: "Oxigenación", value: "96%" },
      { label: "Enfoque", value: "94%" }
    ],
    target: "Función Cerebral y Flujo Sanguíneo",
    image: beetFogImg
  },
  {
    id: "bella-vera",
    name: "Bella Vera",
    tagline: "Rejuvenecimiento Gástrico e Hidratación Celular Profunda",
    colorClass: "text-emerald-400 border-emerald-500/20",
    bgGradient: "from-teal-900 to-emerald-950",
    ingredients: ["Sábila (Aloe Vera)", "Melón Valeciano (Honeydew)", "Limón Verde", "Coco", "Hinojo"],
    benefits: ["Calma el revestimiento del sistema digestivo", "Impulsa la desintoxicación del hígado", "Favorece una elasticidad premium de la piel"],
    stats: [
      { label: "Enzimas", value: "100% Activa" },
      { label: "Hidratación", value: "98%" },
      { label: "Hepático", value: "92%" }
    ],
    target: "Rejuvenecimiento de Intestino y Piel",
    image: bellaVeraImg
  },
  {
    id: "morning-dew",
    name: "Morning Dew",
    tagline: "Defensa Inmunológica Alcalinizante y Fuerza Ósea",
    colorClass: "text-green-400 border-green-500/20",
    bgGradient: "from-emerald-950 to-green-900",
    ingredients: ["Apio", "Espinaca", "Manzana Verde", "Jengibre", "Pepino", "Menta", "Ashwagandha"],
    benefits: ["Alcaliniza las métricas de pH en sangre", "Promueve la densidad celular ósea", "Reduce los marcadores de estrés biológico"],
    stats: [
      { label: "Enzimas", value: "100% Activa" },
      { label: "Inmunidad", value: "95%" },
      { label: "Estrés", value: "90%" }
    ],
    target: "Inmunidad y Salud Ósea",
    image: morningDewImg
  },
  {
    id: "toxin-punch",
    name: "Toxin Punch",
    tagline: "Purificación Hepática y Aceleración de la Circulación",
    colorClass: "text-lime-400 border-lime-500/20",
    bgGradient: "from-lime-900 to-emerald-950",
    ingredients: ["Manzana Verde", "Apio", "Hierbas Frescas", "Jengibre", "Ginseng", "Ashwagandha", "Maca"],
    benefits: ["Purifica las toxinas del hígado", "Acelera la circulación sanguínea", "Combate la fatiga celular diaria"],
    stats: [
      { label: "Enzimas", value: "100% Activa" },
      { label: "Desintoxicación", value: "97%" },
      { label: "Circulación", value: "92%" }
    ],
    target: "Desintoxicación de Hígado y Circulación",
    image: toxinPunchImg
  },
  {
    id: "wake-me-up",
    name: "Wake Me Up",
    tagline: "Activación Termogénica Probiótica y Energía Antiinflamatoria",
    colorClass: "text-amber-400 border-amber-500/20",
    bgGradient: "from-amber-850 to-orange-950",
    ingredients: ["Limón", "Piña", "Mango", "Jengibre", "Manzana Verde", "Apio", "Cayena", "Coco", "Vitamina B12", "Probióticos"],
    benefits: ["Enciende el ritmo metabólico", "Alivia la inflamación de las articulaciones", "Aporta salud intestinal probiótica directa"],
    stats: [
      { label: "Enzimas", value: "100% Activa" },
      { label: "Energía", value: "99%" },
      { label: "Probióticos", value: "96%" }
    ],
    target: "Energía Termogénica y Articulaciones",
    image: wakeMeUpImg
  },
  {
    id: "fit-latina",
    name: "Fit Latina Lemonade",
    tagline: "Reposición de Electrólitos y Recuperación Muscular con BCAAs",
    colorClass: "text-pink-400 border-pink-500/20",
    bgGradient: "from-rose-800 to-pink-950",
    ingredients: ["Fruta del Dragón (Pitahaya)", "Fresa", "Piña", "Limón", "Col Rizada (Kale)", "Espinaca", "Acelga Arcoíris"],
    benefits: ["Restablece los electrólitos activos", "Ayuda a la síntesis muscular con BCAAs", "Aumenta la absorción metabólica de oxígeno"],
    stats: [
      { label: "Enzimas", value: "100% Activa" },
      { label: "BCAAs", value: "98%" },
      { label: "Electrólitos", value: "95%" }
    ],
    target: "Rendimiento Deportivo y Recuperación",
    image: fitLatinaImg
  }
];

export const REVIEWS_DATA_ES: Review[] = [
  {
    author: "Elsa Bustillos",
    rating: 5,
    text: "¡Si aún no has probado los jugos de AroHolistics, te lo estás perdiendo!! Te lo digo, estos no son jugos comunes y corrientes. ¡Estos jugos son VIDA✨❤️ Prensados en frío y recién hechos, cada uno que he probado es una delicia total!! ¡El especial del lunes me tiene fascinada 😮‍💨 de la mejor manera posible, por supuesto 😅 Pruébalos y verás a qué me refiero✨🙌",
    source: "El Paso, TX",
    tag: "Cliente Frecuente"
  },
  {
    author: "Taylor Short",
    rating: 5,
    text: "Me encanta colaborar con ARO Holistics. Alex es súper conocedor de cada jugo y los personaliza según tus necesidades. He hecho dos limpiezas con jugos con estos productos y he visto resultados increíbles cada vez. Todos los jugos están llenos de ingredientes nutritivos y saben aún mejor. Definitivamente volveré a comprar.",
    source: "El Paso, TX",
    tag: "Limpieza con Jugos"
  },
  {
    author: "N \"Vee\" Cubillos",
    rating: 5,
    text: "¡Estos jugos son magia en una botella! El amor vertido en cada receta definitivamente hace que valga la pena el viaje para mí, pero cuando no puedo, ¡la opción de entrega a domicilio es INCREÍBLE! Alex va más allá y trata a sus clientes como amigos cercanos. Su amabilidad, dedicación, conocimiento y energía accesible son inigualables.",
    source: "El Paso, TX",
    tag: "Entrega y Servicio"
  }
];

// ---------------- UI TRANSLATIONS ----------------
export const uiTranslations = {
  en: {
    // Nav
    "nav.shop": "Shop",
    "nav.blends": "Our Blends",
    "nav.makers": "Makers",
    "nav.locations": "Find Us",
    "nav.events": "Events",
    "nav.story": "Story",
    
    // Header & Modal CTA
    "btn.assessment": "Get Free Assessment",
    "btn.phone": "(915) 255-8624",
    "btn.smsCall": "SMS or Call: (915) 255-8624",
    
    // Hero
    "hero.badge": "Cold-Pressed. Science-Backed. Tailored to You.",
    "hero.heading": "Real food, slow-pressed, by hand.",
    "hero.description": "El Paso's first holistic cold pressed juicery — nutrient-dense recipes, holistic locals, and community wellness.",
    "hero.cta.press": "Shop this week's press",
    "hero.cta.makers": "Meet our makers",
    "hero.hint": "Psst — try slicing a fruit",
    
    // Story Strip
    "story.heading": "Fresh juice, honest sourcing.",
    "story.description": "ARO Holistics started with a simple idea: bring nutrient-dense, freshly cold-pressed juices to El Paso without compromise on sourcing or process. Every batch is pressed locally, never heat-pasteurized, and bottled the same day.",
    "story.cta": "Read the full story",
    
    // About Section
    "about.badge": "Our Roots",
    "about.heading": "About Aro Holistics",
    "about.desc": "ARO Holistics doesn't do basic juice. Every recipe is crafted with intention — blending nutritional science and therapeutic ingredients so your money actively invests in your health, your environment, and your community.",
    "about.prev.title": "Preventative nutrition, by design",
    "about.prev.body": "Rooted in preventative nutrition and nutritional therapy, our juices are designed to do more than refresh — they're formulated to help protect your body and support the reversal of modern lifestyle diseases. With nearly a decade of clinical nutrition-based juicing experience, we've created 133+ unique, fully customizable recipes, each one built with a specific health purpose in mind.",
    "about.f1.title": "5+ whole-food ingredients",
    "about.f1.body": "Globally and locally sourced. Many blends feature botanical medicine, locally grown functional mushrooms, and wildcrafted local sea moss for added functional benefits.",
    "about.f2.title": "Under 125 cal per serving",
    "about.f2.body": "Under 30g of naturally occurring fructose per serving, with diabetic-friendly options available. Generously sized at 16+ oz per bottle.",
    "about.f3.title": "FDA-compliant production",
    "about.f3.body": "Produced using commercial-grade juicing equipment in a licensed, FDA-compliant kitchen, bottled in BPA-free, non-leaching containers.",
    "about.f4.title": "Supporting local",
    "about.f4.body": "Supporting local farmers and small businesses along the way — because community health starts with community investment.",
    "about.visit.title": "Visit the shop",
    "about.visit.note": "Walk-ins welcome · Special orders · Tailored packages · Rare local holistic products",
    "about.hours.title": "Hours",
    "about.hours.weekdays": "Mon – Fri",
    "about.hours.weekends": "Sat – Sun",
    "about.hours.profile": "Discover your custom nutrient profile",
    "about.closing.title": "Every juice has a purpose.",
    "about.closing.body": "We're proud to be your trusted local holistic.",
    
    // Scientific Formulations (Juices)
    "juices.badge": "Formulated Blends",
    "juices.heading": "Our Scientific Formulations",
    "juices.subheading": "Raw, organic ingredients compressed under hydraulic force. Restoring vitality at the cellular level.",
    "juices.select": "Select Formulation",
    "juices.prev": "Previous Blend",
    "juices.next": "Next Blend",
    "juices.hud": "Bio-Enzymatic HUD Metrics",
    "juices.components": "Formula Bio-Components",
    "juices.order": "Order Formulation",
    "juices.clinical": "Clinical Breakdown",
    "juices.quickView": "Quick View",
    "juices.activeBio": "Active Bio-Mix",
    "juices.target": "Active System Target",
    
    // Weekly Press
    "press.badge": "This Week's Press",
    "press.heading": "Fresh from the press.",
    "press.subtext": "Highlights from our cold-pressed line and wellness favorites. Hover to learn more.",
    "press.cta": "View all products",
    
    // Shelf
    "shelf.badge": "Shop the Shelf",
    "shelf.heading": "The full shelf.",
    "shelf.subtext": "Cold-pressed juices, mushrooms, snacks, supplements, and more — ready for pickup at our partner locations in El Paso.",
    "shelf.empty": "Nothing on this shelf yet — check back after the next press.",
    
    // Categories
    "cat.All": "All",
    "cat.Juice": "Juice",
    "cat.Mushrooms": "Mushrooms",
    "cat.Snacks": "Snacks",
    "cat.Supplements": "Supplements",
    "cat.Other": "Other",
    
    // Product Detail
    "prod.by": "by",
    "prod.ingredients": "Ingredients",
    "prod.availability": "Ask about availability",
    
    // Bottle Modal
    "bottle.profile": "Formulation Profile",
    "bottle.ingredients": "Full Ingredients",
    "bottle.targets": "Clinical Health Targets",
    "bottle.order": "Order from Distributor",
    
    // Reviews
    "reviews.badge": "Real Testimonials",
    "reviews.heading": "Quiet, steady love.",
    "reviews.subtext": "We don't run loyalty programs. We just remember.",
    
    // Partners
    "partners.badge": "Makers & Partners",
    "partners.heading": "A small circle of makers.",
    "partners.subtext": "The shelves are filled by people we know by first name. Small operations from across the borderland.",
    "partners.items": "items on shelf",
    
    // Locations
    "loc.badge": "Find Us",
    "loc.heading": "Find our holistic cold pressed juices.",
    "loc.subtext": "Pickup spots around El Paso · Call (915) 255-8624",
    "loc.navigate": "Navigate on Maps",
    
    // Events
    "events.badge": "Events",
    "events.heading": "Pop-ups, cleanses & workshops.",
    "events.empty": "Nothing on the calendar right now — check back soon.",
    "events.subtext": "Follow @aro_holistics for pop-up announcements.",
    
    // Footer
    "footer.desc": "A cold-pressed juicery + curated wellness shop in El Paso, TX.",
    "footer.visit.title": "Visit",
    "footer.visit.locations": "Our locations",
    "footer.visit.events": "Events",
    "footer.visit.partners": "Our partners",
    "footer.about.title": "About",
    "footer.about.story": "Our story",
    "footer.about.shelf": "The shelf",
    "footer.about.order": "Order online",
    "footer.hq.title": "Headquarters & Inquiries",
    "footer.sub.note": "Aro Holistics · Cold-pressed in El Paso · Since 2017",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    
    // Modal
    "modal.assessment.title": "Nutrient Assessment",
    "modal.assessment.subtitle": "Find exactly what formulation matches your body's recovery goals"
  },
  es: {
    // Nav
    "nav.shop": "Tienda",
    "nav.blends": "Nuestras Mezclas",
    "nav.makers": "Productores",
    "nav.locations": "Ubicaciones",
    "nav.events": "Eventos",
    "nav.story": "Nosotros",
    
    // Header & Modal CTA
    "btn.assessment": "Evaluación Gratis",
    "btn.phone": "(915) 255-8624",
    "btn.smsCall": "SMS o Llamada: (915) 255-8624",
    
    // Hero
    "hero.badge": "Prensado en frío. Respaldado por la ciencia. Adaptado a ti.",
    "hero.heading": "Comida real, prensada lentamente, a mano.",
    "hero.description": "La primera juguería holística prensada en frío de El Paso: recetas densas en nutrientes, productores locales holísticos y bienestar comunitario.",
    "hero.cta.press": "Comprar prensado de la semana",
    "hero.cta.makers": "Conoce a nuestros productores",
    "hero.hint": "Psst — intenta rebanar una fruta",
    
    // Story Strip
    "story.heading": "Jugo fresco, abastecimiento honesto.",
    "story.description": "ARO Holistics comenzó con una idea simple: traer jugos frescos prensados en frío y densos en nutrientes a El Paso sin comprometer el origen ni el proceso. Cada lote se prensa localmente, nunca se pasteuriza con calor y se embotella el mismo día.",
    "story.cta": "Leer la historia completa",
    
    // About Section
    "about.badge": "Nuestras Raíces",
    "about.heading": "Sobre Aro Holistics",
    "about.desc": "ARO Holistics no hace jugos comunes. Cada receta está elaborada con intención: fusionando ciencia nutricional e ingredientes terapéuticos para que tu dinero invierta activamente en tu salud, tu entorno y tu comunidad.",
    "about.prev.title": "Nutrición preventiva, por diseño",
    "about.prev.body": "Basados en la nutrición preventiva y terapia nutricional, nuestros jugos están diseñados para hacer más que refrescar: están formulados para ayudar a proteger tu cuerpo y apoyar la reversión de enfermedades del estilo de vida moderno. Con casi una década de experiencia en jugos basados en nutrición clínica, hemos creado más de 133 recetas únicas y totalmente personalizables, cada una diseñada con un propósito de salud específico.",
    "about.f1.title": "Más de 5 ingredientes integrales",
    "about.f1.body": "Abastecimiento global y local. Muchas mezclas incluyen medicina botánica, hongos funcionales de cultivo local y musgo marino silvestre local para mayores beneficios funcionales.",
    "about.f2.title": "Menos de 125 calorías por porción",
    "about.f2.body": "Menos de 30 g de fructosa natural por porción, con opciones aptas para diabéticos. Tamaño generoso de más de 16 oz por botella.",
    "about.f3.title": "Producción conforme a la FDA",
    "about.f3.body": "Producido con equipos de prensado comercial en una cocina autorizada conforme a la FDA, embotellado en envases libres de BPA y que no filtran sustancias químicas.",
    "about.f4.title": "Apoyo a lo local",
    "about.f4.body": "Apoyando a agricultores locales y pequeñas empresas en el camino, porque la salud de la comunidad comienza con la inversión comunitaria.",
    "about.visit.title": "Visita la tienda",
    "about.visit.note": "Visitas sin cita bienvenidas · Pedidos especiales · Paquetes personalizados · Productos holísticos locales exclusivos",
    "about.hours.title": "Horario",
    "about.hours.weekdays": "Lun – Vie",
    "about.hours.weekends": "Sáb – Dom",
    "about.hours.profile": "Descubre tu perfil de nutrientes personalizado",
    "about.closing.title": "Cada jugo tiene un propósito.",
    "about.closing.body": "Nos enorgullece ser tu terapeuta holístico local de confianza.",
    
    // Scientific Formulations (Juices)
    "juices.badge": "Mezclas Formuladas",
    "juices.heading": "Nuestras Formulaciones Científicas",
    "juices.subheading": "Ingredientes crudos y orgánicos comprimidos bajo fuerza hidráulica. Restaurando la vitalidad a nivel celular.",
    "juices.select": "Seleccionar Mezcla",
    "juices.prev": "Mezcla Anterior",
    "juices.next": "Mezcla Siguiente",
    "juices.hud": "Métricas HUD Bioenzimáticas",
    "juices.components": "Biocomponentes de la Fórmula",
    "juices.order": "Pedir Mezcla",
    "juices.clinical": "Análisis Clínico",
    "juices.quickView": "Vista Rápida",
    "juices.activeBio": "Biomezcla Activa",
    "juices.target": "Objetivo de Sistema Activo",
    
    // Weekly Press
    "press.badge": "Prensado de la Semana",
    "press.heading": "Fresco de la prensa.",
    "press.subtext": "Destacados de nuestra línea de prensado en frío y favoritos de bienestar. Pasa el cursor para saber más.",
    "press.cta": "Ver todos los productos",
    
    // Shelf
    "shelf.badge": "Comprar en Tienda",
    "shelf.heading": "El catálogo completo.",
    "shelf.subtext": "Jugos prensados en frío, hongos, bocadillos, suplementos y más, listos para recoger en las ubicaciones de nuestros socios en El Paso.",
    "shelf.empty": "Nada en esta sección por ahora; vuelve a consultar después del próximo prensado.",
    
    // Categories
    "cat.All": "Todo",
    "cat.Juice": "Jugos",
    "cat.Mushrooms": "Hongos",
    "cat.Snacks": "Bocadillos",
    "cat.Supplements": "Suplementos",
    "cat.Other": "Otros",
    
    // Product Detail
    "prod.by": "por",
    "prod.ingredients": "Ingredientes",
    "prod.availability": "Consultar disponibilidad",
    
    // Bottle Modal
    "bottle.profile": "Perfil de Mezcla",
    "bottle.ingredients": "Ingredientes Completos",
    "bottle.targets": "Objetivos Clínicos de Salud",
    "bottle.order": "Pedir al Distribuidor",
    
    // Reviews
    "reviews.badge": "Testimonios Reales",
    "reviews.heading": "Amor silencioso y constante.",
    "reviews.subtext": "No tenemos programas de lealtad. Simplemente recordamos.",
    
    // Partners
    "partners.badge": "Productores y Socios",
    "partners.heading": "Un pequeño círculo de productores.",
    "partners.subtext": "Nuestras repisas se llenan con productos de personas que conocemos por su nombre. Pequeños negocios de toda la región fronteriza.",
    "partners.items": "artículos en catálogo",
    
    // Locations
    "loc.badge": "Dónde Encontrarnos",
    "loc.heading": "Encuentra nuestros jugos holísticos prensados en frío.",
    "loc.subtext": "Puntos de entrega en El Paso · Llama al (915) 255-8624",
    "loc.navigate": "Cómo llegar en Maps",
    
    // Events
    "events.badge": "Eventos",
    "events.heading": "Puntos de venta temporales, limpiezas y talleres.",
    "events.empty": "No hay nada programado en el calendario en este momento; vuelve pronto.",
    "events.subtext": "Sigue a @aro_holistics para enterarte de eventos temporales.",
    
    // Footer
    "footer.desc": "Una juguería de prensado en frío + tienda de bienestar selecta en El Paso, TX.",
    "footer.visit.title": "Visítanos",
    "footer.visit.locations": "Ubicaciones",
    "footer.visit.events": "Eventos",
    "footer.visit.partners": "Nuestros socios",
    "footer.about.title": "Nosotros",
    "footer.about.story": "Nuestra historia",
    "footer.about.shelf": "El catálogo",
    "footer.about.order": "Pedir en línea",
    "footer.hq.title": "Oficina Central y Consultas",
    "footer.sub.note": "Aro Holistics · Prensado en frío en El Paso · Desde 2017",
    "footer.privacy": "Política de Privacidad",
    "footer.terms": "Términos de Servicio",
    
    // Modal
    "modal.assessment.title": "Evaluación de Nutrientes",
    "modal.assessment.subtitle": "Encuentra exactamente qué mezcla coincide con los objetivos de recuperación de tu cuerpo"
  }
};
