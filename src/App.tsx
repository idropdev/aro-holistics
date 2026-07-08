import { useState, useEffect, lazy, Suspense } from "react";
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
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Ticker, Pillars, WeeklyPress, Shelf, Partners, EventsSection } from "./components/ShopSections";
import { type ShelfProduct, type Juice, type Review } from "./data/translations";
import { useLanguage } from "./context/LanguageContext";
import logoImg from "./assets/logo-128.webp";

// 3D interactive fruit hero — lazy-loaded so it never blocks first paint
const FruitHero = lazy(() => import("./components/FruitHero"));

interface LocationData {
  name: string;
  address: string;
  instagram: string;
  mapsUrl: string;
}

// Pickup locations (from aroholisticsshop.com)
const LOCATIONS_DATA: LocationData[] = [
  {
    name: "Main Shop — ARO Holistics",
    address: "230 N Copia St, El Paso, TX 79905",
    instagram: "aro_holistics",
    mapsUrl: "https://maps.google.com/?q=230%20N%20Copia%20St,%20El%20Paso,%20TX%2079905"
  },
  {
    name: "Balanced Peach",
    address: "1220 Lomaland Dr, El Paso, TX 79907",
    instagram: "balancedpeach.co",
    mapsUrl: "https://maps.google.com/?q=1220%20Lomaland%20Dr,%20El%20Paso,%20TX%2079907"
  },
  {
    name: "RC Chiropractor",
    address: "1601 Wyoming Ave, El Paso, TX 79902",
    instagram: "rcchiropractic",
    mapsUrl: "https://maps.google.com/?q=1601%20Wyoming%20Ave,%20El%20Paso,%20TX%2079902"
  },
  {
    name: "Bio Mech Athletics",
    address: "1601 Wyoming Ave, El Paso, TX 79902",
    instagram: "biomechathletics",
    mapsUrl: "https://maps.google.com/?q=1601%20Wyoming%20Ave,%20El%20Paso,%20TX%2079902"
  },
  {
    name: "Food City",
    address: "7444 Gateway Blvd East, El Paso, TX 79915",
    instagram: "foodcityep",
    mapsUrl: "https://maps.google.com/?q=7444%20Gateway%20Blvd%20East,%20El%20Paso,%20TX%2079915"
  }
];

