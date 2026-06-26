import { useState, useEffect } from "react";
import { 
  Leaf, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  Star, 
  X, 
  Sparkles, 
  TrendingUp, 
  Heart, 
  ExternalLink, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface Juice {
  id: string;
  name: string;
  tagline: string;
  colorClass: string;
  bgGradient: string;
  ingredients: string[];
  benefits: string[];
  stats: { label: string; value: string }[];
  target: string;
}

interface LocationData {
  name: string;
  address: string;
  rating: string;
  reviewsCount: string;
  placeId: string;
  mapsUrl: string;
}

interface Review {
  author: string;
  rating: number;
  text: string;
  source: string;
  tag: string;
}

// Juices Data
const JUICES_DATA: Juice[] = [
  {
    id: "green-vitality",
    name: "Green Vitality",
    tagline: "Cellular Detoxification & Alkalizing Daily Nourishment",
    colorClass: "text-emerald-400 border-emerald-500/20",
    bgGradient: "from-emerald-950/80 to-teal-950/40",
    ingredients: ["Organic Celery", "Cucumber", "Spinach", "Green Apple", "Ginger", "Lemon"],
    benefits: ["Promotes digestion & gut health", "Alkalizes blood pH", "Reduces chronic inflammation"],
    stats: [
      { label: "Enzymes", value: "100% Active" },
      { label: "Vitamin C", value: "85% DV" },
      { label: "Sugar", value: "0g Added" }
    ],
    target: "Digestion & Inflammatory Health"
  },
  {
    id: "citrus-immunity",
    name: "Citrus Immunity",
    tagline: "High-Potency Vitamin C & Antioxidant Powerhouse",
    colorClass: "text-amber-400 border-amber-500/20",
    bgGradient: "from-amber-950/80 to-orange-950/40",
    ingredients: ["Orange", "Grapefruit", "Turmeric", "Cayenne Pepper", "Lemon", "Astragalus"],
    benefits: ["Triggers immune cell response", "Enhances lymphatic drainage", "Boosts metabolic circulation"],
    stats: [
      { label: "Vitamin C", value: "220% DV" },
      { label: "Antioxidants", value: "Premium" },
      { label: "Sugar", value: "0g Added" }
    ],
    target: "Immune Defense & Energy"
  },
  {
    id: "sweet-root",
    name: "Sweet Root",
    tagline: "Nitric Oxide Booster & Natural Athletic Recovery",
    colorClass: "text-rose-400 border-rose-500/20",
    bgGradient: "from-rose-950/80 to-purple-950/40",
    ingredients: ["Red Beetroot", "Carrot", "Red Apple", "Ginger", "Key Lime"],
    benefits: ["Increases oxygen delivery to tissues", "Enhances stamina & muscle recovery", "Supports liver detoxification"],
    stats: [
      { label: "Iron", value: "18% DV" },
      { label: "Nitrates", value: "High" },
      { label: "Sugar", value: "0g Added" }
    ],
    target: "Cardiovascular & Exercise Science"
  },
  {
    id: "pure-celery",
    name: "Pure Celery Hydrator",
    tagline: "Medical Medium Grade Sodium Cluster Salts",
    colorClass: "text-lime-400 border-lime-500/20",
    bgGradient: "from-lime-950/80 to-emerald-950/40",
    ingredients: ["100% Organic Celery (Cold-Pressed)"],
    benefits: ["Restores stomach hydrochloric acid", "Strengthens cellular hydration", "Flushes toxins from liver"],
    stats: [
      { label: "Hydration", value: "Max" },
      { label: "Sodium Salts", value: "Natural" },
      { label: "Sugar", value: "0g Added" }
    ],
    target: "Gut Lining & Liver Restore"
  }
];

// Locations Data
const LOCATIONS_DATA: LocationData[] = [
  {
    name: "House of Hemp",
    address: "12040 Tierra Este Rd Unit 111, El Paso, TX 79938",
    rating: "4.9",
    reviewsCount: "138 reviews",
    placeId: "EjUxMjA0MCBUaWVycmEgRXN0ZSBSZCB1bml0IDExMSwgRWwgUGFzbywgVFggNzk5MzgsIFVTQSIkGiIKFgoUChIJi4kV9p9G54YRnlDxBrNVdfMSCHVuaXQgMTEx",
    mapsUrl: "https://maps.google.com/?q=12040%20Tierra%20Este%20Rd%20Unit%20111,%20El%20Paso,%20TX%2079938"
  },
  {
    name: "Homerun Bodywork LLC",
    address: "2829 Montana Ave, El Paso, TX 79903",
    rating: "4.8",
    reviewsCount: "94 reviews",
    placeId: "ChIJtZY4uZdZ54YRJ2RLfRd35y0",
    mapsUrl: "https://maps.google.com/?q=2829%20Montana%20Ave,%20El%20Paso,%20TX%2079903"
  },
  {
    name: "Hot Joe's Meal Prep",
    address: "750 Sunland Park Dr, El Paso, TX 79912",
    rating: "4.7",
    reviewsCount: "82 reviews",
    placeId: "ChIJMa2kiA_43YYR5rAGUlEuDCo",
    mapsUrl: "https://maps.google.com/?q=750%20Sunland%20Park%20Dr,%20El%20Paso,%20TX%2079912"
  },
  {
    name: "Smoothie King",
    address: "7456 Cimarron Market Ave E-1, El Paso, TX 79911",
    rating: "4.6",
    reviewsCount: "250+ reviews",
    placeId: "EjQ3NDU2IENpbWFycm9uIE1hcmtldCBBdmUgZSAxLCBFbCBQYXNvLCBUWCA3OTkxMSwgVVNBIjoaOAoxEi8KFAoSCYMUJGjN-N2GEURh8cjfJEvhEKA6KhQKEglNCJJnzfjdhhGJkwNVJoG3DxIDZSAx",
    mapsUrl: "https://maps.google.com/?q=7456%20Cimarron%20Market%20Ave%20E-1,%20El%20Paso,%20TX%2079911"
  }
];

// Reviews Data
const REVIEWS_DATA: Review[] = [
  {
    author: "Samantha K.",
    rating: 5,
    text: "The Green Vitality juice completely saved my gut health! You can tell it is scientifically structured. Tastes clean, zero preservatives, and gives me natural energy without any crashes.",
    source: "Google Local Guide",
    tag: "Aro Holistics Juice Quality"
  },
  {
    author: "Marcus Ramirez",
    rating: 5,
    text: "So convenient to grab my daily juices at Hot Joe's Meal Prep or House of Hemp. The nitric oxide beetroot juice (Sweet Root) is my secret weapon before hitting my training sessions.",
    source: "Google Review",
    tag: "Athletic Recovery & Pickup"
  },
  {
    author: "Elena Castillo",
    rating: 5,
    text: "I did their botanical health assessment online and bought a tailored pack. It is hands down the highest quality cold-pressed juice in El Paso. Worth every single penny.",
    source: "Facebook Recommendation",
    tag: "Personalized Wellness"
  },
  {
    author: "Dr. Adrian Vance",
    rating: 5,
    text: "As a clinician, I appreciate that they combine exercise science and clinical nutrition in their formulations. Excellent enzymic retention and no added sugars.",
    source: "Google Local Guide",
    tag: "Clinical Standard"
  }
];

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [selectedJuice, setSelectedJuice] = useState<Juice | null>(null);
  const [activeJuiceIdx, setActiveJuiceIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto scroll reviews
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReviewIdx((prev) => (prev + 1) % REVIEWS_DATA.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextReview = () => {
    setActiveReviewIdx((prev) => (prev + 1) % REVIEWS_DATA.length);
  };

  const prevReview = () => {
    setActiveReviewIdx((prev) => (prev - 1 + REVIEWS_DATA.length) % REVIEWS_DATA.length);
  };

  return (
    <div className="relative min-h-screen font-sans selection:bg-forest selection:text-white bg-cream text-charcoal">
      
      {/* ---------------- BACKGROUND DYNAMIC BLOBS ---------------- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-forest/5 blur-[80px] animate-float-1" />
        <div className="absolute top-[40%] right-[-15%] w-[40vw] h-[40vw] rounded-full bg-sage/5 blur-[90px] animate-float-2" />
        <div className="absolute bottom-[10%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-forest-light/5 blur-[70px] animate-float-3" />
      </div>

      {/* ---------------- FIXED HEADER ---------------- */}
      <header className="sticky top-0 z-40 w-full glassmorphism transition-all duration-300 border-b border-forest/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <span className="p-2.5 rounded-full bg-forest text-white transition-transform group-hover:rotate-12 duration-300">
              <Leaf className="w-5 h-5" />
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-forest leading-none">ARO</span>
              <span className="text-[10px] tracking-[0.25em] font-medium uppercase text-sage">Holistics</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8 font-medium text-forest-dark">
            <a href="#about" className="hover:text-sage transition-colors">Science & Vision</a>
            <a href="#juices" className="hover:text-sage transition-colors">Our Blends</a>
            <a href="#reviews" className="hover:text-sage transition-colors">Testimonials</a>
            <a href="#locations" className="hover:text-sage transition-colors">Locations</a>
          </nav>

          <div className="flex items-center gap-4">
            <a 
              href="sms:+19152558624" 
              className="hidden sm:flex items-center gap-2 text-forest-dark hover:text-sage transition-colors font-medium"
            >
              <Phone className="w-4 h-4 text-sage" />
              <span>(915) 255-8624</span>
            </a>
            <button 
              onClick={() => setModalOpen(true)}
              className="px-6 py-2.5 rounded-full bg-forest text-white hover:bg-forest-light transition-all duration-300 shadow-md font-semibold text-sm hover:-translate-y-0.5"
            >
              Get Free Assessment
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:pt-24 pb-20 md:pb-32 flex flex-col items-center text-center">
        {/* Animated Pill Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest/10 text-forest font-semibold text-xs tracking-wider uppercase mb-8 border border-forest/10"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cold-Pressed. Science-Backed. Tailored to You.</span>
        </motion.div>

        {/* Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-forest leading-[0.95] max-w-5xl mb-8 font-semibold"
        >
          Bottling the Science of <span className="italic text-sage font-medium">Holistic Recovery</span>
        </motion.h1>

        {/* Value Proposition Description */}
        <motion.p 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-charcoal/80 max-w-3xl leading-relaxed mb-12"
        >
          ARO Holistics integrates <span className="font-semibold text-forest">Botanical Medicine</span>, <span className="font-semibold text-forest">Clinical Nutrition</span>, and <span className="font-semibold text-forest">Exercise Science</span>. We formulate active raw juices built to support cellular detoxification, metabolic stamina, and optimal healing.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto"
        >
          <button 
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-forest text-white hover:bg-forest-light text-base font-bold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>What Nutrients Does Your Body Crave?</span>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          
          <a 
            href="https://orders.food/AroHolistics?type=qr&utm_source=GMB" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-forest border border-forest/20 hover:border-forest/50 text-base font-bold shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <span>Order Cold-Pressed Online</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </section>

      {/* ---------------- SCIENTIFIC FOUNDATIONS (ABOUT) ---------------- */}
      <section id="about" className="relative z-10 py-24 bg-white border-y border-forest/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Visual representations of Science */}
          <div className="relative flex justify-center">
            {/* Ambient Circle Backdrop */}
            <div className="absolute inset-0 bg-cream/80 rounded-3xl -rotate-2" />
            
            <div className="relative glassmorphism rounded-3xl p-8 sm:p-10 border border-forest/10 shadow-xl max-w-lg w-full flex flex-col gap-6 rotate-1">
              <h3 className="font-serif text-3xl font-bold text-forest">The Clinical Difference</h3>
              <p className="text-charcoal/80 leading-relaxed text-sm">
                Most juices are pasteurized with heat, which kills beneficial enzymes and sensitive antioxidants. 
                ARO Holistics extracts juices hydraulically under thousands of pounds of pressure—never generating heat.
              </p>
              
              <div className="h-[1px] bg-forest/10 w-full" />
              
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-forest text-sm">Raw Enzymatic Retention</h4>
                    <p className="text-xs text-charcoal/60">Enzymes remain alive and bioavailable for instant cellular assimilation.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-rose-50 text-rose-700">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-forest text-sm">Targeted Health Benefits</h4>
                    <p className="text-xs text-charcoal/60">Tailored combinations targeting digestion, recovery, or immune cellular systems.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-forest text-sm">Exercise Science Integration</h4>
                    <p className="text-xs text-charcoal/60">Optimized nitrate-heavy roots to expand nitric oxide and boost muscular recoverability.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copywriting */}
          <div className="flex flex-col gap-6 lg:pl-6">
            <span className="text-xs font-bold tracking-widest text-sage uppercase">Clinical Standards</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-forest leading-tight">
              A Formulation Tailored Specifically to Your Biology
            </h2>
            <div className="h-1 w-20 bg-sage rounded-full" />
            
            <p className="text-charcoal/80 leading-relaxed text-base">
              At ARO Holistics, we don’t believe in one-size-fits-all nutrition. Our formulations combine the healing properties of botanicals with the precision of clinical biochemistry. Whether you are searching for targeted gut lining recovery, cardiovascular enhancement, or complete antioxidant rejuvenation, our cold-pressed juices deliver raw wellness with uncompromising efficacy.
            </p>
            
            <p className="text-charcoal/80 leading-relaxed text-base italic border-l-2 border-sage/50 pl-4 font-serif">
              "ARO Holistics is a cold pressed juicery that combines Botanical Medicine, Clinical Nutrition, and Exercise Science to create juices tailored to your health."
            </p>

            <div className="pt-4">
              <button 
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-3 text-forest font-bold hover:text-sage transition-all hover:translate-x-1"
              >
                <span>Discover your custom nutrient profile</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- PRODUCT CATALOG SECTION (JUICES) ---------------- */}
      <section id="juices" className="relative z-10 py-28 max-w-7xl mx-auto px-6 overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col items-center">
          <span className="text-xs font-bold tracking-widest text-sage uppercase mb-3">Formulated Blends</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-forest leading-tight mb-4">
            Our Scientific Formulations
          </h2>
          <p className="text-charcoal/70">
            Raw, organic ingredients compressed under hydraulic force. Restoring vitality at the cellular level.
          </p>
        </div>

        {/* Character Selection Style Carousel Wrapper */}
        <div className="relative w-full max-w-4xl mx-auto flex items-center justify-between mb-16 px-4">
          
          {/* Left Arrow Button */}
          <button 
            onClick={() => setActiveJuiceIdx((prev) => (prev - 1 + JUICES_DATA.length) % JUICES_DATA.length)}
            className="absolute left-0 sm:left-4 z-20 p-3 rounded-full bg-white hover:bg-cream text-forest border border-forest/10 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            aria-label="Previous Blend"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Cards 3D Container */}
          <div 
            className="relative w-full h-[450px] flex items-center justify-center overflow-visible"
            style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
          >
            {JUICES_DATA.map((juice, index) => {
              const n = JUICES_DATA.length;
              const diff = (index - activeJuiceIdx + n) % n;
              
              let x = 0;
              let scale = 0.8;
              let zIndex = 5;
              let opacity = 0.4;
              let rotateY = 0;
              let filter = "blur(2px) grayscale(30%)";
              let cursor = "pointer";

              if (diff === 0) { // Active
                x = 0;
                scale = 1.05;
                zIndex = 10;
                opacity = 1;
                rotateY = 0;
                filter = "blur(0px) grayscale(0%)";
                cursor = "default";
              } else if (diff === 1) { // Right
                x = isMobile ? 90 : 250;
                scale = 0.85;
                zIndex = 5;
                opacity = 0.6;
                rotateY = -18;
              } else if (diff === n - 1) { // Left
                x = isMobile ? -90 : -250;
                scale = 0.85;
                zIndex = 5;
                opacity = 0.6;
                rotateY = 18;
              } else { // Back
                x = 0;
                scale = 0.7;
                zIndex = 1;
                opacity = 0;
                rotateY = 0;
              }

              return (
                <motion.div
                  key={juice.id}
                  onClick={() => diff !== 0 && setActiveJuiceIdx(index)}
                  animate={{
                    x,
                    scale,
                    zIndex,
                    opacity,
                    rotateY,
                    filter
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`absolute w-[260px] sm:w-[320px] h-[380px] sm:h-[420px] rounded-3xl bg-gradient-to-br ${juice.bgGradient} p-8 border border-white/10 shadow-2xl flex flex-col justify-between select-none ${cursor}`}
                  style={{ transformOrigin: "center center" }}
                >
                  {/* Soft blur light source */}
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 blur-3xl pointer-events-none" />

                  {/* Card Content Header */}
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-white/50 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                        {juice.target}
                      </span>
                      <span className={`p-2 rounded-full bg-white/5 border ${juice.colorClass}`}>
                        <Leaf className="w-4 h-4" />
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white mt-2 leading-tight">{juice.name}</h3>
                    <p className="text-xs text-white/70 leading-relaxed mt-4 italic">{juice.tagline}</p>
                  </div>

                  {/* Ingredients Tags preview */}
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {juice.ingredients.slice(0, 3).map((ing, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/75 border border-white/5">
                          {ing}
                        </span>
                      ))}
                      {juice.ingredients.length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/50 border border-white/5">
                          +{juice.ingredients.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* View breakdown trigger */}
                    <div className="flex justify-between items-center border-t border-white/10 pt-4">
                      <span className="text-[9px] uppercase tracking-wider text-white/40 font-semibold">Scientific Bio-Mix</span>
                      {diff === 0 && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJuice(juice);
                          }}
                          className="text-[10px] px-3 py-1 rounded-full bg-white text-forest-dark font-bold hover:bg-cream transition-colors"
                        >
                          Quick View
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button 
            onClick={() => setActiveJuiceIdx((prev) => (prev + 1) % JUICES_DATA.length)}
            className="absolute right-0 sm:right-4 z-20 p-3 rounded-full bg-white hover:bg-cream text-forest border border-forest/10 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            aria-label="Next Blend"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Selected Formulation HUD Details Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeJuiceIdx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative max-w-4xl mx-auto rounded-3xl bg-forest-dark text-white border border-white/10 shadow-2xl p-8 sm:p-12 overflow-hidden"
          >
            {/* Glowing background gradient */}
            <div className="absolute -top-[10%] -right-[10%] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              
              {/* Left Side: Text Profile */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                <div>
                  <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
                    Active System Target: {JUICES_DATA[activeJuiceIdx].target}
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold mt-2 text-white">
                    {JUICES_DATA[activeJuiceIdx].name}
                  </h3>
                </div>
                
                <p className="text-sm text-white/70 italic leading-relaxed border-l-2 border-emerald-500/30 pl-4">
                  "{JUICES_DATA[activeJuiceIdx].tagline}"
                </p>

                <p className="text-xs text-white/60 leading-relaxed">
                  Tailored utilizing exercise physiology and biochemistry metrics. Optimized for direct assimilation and cellular hydration.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <a 
                    href="https://orders.food/AroHolistics?type=qr&utm_source=GMB"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-white hover:bg-cream text-forest-dark font-bold text-xs shadow-md transition-all duration-300 hover:shadow-lg"
                  >
                    Order Online
                  </a>
                  <button 
                    onClick={() => setSelectedJuice(JUICES_DATA[activeJuiceIdx])}
                    className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-white/35 text-white font-bold text-xs transition-all"
                  >
                    Clinical Breakdown
                  </button>
                </div>
              </div>

              {/* Right Side: Clinical HUD Stats */}
              <div className="lg:col-span-7 flex flex-col gap-6 lg:border-l lg:border-white/10 lg:pl-10">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Bio-Enzymatic HUD Metrics</h4>
                  <div className="flex flex-col gap-4">
                    {(() => {
                      const id = JUICES_DATA[activeJuiceIdx].id;
                      const bars = (() => {
                        if (id === "green-vitality") {
                          return [
                            { label: "Enzymatic Activity (Cold-Pressed Raw)", value: 100, color: "bg-emerald-500" },
                            { label: "Antioxidant Retention (Free Radical Scavenger)", value: 92, color: "bg-emerald-400" },
                            { label: "Chlorophyll Alkalizing Index", value: 85, color: "bg-teal-500" }
                          ];
                        } else if (id === "citrus-immunity") {
                          return [
                            { label: "Enzymatic Activity (Cold-Pressed Raw)", value: 100, color: "bg-amber-500" },
                            { label: "Vitamin C Concentration (Lymph Drainage)", value: 100, color: "bg-orange-500" },
                            { label: "Immune T-Cell Stimulant Index", value: 95, color: "bg-amber-400" }
                          ];
                        } else if (id === "sweet-root") {
                          return [
                            { label: "Enzymatic Activity (Cold-Pressed Raw)", value: 100, color: "bg-rose-500" },
                            { label: "Nitric Oxide Activation (Stamina)", value: 96, color: "bg-rose-400" },
                            { label: "Hepatic (Liver) Detox Efficiency", value: 88, color: "bg-purple-500" }
                          ];
                        } else {
                          return [
                            { label: "Enzymatic Activity (Cold-Pressed Raw)", value: 100, color: "bg-lime-500" },
                            { label: "Stomach Hydrochloric Restoration", value: 98, color: "bg-lime-400" },
                            { label: "Hydration Bio-Available Salts", value: 94, color: "bg-emerald-500" }
                          ];
                        }
                      })();

                      return bars.map((bar, i) => (
                        <div key={i} className="flex flex-col">
                          <div className="flex justify-between text-xs font-semibold mb-1 text-white/80">
                            <span>{bar.label}</span>
                            <span>{bar.value}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${bar.value}%` }}
                              transition={{ duration: 0.8, delay: 0.1 * i, ease: "easeOut" }}
                              className={`h-full rounded-full ${bar.color}`}
                            />
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                <div className="h-[1px] bg-white/10 w-full my-1" />

                {/* Core Ingredients Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Formula Bio-Components</h4>
                  <div className="flex flex-wrap gap-2">
                    {JUICES_DATA[activeJuiceIdx].ingredients.map((ing, i) => (
                      <span 
                        key={i} 
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 flex items-center gap-1.5 hover:border-emerald-400/50 hover:bg-white/10 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{ing}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </section>

      {/* ---------------- REVIEWS & SOCIAL PROOF ---------------- */}
      <section id="reviews" className="relative z-10 py-24 bg-white border-t border-b border-forest/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-xs font-bold tracking-widest text-sage uppercase mb-3">Real Testimonials</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-forest leading-tight mb-4">
              What the El Paso Community Says
            </h2>
            <div className="flex gap-1 text-amber-500 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-500" />
              ))}
            </div>
            <p className="text-charcoal/60 text-xs mt-2">
              Based on verified ratings from our partner pickup spots and local guides
            </p>
          </div>

          {/* Testimonials Slider */}
          <div className="relative glassmorphism rounded-3xl p-8 sm:p-12 border border-forest/10 shadow-lg max-w-3xl mx-auto">
            <div className="absolute top-6 left-6 text-forest/10 font-serif text-9xl leading-none select-none pointer-events-none">
              “
            </div>

            <div className="min-h-[160px] flex flex-col justify-between">
              <p className="text-lg md:text-xl font-serif italic text-charcoal/80 relative z-10 leading-relaxed mb-8">
                {REVIEWS_DATA[activeReviewIdx].text}
              </p>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-forest">{REVIEWS_DATA[activeReviewIdx].author}</h4>
                  <span className="text-xs text-charcoal/50 flex items-center gap-1.5 mt-0.5">
                    <span>{REVIEWS_DATA[activeReviewIdx].source}</span>
                    <span className="w-1 h-1 rounded-full bg-charcoal/30" />
                    <span>{REVIEWS_DATA[activeReviewIdx].tag}</span>
                  </span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={prevReview}
                    className="p-2 rounded-full hover:bg-forest/5 text-forest transition-colors border border-forest/10 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={nextReview}
                    className="p-2 rounded-full hover:bg-forest/5 text-forest transition-colors border border-forest/10 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- PARTNER LOCATIONS SECTION ---------------- */}
      <section id="locations" className="relative z-10 py-28 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col items-center">
          <span className="text-xs font-bold tracking-widest text-sage uppercase mb-3">Partner Network</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-forest leading-tight mb-4">
            Check Out Our Pickup Locations!
          </h2>
          <p className="text-charcoal/70">
            Available daily at premium wellness centres, CBD shops, and nutrition outlets in El Paso.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LOCATIONS_DATA.map((loc, i) => (
            <div 
              key={i}
              className="glassmorphism rounded-3xl p-6 border border-forest/10 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-xl bg-forest/5 text-forest">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/50 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{loc.rating}</span>
                  </div>
                </div>

                <h3 className="font-serif text-xl font-bold text-forest mb-2">{loc.name}</h3>
                <p className="text-xs text-charcoal/60 leading-relaxed mb-6">{loc.address}</p>
              </div>

              <a 
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-white border border-forest/15 hover:border-forest/40 hover:bg-cream text-xs text-forest font-bold tracking-wider uppercase text-center flex items-center justify-center gap-2 transition-all duration-300"
              >
                <span>Navigate on Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- INTERACTIVE FOOTER ---------------- */}
      <footer className="relative z-10 bg-forest-dark text-white pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <a href="#" className="flex items-center gap-3">
              <span className="p-2 bg-white text-forest-dark rounded-full">
                <Leaf className="w-5 h-5" />
              </span>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-white leading-none">ARO</span>
                <span className="text-[10px] tracking-[0.25em] font-medium uppercase text-emerald-400">Holistics</span>
              </div>
            </a>
            
            <p className="text-sm text-white/70 max-w-sm leading-relaxed">
              ARO Holistics integrates Botanical Medicine, Clinical Nutrition, and Exercise Science to build cold-pressed juices suited directly to your personal health.
            </p>

            <div className="flex items-center gap-3">
              <a 
                href="https://www.instagram.com/aro_holistics/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a 
                href="tel:+19152558624"
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                aria-label="Phone"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-serif text-lg font-bold text-emerald-400 mb-6">Explore</h4>
            <ul className="flex flex-col gap-4 text-sm text-white/70">
              <li><a href="#about" className="hover:text-white transition-colors">The Clinical Science</a></li>
              <li><a href="#juices" className="hover:text-white transition-colors">Our Cold Pressed Blends</a></li>
              <li><a href="#locations" className="hover:text-white transition-colors">Partner Distributors</a></li>
              <li><a href="https://orders.food/AroHolistics?type=qr&utm_source=GMB" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Store Ordering System</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <h4 className="font-serif text-lg font-bold text-emerald-400">Headquarters & Inquiries</h4>
            
            <div className="flex flex-col gap-4 text-sm text-white/70">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>230 N Copia Street, El Paso, TX 79905</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>SMS or Call: (915) 255-8624</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>info@aroholistics.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sub-footer */}
        <div className="max-w-7xl mx-auto px-6 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/50">
          <p>© {new Date().getFullYear()} ARO Holistics. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* ---------------- 1. DYNAMIC MODAL: LEAD CONNECTOR ASSESSMENT ---------------- */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-forest-dark/70 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl h-[85vh] bg-white rounded-3xl border border-forest/10 shadow-2xl flex flex-col overflow-hidden z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-forest/5 flex justify-between items-center bg-cream/30">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-forest text-white">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-forest">Nutrient Assessment</h3>
                    <p className="text-[10px] text-charcoal/50">Find exactly what formulation matches your body's recovery goals</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-full hover:bg-forest/5 text-forest transition-colors border border-forest/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Assessment Iframe */}
              <div className="flex-1 w-full h-full bg-cream/10 relative">
                {/* Embedded Widget Iframe */}
                <iframe 
                  src="https://links.mylayerone.com/widget/form/ZJOaJ6ye5aInBEmSdnEG"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="ARO Holistics Nutrient Assessment Form"
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------- 2. DETAILED BOTTLE MODAL ---------------- */}
      <AnimatePresence>
        {selectedJuice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJuice(null)}
              className="absolute inset-0 bg-forest-dark/70 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl border border-forest/10 shadow-2xl flex flex-col overflow-hidden z-10"
            >
              {/* Top Banner Accent */}
              <div className={`h-3 bg-gradient-to-r ${selectedJuice.bgGradient}`} />

              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-sage">Formulation Profile</span>
                    <h3 className="font-serif text-3xl font-bold text-forest mt-1">{selectedJuice.name}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedJuice(null)}
                    className="p-2 rounded-full hover:bg-forest/5 text-forest transition-colors border border-forest/10 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-charcoal/80 leading-relaxed mb-6 italic border-l-2 border-sage/40 pl-4">
                  "{selectedJuice.tagline}"
                </p>

                {/* Grid Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-forest/70 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sage" />
                      <span>Full Ingredients</span>
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {selectedJuice.ingredients.map((ing, i) => (
                        <li key={i} className="text-sm text-charcoal/70 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-forest/70 mb-3 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-sage" />
                      <span>Clinical Health Targets</span>
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {selectedJuice.benefits.map((benefit, i) => (
                        <li key={i} className="text-sm text-charcoal/70 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-forest mt-2 shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="border-t border-forest/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex gap-6">
                    {selectedJuice.stats.map((stat, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[10px] uppercase text-charcoal/50 tracking-wider font-semibold">{stat.label}</span>
                        <span className="text-sm font-semibold text-forest mt-0.5">{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  <a 
                    href="https://orders.food/AroHolistics?type=qr&utm_source=GMB"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-forest text-white hover:bg-forest-light text-sm font-bold shadow-md transition-all duration-300 hover:shadow-lg text-center"
                  >
                    Order from Distributor
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
