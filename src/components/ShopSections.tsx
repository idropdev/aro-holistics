/**
 * Sections ported from aroholisticsshop.com — display-only, zero commerce.
 * Ticker, Pillars, Weekly Press, Full Shelf (with filter tabs + detail modal),
 * Partners/Makers, and Events.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Sprout, CalendarDays, ExternalLink } from "lucide-react";

/** lucide-react no longer ships brand icons — same inline SVG as the footer */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}
import { useLanguage } from "../context/LanguageContext";
import {
  type ShelfProduct,
  type ShelfCategory
} from "../data/translations";

const ORDER_URL = "https://orders.food/AroHolistics?type=qr&utm_source=GMB";

/* ------------------------------------------------------------------ */
/* 1. Announcement ticker                                               */
/* ------------------------------------------------------------------ */

export function Ticker() {
  const { localizedData } = useLanguage();
  // Track is rendered twice so the -50% translate loops seamlessly
  const track = (
    <>
      {localizedData.tickerItems.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-6 shrink-0">
          <span>{item}</span>
          <span className="text-gold" aria-hidden="true">✦</span>
        </span>
      ))}
    </>
  );
  return (
    <div className="marquee-group bg-ink text-cream/90 text-[11px] font-medium tracking-[0.18em] uppercase overflow-hidden select-none" aria-label="Shop announcements">
      <div className="animate-marquee flex w-max items-center gap-6 py-2.5 whitespace-nowrap">
        {track}
        <span aria-hidden="true" className="flex items-center gap-6">{track}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Three-pillar "how we make it"                                     */
/* ------------------------------------------------------------------ */

export function Pillars() {
  const { localizedData } = useLanguage();
  return (
    <section className="relative z-10 py-20 bg-white border-y border-forest/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {localizedData.pillars.map((p, i) => (
          <motion.div
            key={p.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col gap-4 p-8 rounded-3xl bg-cream/60 border border-forest/10 hover:border-gold/40 transition-colors"
          >
            <span className="font-serif text-4xl text-gold/80 font-light">{p.number}</span>
            <h3 className="font-serif text-2xl font-semibold text-forest">{p.title}</h3>
            <p className="text-sm text-charcoal/70 leading-relaxed">{p.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Shared product card (display-only)                                   */
/* ------------------------------------------------------------------ */

function ProductCard({
  product,
  onOpen
}: {
  product: ShelfProduct;
  onOpen: (p: ShelfProduct) => void;
}) {
  const { t } = useLanguage();
  return (
    <button
      onClick={() => onOpen(product)}
      className="group relative text-left rounded-3xl overflow-hidden bg-white border border-forest/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-gold cursor-pointer flex flex-col h-full w-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream w-full shrink-0">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover reveal — description slides up */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-ink/85 backdrop-blur-sm p-4">
          <p className="text-[11px] text-white/85 leading-relaxed line-clamp-4">{product.description}</p>
        </div>
        <span className="absolute top-3 left-3 text-[9px] font-bold tracking-wider uppercase text-white bg-ink/60 px-2.5 py-1 rounded-full border border-white/15 backdrop-blur-md">
          {t(`cat.${product.category}`)}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1 justify-between w-full">
        <div className="flex flex-col gap-1">
          <h3 className="font-serif text-lg font-semibold text-forest leading-snug line-clamp-2">{product.name}</h3>
          {product.maker ? (
            <span className="text-[10px] uppercase tracking-wider text-sage font-semibold">{product.maker}</span>
          ) : (
            <span className="text-[10px] text-transparent select-none font-semibold">&nbsp;</span>
          )}
        </div>
        <span className="text-sm text-charcoal/70 font-medium mt-auto pt-2 border-t border-forest/5">
          {product.price} <span className="text-charcoal/40">/ {product.unit}</span>
        </span>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Display-only product detail modal                                    */
/* ------------------------------------------------------------------ */

function ProductModal({
  product,
  onClose
}: {
  product: ShelfProduct | null;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-forest-dark/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl border border-forest/10 shadow-2xl overflow-hidden z-10 grid grid-cols-1 sm:grid-cols-2"
          >
            <div className="relative h-56 sm:h-full min-h-[220px] bg-cream">
              <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="p-7 flex flex-col gap-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-sage">{t(`cat.${product.category}`)}</span>
                  <h3 className="font-serif text-2xl font-bold text-forest mt-1 leading-tight">{product.name}</h3>
                  {product.maker && (
                    <p className="text-xs text-charcoal/60 mt-1">{t("prod.by")} {product.maker}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close product details"
                  className="p-2 rounded-full hover:bg-forest/5 text-forest border border-forest/10 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <span className="text-lg font-semibold text-forest">
                {product.price} <span className="text-sm text-charcoal/50 font-normal">/ {product.unit}</span>
              </span>

              <p className="text-sm text-charcoal/75 leading-relaxed">{product.description}</p>

              {product.ingredients && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-forest/60 mb-2">{t("prod.ingredients")}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.ingredients.map((ing, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-cream border border-forest/10 text-charcoal/70">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <a
                href={ORDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-forest text-white hover:bg-forest-light text-xs font-bold transition-colors"
              >
                <span>{t("prod.availability")}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* 3. This Week's Press (featured)                                      */
/* ------------------------------------------------------------------ */

export function WeeklyPress({ products }: { products: ShelfProduct[] }) {
  const [selected, setSelected] = useState<ShelfProduct | null>(null);
  const { t } = useLanguage();
  return (
    <section id="press" className="relative z-10 py-24 max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-14 flex flex-col items-center">
        <span className="text-xs font-bold tracking-widest text-sage uppercase mb-3">{t("press.badge")}</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-forest leading-tight mb-4">
          {t("press.heading")}
        </h2>
        <p className="text-charcoal/70 text-sm">
          {t("press.subtext")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto items-stretch">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onOpen={setSelected} />
        ))}
      </div>

      <div className="text-center mt-12">
        <a
          href="#shelf"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-forest text-white hover:bg-forest-light font-bold text-sm shadow-md transition-all duration-300 hover:-translate-y-0.5"
        >
          {t("press.cta")}
        </a>
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. The Full Shelf (catalog with filter tabs)                         */
/* ------------------------------------------------------------------ */

const CATEGORIES: ("All" | ShelfCategory)[] = ["All", "Juice", "Mushrooms", "Snacks", "Supplements", "Other"];

export function Shelf({ products }: { products: ShelfProduct[] }) {
  const { t } = useLanguage();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [selected, setSelected] = useState<ShelfProduct | null>(null);
  const visible = category === "All" ? products : products.filter((p) => p.category === category);

  return (
    <section id="shelf" className="relative z-10 py-24 bg-white border-y border-forest/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col items-center">
          <span className="text-xs font-bold tracking-widest text-sage uppercase mb-3">{t("shelf.badge")}</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-forest leading-tight mb-4">
            {t("shelf.heading")}
          </h2>
          <p className="text-charcoal/70 text-sm">
            {t("shelf.subtext")}
          </p>
        </div>

        {/* Category filter tabs — client-side only */}
        <div className="flex flex-wrap justify-center gap-2 mb-12" role="tablist" aria-label="Product categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={category === cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${
                category === cat
                  ? "bg-forest text-white shadow-md"
                  : "bg-cream text-forest/70 border border-forest/10 hover:border-forest/30"
              }`}
            >
              {t(`cat.${cat}`)}
            </button>
          ))}
        </div>

        {visible.length > 0 ? (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 items-stretch">
            <AnimatePresence mode="popLayout">
              {visible.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col h-full"
                >
                  <ProductCard product={p} onOpen={setSelected} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <p className="text-center text-charcoal/50 text-sm py-16">
            {t("shelf.empty")}
          </p>
        )}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Partners / Makers                                                 */
/* ------------------------------------------------------------------ */

const MAKER_ROTATE_MS = 5000;

export function Partners() {
  const { localizedData, t } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = localizedData.makers[activeIdx];

  // Auto-rotate the spotlight; restarting the interval on every change keeps
  // a consistent delay after a manual pick too. Skips ticks while the tab is
  // hidden so animations don't pile up in the background.
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      if (!document.hidden) setActiveIdx((i) => (i + 1) % localizedData.makers.length);
    }, MAKER_ROTATE_MS);
    return () => clearInterval(t);
  }, [paused, activeIdx, localizedData.makers.length]);

  return (
    <section id="partners" className="relative z-10 py-24 bg-forest-dark text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 flex flex-col items-center">
          <span className="text-xs font-bold tracking-widest text-gold-light uppercase mb-3">{t("partners.badge")}</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight mb-4">
            {t("partners.heading")}
          </h2>
          <p className="text-white/70 text-sm">
            {t("partners.subtext")}
          </p>
        </div>

        {/* Spotlight — expands whichever maker is active */}
        <div
          className="max-w-3xl mx-auto mb-10 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden min-h-[280px] sm:min-h-[250px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="absolute -top-[20%] -right-[10%] w-[260px] h-[260px] rounded-full bg-gold/10 blur-[70px] pointer-events-none" />
          <AnimatePresence mode="wait">
            <motion.div
              key={active.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="relative z-10 flex flex-col gap-4 p-8 sm:p-10"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="p-2 rounded-xl bg-gold/15 text-gold-light"><Sprout className="w-5 h-5" /></span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold">{active.name}</h3>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
                <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-white/80">{active.category}</span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-white/80 inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {active.location}
                </span>
                {active.itemsOnShelf && (
                  <span className="px-2.5 py-1 rounded-full bg-gold/15 border border-gold/25 text-gold-light">
                    {active.itemsOnShelf} {t("partners.items")}
                  </span>
                )}
              </div>
              <p className="text-sm text-white/75 leading-relaxed">{active.description}</p>
              {active.instagram && (
                <a
                  href={`https://www.instagram.com/${active.instagram}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gold-light hover:text-gold text-xs font-bold transition-colors w-fit"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>@{active.instagram}</span>
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Maker tiles — click to spotlight */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" role="tablist" aria-label="Makers">
          {localizedData.makers.map((m, i) => (
            <button
              key={m.name}
              role="tab"
              aria-selected={i === activeIdx}
              onClick={() => setActiveIdx(i)}
              className={`rounded-2xl p-5 flex flex-col gap-1.5 text-left transition-all cursor-pointer ${
                i === activeIdx
                  ? "bg-gold/15 border border-gold/50 ring-1 ring-gold/40 shadow-lg shadow-gold/10"
                  : "bg-white/5 border border-white/10 hover:border-gold/40 hover:bg-white/10"
              }`}
            >
              <span className={`text-[9px] font-bold uppercase tracking-wider ${i === activeIdx ? "text-gold-light" : "text-gold-light/70"}`}>
                {m.category}
              </span>
              <h4 className={`font-serif text-base font-semibold leading-snug ${i === activeIdx ? "text-white" : "text-white/85"}`}>
                {m.name}
              </h4>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Events (empty-state friendly)                                     */
/* ------------------------------------------------------------------ */

export function EventsSection() {
  const { t } = useLanguage();
  return (
    <section id="events" className="relative z-10 py-24 max-w-5xl mx-auto px-6">
      <div className="text-center flex flex-col items-center">
        <span className="text-xs font-bold tracking-widest text-sage uppercase mb-3">{t("events.badge")}</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-forest leading-tight mb-4">
          {t("events.heading")}
        </h2>
        <div className="mt-6 w-full max-w-xl rounded-3xl border border-dashed border-forest/20 bg-white/60 p-10 flex flex-col items-center gap-3">
          <span className="p-3 rounded-full bg-forest/5 text-forest"><CalendarDays className="w-6 h-6" /></span>
          <p className="text-charcoal/60 text-sm">{t("events.empty")}</p>
          <p className="text-charcoal/40 text-xs">
            {t("events.subtext").split("@aro_holistics")[0]}
            <a href="https://www.instagram.com/aro_holistics/" target="_blank" rel="noopener noreferrer" className="text-sage font-semibold hover:text-forest transition-colors">@aro_holistics</a>
            {t("events.subtext").split("@aro_holistics")[1]}
          </p>
        </div>
      </div>
    </section>
  );
}