export default function App() {
  const { language, setLanguage, t, localizedData } = useLanguage();
  const juicesData = localizedData.juicesData;
  const reviewsData = localizedData.reviewsData;

  const shelfProducts: ShelfProduct[] = [
    ...juicesData.map((j) => ({
      id: j.id,
      name: j.name,
      price: "$10.00",
      unit: language === "en" ? "bottle" : "botella",
      category: "Juice" as const,
      description: `${j.tagline}. ${j.benefits[0]}.`,
      ingredients: j.ingredients,
      image: j.image
    })),
    ...localizedData.wellnessProducts
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [selectedJuice, setSelectedJuice] = useState<Juice | null>(null);
  const [activeJuiceIdx, setActiveJuiceIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Live Google Reviews states
  const [reviews, setReviews] = useState<Review[]>(reviewsData);
  const [googleStats, setGoogleStats] = useState<{ rating: number; total: number } | null>(null);
  const [hasLoadedGoogle, setHasLoadedGoogle] = useState(false);

  // Sync state with dynamic translation datasets if Google reviews are not yet fetched
  useEffect(() => {
    if (!hasLoadedGoogle) {
      setReviews(reviewsData);
    }
  }, [reviewsData, hasLoadedGoogle]);

  // Fetch reviews from serverless API route
  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => {
        if (!res.ok) throw new Error("API response failed");
        return res.json();
      })
      .then((data) => {
        if (data.reviews && data.reviews.length > 0) {
          const mapped: Review[] = data.reviews.map((r: any, i: number) => ({
            id: `google-${i}`,
            text: r.text,
            author: r.author_name,
            source: "Google Review",
            tag: `${r.rating} ★ · ${r.relative_time_description}`,
            rating: r.rating,
            url: r.author_url
          }));
          setReviews(mapped);
          setHasLoadedGoogle(true);
        }
        if (data.rating) {
          setGoogleStats({
            rating: data.rating,
            total: data.user_ratings_total || 0
          });
        }
      })
      .catch((err) => {
        console.warn("Could not retrieve live reviews, falling back to static content:", err);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Defer the 3D hero until after first paint; skip it entirely for reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    setHeroReady(true);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Auto scroll reviews
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReviewIdx((prev) => (prev + 1) % reviews.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const nextReview = () => {
    setActiveReviewIdx((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setActiveReviewIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const getTargetChip = (target: string) => {
    if (language === "en") {
      return target.split(" & ")[0];
    } else {
      return target.split(" y ")[0] || target;
    }
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="relative min-h-screen font-sans selection:bg-forest selection:text-white bg-cream text-charcoal">

      {/* ---------------- ANNOUNCEMENT TICKER ---------------- */}
      <Ticker />

      {/* ---------------- FIXED HEADER ---------------- */}
      <header className="sticky top-0 z-40 w-full glassmorphism transition-all duration-300 border-b border-forest/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <span className="transition-transform group-hover:scale-105 duration-300">
              <img src={logoImg} alt="ARO Holistics Logo" className="w-12 h-12 object-contain" />
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-forest leading-none">ARO</span>
              <span className="text-[10px] tracking-[0.25em] font-medium uppercase text-sage">Holistics</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8 font-medium text-forest-dark">
            <a href="#shelf" className="hover:text-sage transition-colors">{t("nav.shop")}</a>
            <a href="#juices" className="hover:text-sage transition-colors">{t("nav.blends")}</a>
            <a href="#partners" className="hover:text-sage transition-colors">{t("nav.makers")}</a>
            <a href="#locations" className="hover:text-sage transition-colors">{t("nav.locations")}</a>
            <a href="#events" className="hover:text-sage transition-colors">{t("nav.events")}</a>
            <a href="#about" className="hover:text-sage transition-colors">{t("nav.story")}</a>
          </nav>

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex items-center rounded-full bg-forest/5 p-1 border border-forest/10 select-none">
              <button
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all duration-250 cursor-pointer ${
                  language === "en"
                    ? "bg-forest text-white shadow-sm"
                    : "text-forest-dark/65 hover:text-forest"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("es")}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all duration-250 cursor-pointer ${
                  language === "es"
                    ? "bg-forest text-white shadow-sm"
                    : "text-forest-dark/65 hover:text-forest"
                }`}
              >
                ES
              </button>
            </div>

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
              {t("btn.assessment")}
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- HERO SECTION: DARK PREMIUM + 3D FRUITS ---------------- */}
      <section className="relative z-10 overflow-hidden bg-gradient-to-b from-ink via-forest-dark to-ink text-white">
        {/* Ambient gold + green glows echoing the logo */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[70vw] h-[50vh] rounded-full bg-gold/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[10%] w-[40vw] h-[40vh] rounded-full bg-sage-light/10 blur-[100px] pointer-events-none" />

        {/* Interactive 3D floating fruits (cursor pushes them; click slices) */}
        {heroReady && !reducedMotion && (
          <Suspense fallback={null}>
            <FruitHero />
          </Suspense>
        )}

        {/* Content sits above the canvas; wrapper lets pointer events fall
            through to the fruits except on interactive elements */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 md:pt-28 pb-24 md:pb-36 flex flex-col items-center text-center pointer-events-none">


          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[0.95] max-w-5xl mb-8 font-semibold"
          >
            {language === "en" ? "Real food, slow-pressed, " : "Comida real, prensada lentamente, "}<span className="italic text-gold-light font-medium">{language === "en" ? "by hand." : "a mano."}</span>
          </motion.h1>

          {/* Value Proposition Description */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-white/75 max-w-3xl leading-relaxed mb-12"
          >
            {language === "en" ? (
              <>
                El Paso's first holistic cold pressed juicery — <span className="font-semibold text-gold-light">nutrient-dense recipes</span>, <span className="font-semibold text-gold-light">holistic locals</span>, and <span className="font-semibold text-gold-light">community wellness</span>.
              </>
            ) : (
              <>
                La primera juguería holística prensada en frío de El Paso: <span className="font-semibold text-gold-light">recetas densas en nutrientes</span>, <span className="font-semibold text-gold-light">productores locales holísticos</span> y <span className="font-semibold text-gold-light">bienestar comunitario</span>.
              </>
            )}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto pointer-events-auto"
          >
            <a
              href="#press"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold text-ink hover:bg-gold-light text-base font-bold shadow-lg shadow-gold/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>{t("hero.cta.press")}</span>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="#partners"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 text-white border border-white/25 hover:border-gold/60 hover:bg-white/10 text-base font-bold backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <span>{t("hero.cta.makers")}</span>
            </a>
          </motion.div>

          {/* Playful hint for the 3D fruits */}
          {!reducedMotion && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="mt-12 text-xs tracking-widest uppercase text-white/35"
            >
              {t("hero.hint")}
            </motion.p>
          )}
        </div>
      </section>

      {/* ---------------- BRAND STORY STRIP ---------------- */}
      <section className="relative z-10 py-20 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-5"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-forest leading-tight">
            {language === "en" ? (
              <>
                Fresh juice, <span className="italic text-gold-dark font-medium">honest</span> sourcing.
              </>
            ) : (
              <>
                Jugo fresco, abastecimiento <span className="italic text-gold-dark font-medium">honesto</span>.
              </>
            )}
          </h2>
          <p className="text-charcoal/75 leading-relaxed max-w-2xl">
            {t("story.description")}
          </p>
          <a href="#about" className="inline-flex items-center gap-2 text-forest font-bold hover:text-sage transition-all hover:translate-x-1 text-sm">
            <span>{t("story.cta")}</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>
      </section>

      {/* ---------------- THREE PILLARS ---------------- */}
      <Pillars />

      {/* ---------------- THIS WEEK'S PRESS ---------------- */}
      <WeeklyPress products={localizedData.wellnessProducts} />

      {/* ---------------- SCIENTIFIC FOUNDATIONS (ABOUT) ---------------- */}
      <section id="about" className="relative z-10 py-24 bg-white border-y border-forest/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16">

          {/* Intro */}
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-5">
            <span className="text-xs font-bold tracking-widest text-sage uppercase">{t("about.badge")}</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-forest leading-tight">
              {language === "en" ? (
                <>
                  About <span className="italic text-gold-dark font-medium">Aro Holistics</span>.
                </>
              ) : (
                <>
                  Sobre <span className="italic text-gold-dark font-medium">Aro Holistics</span>.
                </>
              )}
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-sage to-gold rounded-full" />
            <p className="text-charcoal/80 leading-relaxed text-base">
              {t("about.desc")}
            </p>
          </div>

          {/* Preventative nutrition block */}
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-4">
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-forest">{t("about.prev.title")}</h3>
            <p className="text-charcoal/70 leading-relaxed text-sm">
              {language === "en" ? (
                <>
                  Rooted in preventative nutrition and nutritional therapy, our juices are designed to do more than refresh — they're formulated to help protect your body and support the reversal of modern lifestyle diseases. With nearly a decade of clinical nutrition-based juicing experience, we've created <span className="font-semibold text-forest">133+ unique, fully customizable recipes</span>, each one built with a specific health purpose in mind.
                </>
              ) : (
                <>
                  Basados en la nutrición preventiva y terapia nutricional, nuestros jugos están diseñados para hacer más que refrescar: están formulados para ayudar a proteger tu cuerpo y apoyar la reversión de enfermedades del estilo de vida moderno. Con casi una década de experiencia en jugos basados en nutrición clínica, hemos creado <span className="font-semibold text-forest">más de 133 recetas únicas y totalmente personalizables</span>, cada una diseñada con un propósito de salud específico.
                </>
              )}
            </p>
          </div>

          {/* Four-column feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Leaf className="w-5 h-5" />,
                title: t("about.f1.title"),
                body: t("about.f1.body")
              },
              {
                icon: <Heart className="w-5 h-5" />,
                title: t("about.f2.title"),
                body: t("about.f2.body")
              },
              {
                icon: <Sparkles className="w-5 h-5" />,
                title: t("about.f3.title"),
                body: t("about.f3.body")
              },
              {
                icon: <TrendingUp className="w-5 h-5" />,
                title: t("about.f4.title"),
                body: t("about.f4.body")
              }
            ].map((f) => (
              <div key={f.title} className="rounded-3xl bg-cream/60 border border-forest/10 p-6 flex flex-col gap-3 hover:border-gold/40 transition-colors">
                <span className="p-2 rounded-xl bg-forest/5 text-forest w-fit">{f.icon}</span>
                <h4 className="font-serif text-lg font-semibold text-forest leading-snug">{f.title}</h4>
                <p className="text-xs text-charcoal/65 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>

          {/* Visit & Hours */}
          <div className="max-w-4xl mx-auto w-full rounded-3xl bg-forest-dark text-white p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="font-serif text-2xl font-bold text-gold-light">{t("about.visit.title")}</h3>
              <div className="flex items-start gap-3 text-sm text-white/80">
                <MapPin className="w-5 h-5 text-gold-light shrink-0 mt-0.5" />
                <span>230 N Copia, El Paso, TX 79905</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-white/80">
                <Phone className="w-5 h-5 text-gold-light shrink-0 mt-0.5" />
                <a href="tel:+19152558624" className="hover:text-white transition-colors">{t("btn.smsCall")}</a>
              </div>
              <p className="text-xs text-white/50">{t("about.visit.note")}</p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-serif text-2xl font-bold text-gold-light">{t("about.hours.title")}</h3>
              <div className="flex flex-col gap-2 text-sm text-white/80">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>{t("about.hours.weekdays")}</span><span className="font-semibold">8am – 6pm</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>{t("about.hours.weekends")}</span><span className="font-semibold">8am – 3pm</span>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-auto inline-flex items-center gap-2 text-gold-light font-bold hover:text-gold transition-all text-sm w-fit cursor-pointer"
              >
                <span>{t("about.hours.profile")}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Closing statement */}
          <div className="text-center flex flex-col items-center gap-2">
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-forest italic">{t("about.closing.title")}</p>
            <p className="text-sm text-charcoal/60">{t("about.closing.body")}</p>
          </div>

        </div>
      </section>

      {/* ---------------- PRODUCT CATALOG SECTION (JUICES) ---------------- */}
      <section id="juices" className="relative z-10 py-24 max-w-7xl mx-auto px-6 overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
          <span className="text-xs font-bold tracking-widest text-sage uppercase mb-3">{t("juices.badge")}</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-forest leading-tight mb-4">
            {t("juices.heading")}
          </h2>
          <p className="text-charcoal/70 text-sm">
            {t("juices.subheading")}
          </p>
        </div>

        {/* Side-by-Side grid for Desktop, Stacked for Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                 {/* Left Column: Compact Carousel */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center min-h-[460px] relative">
            
            <div className="relative w-full flex items-center justify-between px-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sage">{t("juices.select")}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveJuiceIdx((prev) => (prev - 1 + juicesData.length) % juicesData.length)}
                  className="p-2 rounded-full bg-white hover:bg-cream text-forest border border-forest/10 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                  aria-label={t("juices.prev")}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveJuiceIdx((prev) => (prev + 1) % juicesData.length)}
                  className="p-2 rounded-full bg-white hover:bg-cream text-forest border border-forest/10 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                  aria-label={t("juices.next")}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cards 3D Container - Compact dimensions */}
            <div 
              className="relative w-full h-[370px] flex items-center justify-center overflow-visible"
              style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
            >
              {/* Soft floor shadow beneath the active card */}
              <div className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 w-52 h-7 rounded-full bg-ink/25 blur-xl pointer-events-none" />
              {juicesData.map((juice, index) => {
                const n = juicesData.length;
                const diff = (index - activeJuiceIdx + n) % n;
                
                let x = 0;
                let scale = 0.8;
                let zIndex = 5;
                let opacity = 0.4;
                let rotateY = 0;
                let filter = "blur(2px) saturate(0.75) brightness(0.85)";
                let cursor = "pointer";

                if (diff === 0) { // Active
                  x = 0;
                  scale = 1.0;
                  zIndex = 10;
                  opacity = 1;
                  rotateY = 0;
                  filter = "blur(0px) saturate(1) brightness(1)";
                  cursor = "default";
                } else if (diff === 1) { // Right
                  x = isMobile ? 80 : 130;
                  scale = 0.82;
                  zIndex = 5;
                  opacity = 0.45;
                  rotateY = -15;
                } else if (diff === n - 1) { // Left
                  x = isMobile ? -80 : -130;
                  scale = 0.82;
                  zIndex = 5;
                  opacity = 0.45;
                  rotateY = 15;
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
                    className={`absolute w-[220px] sm:w-[250px] h-[320px] sm:h-[350px] rounded-3xl bg-gradient-to-br ${juice.bgGradient} flex flex-col justify-between overflow-hidden select-none ${cursor} ${
                      diff === 0
                        ? "ring-1 ring-gold/60 shadow-[0_30px_70px_-20px_rgba(201,161,90,0.45)]"
                        : "border border-white/10 shadow-xl"
                    }`}
                    style={{ transformOrigin: "center center" }}
                  >
                    {/* Real product photo, center-cropped on the bottle */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={juice.image}
                        alt={`${juice.name} bottle`}
                        className="w-full h-full object-cover"
                      />
                      {/* Legibility gradient anchored to the bottom only — keeps the photo clean */}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/35 via-45% to-transparent" />
                    </div>

                    {/* Card Content - Overlayed relative content (z-10) */}
                    <div className="relative z-10 w-full h-full flex flex-col justify-between p-5">

                      {/* Top chips */}
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-bold tracking-wider uppercase text-white/90 bg-ink/55 px-2.5 py-1 rounded-full border border-white/15 backdrop-blur-md">
                          {getTargetChip(juice.target)}
                        </span>
                        <span className={`p-1.5 rounded-full bg-ink/55 border ${juice.colorClass} backdrop-blur-md`}>
                          <Leaf className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      {/* Bottom info panel over the gradient */}
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white leading-tight drop-shadow-md">{juice.name}</h3>
                        <p className="text-[10px] text-white/75 leading-relaxed mt-1.5 italic line-clamp-2">{juice.tagline}</p>

                        <div className="h-px w-10 bg-gold/70 my-3" />

                        <div className="flex flex-wrap gap-1 mb-3">
                          {juice.ingredients.slice(0, 3).map((ing, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/85 border border-white/10 backdrop-blur-xs">
                              {ing}
                            </span>
                          ))}
                        </div>

                        <div className="flex justify-between items-center border-t border-white/15 pt-2.5">
                          <span className="text-[8px] uppercase tracking-wider text-white/45 font-semibold">{t("juices.activeBio")}</span>
                          {diff === 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedJuice(juice);
                              }}
                              className="text-[9px] px-2.5 py-1 rounded-full bg-gold text-ink font-bold hover:bg-gold-light transition-colors cursor-pointer shadow-sm"
                            >
                              {t("juices.quickView")}
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Formulation HUD Details Panel */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeJuiceIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="relative w-full rounded-3xl bg-forest-dark text-white border border-white/10 shadow-2xl p-6 sm:p-10 overflow-hidden flex flex-col justify-between min-h-[460px]"
              >
                {/* Glowing background gradient */}
                <div className="absolute -top-[10%] -right-[10%] w-[300px] h-[300px] rounded-full bg-gold/10 blur-[80px] pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-6 h-full justify-between">
                  
                  {/* Top Text Profile */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-xs font-bold tracking-widest text-gold-light uppercase">
                        {t("juices.target")}: {juicesData[activeJuiceIdx].target}
                      </span>
                      <h3 className="font-serif text-3xl sm:text-4xl font-bold mt-1 text-white">
                        {juicesData[activeJuiceIdx].name}
                      </h3>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-white/70 italic leading-relaxed border-l-2 border-gold/40 pl-4">
                      "{juicesData[activeJuiceIdx].tagline}"
                    </p>
                  </div>

                  <div className="h-[1px] bg-white/10 w-full" />

                  {/* Dynamic Metrics */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t("juices.hud")}</h4>
                    <div className="flex flex-col gap-3">
                      {(() => {
                        // Derive bars from each juice's own stats so every blend shows its real profile
                        const barColors = ["bg-gold", "bg-emerald-400", "bg-sage-light"];
                        const bars = juicesData[activeJuiceIdx].stats.map((stat, i) => ({
                          label: `${stat.label} — ${stat.value}`,
                          value: parseInt(stat.value, 10) || 100,
                          color: barColors[i % barColors.length]
                        }));

                        return bars.map((bar, i) => (
                          <div key={i} className="flex flex-col">
                            <div className="flex justify-between text-xs font-medium mb-1 text-white/80">
                              <span>{bar.label}</span>
                              <span>{bar.value}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${bar.value}%` }}
                                transition={{ duration: 0.7, delay: 0.05 * i, ease: "easeOut" }}
                                className={`h-full rounded-full ${bar.color}`}
                              />
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  <div className="h-[1px] bg-white/10 w-full" />

                  {/* Bio-Components */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2.5">{t("juices.components")}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {juicesData[activeJuiceIdx].ingredients.map((ing, i) => (
                        <span 
                          key={i} 
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 flex items-center gap-1 hover:border-gold/50 hover:bg-white/10 transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3 text-gold-light" />
                          <span>{ing}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="h-[1px] bg-white/5 w-full lg:hidden" />

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-4 pt-2">
                    <a 
                      href="https://orders.food/AroHolistics?type=qr&utm_source=GMB"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-full bg-white hover:bg-cream text-forest-dark font-bold text-xs shadow-md transition-all duration-300 hover:shadow-lg flex items-center gap-1.5"
                    >
                      <span>{t("juices.order")}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button 
                      onClick={() => setSelectedJuice(juicesData[activeJuiceIdx])}
                      className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-white/35 text-white font-bold text-xs transition-all cursor-pointer"
                    >
                      {t("juices.clinical")}
                    </button>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ---------------- THE FULL SHELF (CATALOG) ---------------- */}
      <Shelf products={shelfProducts} />

      {/* ---------------- REVIEWS & SOCIAL PROOF ---------------- */}
      <section id="reviews" className="relative z-10 py-24 bg-white border-t border-b border-forest/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-xs font-bold tracking-widest text-sage uppercase mb-3">{t("reviews.badge")}</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-forest leading-tight mb-4">
              {language === "en" ? (
                <>
                  Quiet, <span className="italic text-gold-dark font-medium">steady</span> love.
                </>
              ) : (
                <>
                  Amor <span className="italic text-gold-dark font-medium">silencioso</span> y constante.
                </>
              )}
            </h2>
            <div className="flex gap-1 text-amber-500 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-500" />
              ))}
            </div>
            <div className="text-charcoal/60 text-xs mt-2 min-h-[1.5rem] flex flex-col sm:flex-row items-center justify-center gap-3">
              {googleStats ? (
                <span className="font-semibold text-forest">
                  {googleStats.rating.toFixed(1)} / 5.0 ({googleStats.total} {language === "en" ? "reviews on Google" : "reseñas en Google"})
                </span>
              ) : (
                <span>{t("reviews.subtext")}</span>
              )}
              <span className="hidden sm:inline text-forest/20">|</span>
              <a
                href="https://search.google.com/local/writereview?placeid=ChIJpWgLK2lZ54YRh7XQPLRAiK4"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage hover:text-forest transition-colors font-bold flex items-center gap-1"
              >
                <span>{language === "en" ? "Write a review" : "Escribir una reseña"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Testimonials Slider */}
          <div className="relative glassmorphism rounded-3xl p-8 sm:p-12 border border-forest/10 shadow-lg max-w-3xl mx-auto">
            <div className="absolute top-6 left-6 text-forest/10 font-serif text-9xl leading-none select-none pointer-events-none">
              “
            </div>

            <div className="min-h-[160px] flex flex-col justify-between">
              {reviews.length > 0 && reviews[activeReviewIdx] ? (
                <>
                  <p className="text-lg md:text-xl font-serif italic text-charcoal/80 relative z-10 leading-relaxed mb-8">
                    {reviews[activeReviewIdx].text}
                  </p>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="font-bold text-forest">{reviews[activeReviewIdx].author}</h4>
                      <span className="text-xs text-charcoal/50 flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span>{reviews[activeReviewIdx].source}</span>
                        <span className="w-1 h-1 rounded-full bg-charcoal/30" />
                        <span>{reviews[activeReviewIdx].tag}</span>
                        
                        <a
                          href={reviews[activeReviewIdx].url || "https://search.google.com/local/reviews?placeid=ChIJpWgLK2lZ54YRh7XQPLRAiK4"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-sage hover:text-forest transition-colors inline-flex items-center gap-0.5 ml-1.5"
                        >
                          <span>{language === "en" ? "View on Google" : "Ver en Google"}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </span>
                    </div>

                    <div className="flex gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={prevReview}
                        aria-label="Previous review"
                        className="p-2 rounded-full hover:bg-forest/5 text-forest transition-colors border border-forest/10 cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextReview}
                        aria-label="Next review"
                        className="p-2 rounded-full hover:bg-forest/5 text-forest transition-colors border border-forest/10 cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center py-10 text-charcoal/40 text-sm">
                  Loading testimonials...
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- MAKERS & PARTNERS ---------------- */}
      <Partners />

      {/* ---------------- PICKUP LOCATIONS ---------------- */}
      <section id="locations" className="relative z-10 py-28 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col items-center">
          <span className="text-xs font-bold tracking-widest text-sage uppercase mb-3">{t("loc.badge")}</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-forest leading-tight mb-4">
            {language === "en" ? (
              <>
                Find our <span className="italic text-gold-dark font-medium">holistic cold pressed juices</span>.
              </>
            ) : (
              <>
                Encuentra nuestros <span className="italic text-gold-dark font-medium">jugos holísticos prensados en frío</span>.
              </>
            )}
          </h2>
          <p className="text-charcoal/70">
            {language === "en" ? "Pickup spots around El Paso" : "Puntos de entrega en El Paso"} · <a href="tel:+19152558624" className="font-semibold text-forest hover:text-sage transition-colors">{t("btn.smsCall")}</a>
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
                </div>

                <h3 className="font-serif text-xl font-bold text-forest mb-2">
                  {loc.name === "Main Shop — ARO Holistics" 
                    ? (language === "en" ? "Main Shop — ARO Holistics" : "Tienda Principal — ARO Holistics")
                    : loc.name}
                </h3>
                <p className="text-xs text-charcoal/65 leading-relaxed mb-3">{loc.address}</p>
                <a
                  href={`https://www.instagram.com/${loc.instagram}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-sage font-semibold hover:text-forest transition-colors inline-block mb-6"
                >
                  @{loc.instagram}
                </a>
              </div>

              <a
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-white border border-forest/15 hover:border-forest/40 hover:bg-cream text-xs text-forest font-bold tracking-wider uppercase text-center flex items-center justify-center gap-2 transition-all duration-300"
              >
                <span>{t("loc.navigate")}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- EVENTS ---------------- */}
      <EventsSection />

      {/* ---------------- INTERACTIVE FOOTER ---------------- */}
      <footer className="relative z-10 bg-forest-dark text-white pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <a href="#" className="flex items-center gap-3 group">
              <span className="transition-transform group-hover:scale-105 duration-300">
                <img src={logoImg} alt="ARO Holistics Logo" className="w-12 h-12 object-contain" />
              </span>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-white leading-none">ARO</span>
                <span className="text-[10px] tracking-[0.25em] font-medium uppercase text-gold-light">Holistics</span>
              </div>
            </a>
            
            <p className="text-sm text-white/70 max-w-sm leading-relaxed">
              {t("footer.desc")}
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
          <div className="md:col-span-3 grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-serif text-lg font-bold text-gold-light mb-6">{t("footer.visit.title")}</h4>
              <ul className="flex flex-col gap-4 text-sm text-white/70">
                <li><a href="#locations" className="hover:text-white transition-colors">{t("footer.visit.locations")}</a></li>
                <li><a href="#events" className="hover:text-white transition-colors">{t("footer.visit.events")}</a></li>
                <li><a href="#partners" className="hover:text-white transition-colors">{t("footer.visit.partners")}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-gold-light mb-6">{t("footer.about.title")}</h4>
              <ul className="flex flex-col gap-4 text-sm text-white/70">
                <li><a href="#about" className="hover:text-white transition-colors">{t("footer.about.story")}</a></li>
                <li><a href="#shelf" className="hover:text-white transition-colors">{t("footer.about.shelf")}</a></li>
                <li><a href="https://orders.food/AroHolistics?type=qr&utm_source=GMB" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t("footer.about.order")}</a></li>
              </ul>
            </div>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <h4 className="font-serif text-lg font-bold text-gold-light">{t("footer.hq.title")}</h4>
            
            <div className="flex flex-col gap-4 text-sm text-white/70">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-light shrink-0 mt-0.5" />
                <span>230 N Copia Street, El Paso, TX 79905</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold-light shrink-0 mt-0.5" />
                <span>{t("btn.smsCall")}</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold-light shrink-0 mt-0.5" />
                <span>info@aroholistics.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sub-footer */}
        <div className="max-w-7xl mx-auto px-6 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/50">
          <p>© {new Date().getFullYear()} {t("footer.sub.note")}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-white transition-colors">{t("footer.terms")}</a>
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
                    <h3 className="font-serif text-lg font-bold text-forest">{t("modal.assessment.title")}</h3>
                    <p className="text-[10px] text-charcoal/50">{t("modal.assessment.subtitle")}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setModalOpen(false)}
                  aria-label="Close assessment"
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
              {/* Product photo banner */}
              <div className="relative h-44 overflow-hidden shrink-0">
                <img
                  src={selectedJuice.image}
                  alt={`${selectedJuice.name} bottle`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>

              <div className="p-8 pt-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-sage">{t("bottle.profile")}</span>
                    <h3 className="font-serif text-3xl font-bold text-forest mt-1">{selectedJuice.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedJuice(null)}
                    aria-label="Close formulation details"
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
                      <span>{t("bottle.ingredients")}</span>
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
                      <span>{t("bottle.targets")}</span>
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
                    {t("bottle.order")}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
    </MotionConfig>
  );
}
