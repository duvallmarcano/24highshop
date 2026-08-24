import type { QA } from '../lib/seo';
import { SITE, MIN_ORDER_EUR, toCHF, DEFAULT_LOCALE, type ShopId, type LocaleCode } from './site';
import globalFaq from './faq-global.json';
import productFaq from './faq-product.json';

/**
 * Answer-engine copy.
 *
 * Every answer here has to be *true* and *self-contained* — an assistant
 * lifting one out of context must not end up stating something false about
 * the shop. Anything that varies per product is generated from that
 * product's own data rather than asserted.
 */

const MIN_CHF = toCHF(MIN_ORDER_EUR);

/**
 * Applies to every page; kept short so each answer can be quoted whole.
 * Translated in full — these are the answers an assistant is most likely to
 * lift, so they have to be right in every language.
 */
const GLOBAL_BY_LOCALE = globalFaq as Record<string, QA[]>;

export function globalFAQ(locale: LocaleCode = DEFAULT_LOCALE): QA[] {
  return GLOBAL_BY_LOCALE[locale] ?? GLOBAL_BY_LOCALE[DEFAULT_LOCALE];
}

/** Kept for callers that have no locale to hand. */
export const GLOBAL_FAQ: QA[] = GLOBAL_BY_LOCALE[DEFAULT_LOCALE];

/** What people actually ask before buying from a given shop. */
export const SHOP_FAQ: Record<ShopId, QA[]> = {
  mushrooms: [
    {
      q: 'How long does a mushroom grow kit take to fruit?',
      a: 'An all-in-one grow kit usually produces its first flush two to three weeks after you start it, provided it is kept between 21 and 24 °C with high humidity. Most kits give two to four flushes before the substrate is exhausted.',
    },
    {
      q: 'What is the difference between a spore syringe and a liquid culture?',
      a: 'A spore syringe contains ungerminated spores, so colonisation starts from scratch and the genetics vary between spores. A liquid culture contains mycelium that has already germinated and been selected, so it colonises faster — typically half the time — and produces a uniform result.',
    },
    {
      q: 'Are magic truffles legal in Switzerland?',
      a: 'No. Psilocybin-containing truffles and mushrooms are controlled substances under Swiss narcotics law. 24highshop supplies grow kits, spores and cultivation equipment; psilocybin products are not shipped to Swiss addresses.',
    },
    {
      q: 'Do medicinal mushrooms contain psilocybin?',
      a: 'No. Lion’s mane, reishi, cordyceps, chaga and turkey tail contain no psilocybin and are not psychoactive. They are sold as food supplements and are legal throughout Switzerland.',
    },
  ],
  smartshop: [
    {
      q: 'What does kratom do, and how much should I take?',
      a: 'Kratom (Mitragyna speciosa) is stimulating at low doses and sedating at higher ones. Red vein is typically the most relaxing, white the most stimulating, green in between. Start at 1–2 g if you have not used it before, and do not combine it with alcohol, sedatives or MAO inhibitors.',
    },
    {
      q: 'Is kratom legal in Switzerland?',
      a: 'Kratom is not listed as a narcotic in Switzerland, but it is not authorised as a foodstuff or medicine either, so it is sold as a botanical specimen and not for consumption. Its status differs across Europe — check the rules where you live before ordering.',
    },
    {
      q: 'What is kanna used for?',
      a: 'Kanna (Sceletium tortuosum) is a South African succulent traditionally chewed or taken as a snuff. It is mildly mood-lifting and anxiolytic. It should not be combined with SSRIs or other serotonergic medication.',
    },
    {
      q: 'How long do mescaline cacti take to grow?',
      a: 'San Pedro (Trichocereus pachanoi) grows roughly 30–50 cm a year in good conditions, considerably faster than peyote, which takes a decade or more to reach maturity. Cacti are sold as ornamental plants.',
    },
  ],
  headshop: [
    {
      q: 'What should I look for in a grinder?',
      a: 'Aluminium or titanium beats plastic for edge retention. A four-piece grinder with a kief screen is the standard choice. Check the teeth are milled rather than cast, and that the thread turns smoothly without grit.',
    },
    {
      q: 'How do I store herbs so they keep?',
      a: 'Airtight, opaque, and around 59–63% relative humidity. Glass or stainless steel with a good seal, kept out of direct light. A two-way humidity pack holds the range without you having to manage it.',
    },
    {
      q: 'Is borosilicate glass worth the extra cost?',
      a: 'Yes, for anything heated. Borosilicate handles thermal shock far better than soda-lime glass, so it is much less likely to crack when a hot bowl meets cold water.',
    },
  ],
  seedshop: [
    {
      q: 'Is it legal to grow cannabis in Switzerland?',
      a: 'Cannabis containing less than 1% THC may be cultivated legally in Switzerland. Growing higher-THC cannabis is not permitted outside authorised pilot programmes. Seeds are sold as souvenirs and collectors’ items.',
    },
    {
      q: 'What is the difference between feminised and autoflowering seeds?',
      a: 'Feminised seeds produce female plants that flower when the light cycle shortens, so you control timing. Autoflowering seeds flower after a set number of weeks regardless of light, which makes them faster and simpler but usually smaller.',
    },
    {
      q: 'How long do cannabis seeds stay viable?',
      a: 'Stored cool, dark and dry — ideally in a sealed container in the fridge — seeds stay viable for around three to five years, with germination rates falling gradually after the first year.',
    },
  ],
  cbdshop: [
    {
      q: 'Is CBD legal in Switzerland?',
      a: 'Yes. Switzerland permits cannabis products containing less than 1% THC, a considerably higher threshold than the 0.2–0.3% applied across most of the EU. Swiss CBD products are therefore often stronger than their EU equivalents.',
    },
    {
      q: 'What is the difference between CBD oil, paste and crystals?',
      a: 'Oil is CBD extract diluted in a carrier oil, usually 5–30% strength, and the easiest to dose. Paste is a thicker, more concentrated full-spectrum extract. Crystals are isolated CBD at 98%+ purity with no other cannabinoids or terpenes.',
    },
    {
      q: 'Will CBD make me high?',
      a: 'No. CBD is not intoxicating. Full-spectrum products contain trace THC below the legal threshold, which can in rare cases register on a sensitive drug test, but will not produce a high.',
    },
  ],
  healthshop: [
    {
      q: 'What are adaptogens?',
      a: 'Adaptogens are plants — ashwagandha, rhodiola, ginseng among them — traditionally used to help the body cope with stress. Effects are typically cumulative over weeks rather than immediate.',
    },
    {
      q: 'Can I take these alongside prescription medication?',
      a: 'Ask a doctor or pharmacist first. Several common supplements interact with prescription drugs — St John’s wort with many medications, ashwagandha with thyroid treatment, rhodiola with antidepressants.',
    },
    {
      q: 'How long before I notice anything?',
      a: 'Nootropics such as L-theanine or caffeine combinations act within an hour. Adaptogens and medicinal mushrooms are cumulative and usually take two to six weeks of consistent use.',
    },
  ],
};

/** Product-level questions, answered from that product's own record. */
const PRODUCT_BY_LOCALE = productFaq as Record<
  string,
  Record<'price' | 'stockYes' | 'stockNo' | 'pack', QA>
>;

function fill(text: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (out, [k, v]) => out.replaceAll(`{${k}}`, String(v)),
    text
  );
}

export function productFAQ(
  p: {
    title: string;
    priceEUR: number | null;
    inStock: boolean;
    categoryLabel: string;
    shop: string;
  },
  locale: LocaleCode = DEFAULT_LOCALE
): QA[] {
  const T = PRODUCT_BY_LOCALE[locale] ?? PRODUCT_BY_LOCALE[DEFAULT_LOCALE];
  const chf = p.priceEUR === null ? null : toCHF(p.priceEUR);
  const vars = {
    title: p.title,
    chf: chf === null ? '' : chf.toFixed(2),
    eur: p.priceEUR === null ? '' : p.priceEUR.toFixed(2),
    min: MIN_ORDER_EUR,
    minchf: MIN_CHF.toFixed(0),
    city: SITE.address.locality,
    cutoff: SITE.cutoff,
    category: p.categoryLabel,
  };

  const out: QA[] = [];
  if (chf !== null) out.push({ q: fill(T.price.q, vars), a: fill(T.price.a, vars) });
  const stock = p.inStock ? T.stockYes : T.stockNo;
  out.push({ q: fill(stock.q, vars), a: fill(stock.a, vars) });
  out.push({ q: fill(T.pack.q, vars), a: fill(T.pack.a, vars) });
  return out;
}
