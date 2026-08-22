import { SITE } from './site';

/**
 * Short-form information pages. They live as data rather than as six
 * near-identical .astro files, because the only thing that varies is copy.
 *
 * Written for Swiss law: revDSG rather than GDPR as the primary regime, Swiss
 * VAT at 8.1%, and the Obligationenrecht rather than the EU distance-selling
 * directive. Have a Swiss lawyer read these before launch.
 */
export interface InfoPage {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}

export const INFO_PAGES: InfoPage[] = [
  {
    slug: 'shipping',
    title: 'Shipping & returns',
    description:
      'Delivery times from Zürich, shipping costs in CHF, packaging, customs and how to return an order.',
    intro:
      'Orders placed before 16:00 on a working day are picked from Swiss stock and dispatched the same day, in plain packaging with nothing on the outside identifying the contents.',
    sections: [
      {
        heading: 'Delivery times',
        body: [
          'Switzerland and Liechtenstein: one to two working days by Swiss Post. Germany, Austria and France: two to four working days. The rest of Europe: three to six. Every parcel is tracked, and the tracking code reaches you by email when the label is created.',
          'Perishables — fresh truffles, grow kits, anything with a live culture — ship early in the week so they do not sit in a depot over the weekend.',
        ],
      },
      {
        heading: 'Shipping costs and minimum order',
        body: [
          'Nothing. Shipping is included on every order, in Switzerland and across Europe, and every parcel is tracked. That is possible because there is a minimum order value of €200 — roughly CHF 210 — which you can reach with any mix of products.',
        ],
      },
      {
        heading: 'Customs and import',
        body: [
          'Swiss orders ship domestically — no customs, no import duty, no handling fee. Orders leaving Switzerland cross a customs border, and any duty or VAT charged on arrival is payable by you. Some products cannot lawfully be imported into some countries; checking that is your responsibility, and we cannot refund parcels seized by customs.',
        ],
      },
      {
        heading: 'Packaging',
        body: [
          'Plain, unmarked boxes and bags. No branding, no product name, nothing on the outside indicating what is inside or that it came from a smartshop. The sender line shows a neutral company name.',
        ],
      },
      {
        heading: 'Returns',
        body: [
          'Unopened, undamaged items can be returned within 14 days of delivery for a refund. Perishable goods and opened consumables are excluded for hygiene reasons, as are seeds once the packaging is broken.',
          'Contact us before sending anything back so we can confirm the return address and expect the parcel. Return postage is payable by you unless the item arrived faulty or we sent the wrong thing.',
        ],
      },
    ],
  },
  {
    slug: 'contact',
    title: 'Contact',
    description:
      'How to reach 24highshop in Zürich about an order, a product, or advice before you buy.',
    intro:
      'Email reaches the people who pack the boxes. For anything about an order, include your order number and we will have the answer in front of us.',
    sections: [
      {
        heading: 'Email',
        body: [
          'hello@24highshop.com — answered within one working day, usually much sooner. We read everything in English, German, French and Italian.',
        ],
      },
      {
        heading: 'Advice before you buy',
        body: [
          'If you are not sure which strain, dose, kit or strength suits you, ask before ordering. We would rather spend five minutes on an email than have you buy the wrong thing and be disappointed — or worse, take too much of something.',
        ],
      },
      {
        heading: 'Something wrong with an order',
        body: [
          'Damaged in transit, missing an item, or a grow kit that has not started colonising after three weeks? Send a photo with your order number. Grow kits that fail through no fault of yours are replaced.',
        ],
      },
      {
        heading: 'Post',
        body: [
          // one source of truth: the postal address lives in site.ts
          `${SITE.legalName}, ${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.locality}, ${SITE.address.countryName}. Please do not send returns to this address without contacting us first.`,
        ],
      },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms & conditions',
    description:
      'The terms that apply to orders placed with 24highshop AG, a company registered in Zürich, Switzerland.',
    intro:
      'These terms apply to every order placed through this site. They sit alongside your rights under the Swiss Code of Obligations rather than replacing them.',
    sections: [
      {
        heading: 'Who you are buying from',
        body: [
          '24highshop AG, registered in Zürich, Switzerland under UID CHE-000.000.000. Prices can be displayed in Swiss francs or euros using the currency switch; both include Swiss VAT at 8.1%. The EUR figure is converted at a fixed internal rate.',
        ],
      },
      {
        heading: 'Age requirement',
        body: [
          'You must be 18 or over to order. We may ask for proof of age, and we will cancel and refund any order where we have reason to believe the buyer is under 18.',
        ],
      },
      {
        heading: 'Payment and minimum order',
        body: [
          'We accept Bitcoin and bank transfer only. Bitcoin is settled on-chain, with the exchange rate locked for 15 minutes once you reach checkout; if payment does not arrive inside that window the rate is recalculated. Bank transfer accepts SEPA and Swiss IBAN, and goods are dispatched once the funds clear.',
          'There is a minimum order value of €200. Both methods are settled manually, which is what makes smaller orders uneconomic — and what allows shipping to be included on every order.',
        ],
      },
      {
        heading: 'Availability and pricing',
        body: [
          'Stock levels and prices are kept current, but errors happen. If a product turns out to be unavailable or was listed at a clearly incorrect price, we will contact you before charging and offer a refund or an alternative. A listing is an invitation to treat, not a binding offer.',
        ],
      },
      {
        heading: 'What we will not ship',
        body: [
          'We do not ship controlled substances. Psilocybin-containing mushrooms and truffles are controlled under Swiss narcotics law and are not sold to Swiss addresses. Cannabis seeds and CBD products are sold in line with the Swiss 1% THC threshold.',
        ],
      },
      {
        heading: 'Import restrictions',
        body: [
          'Several products are lawful in Switzerland but restricted or prohibited elsewhere. Checking what may lawfully be imported into your country is your responsibility. We cannot refund parcels seized by customs, and we cannot advise on foreign law.',
        ],
      },
      {
        heading: 'Governing law',
        body: [
          'Swiss law governs these terms. The place of jurisdiction is Zürich, subject to any mandatory consumer protection rules that apply where you live.',
        ],
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy policy',
    description:
      'What personal data 24highshop collects, why, how long it is kept, and your rights under the Swiss Data Protection Act.',
    intro:
      'We collect the minimum needed to take payment and get a parcel to you. We do not sell your data, and we do not share it for advertising.',
    sections: [
      {
        heading: 'What we collect',
        body: [
          'Your name, delivery address, email address and order history. Payment details are handled entirely by the payment provider and never reach our servers — we see that a payment succeeded, not the card number behind it.',
        ],
      },
      {
        heading: 'Why we hold it',
        body: [
          'To process and deliver your order, handle returns and support requests, and meet the record-keeping obligations that apply to a registered Swiss retailer.',
        ],
      },
      {
        heading: 'How long',
        body: [
          'Order and invoice records are kept for ten years, as Swiss commercial law requires. Everything not subject to that obligation is deleted on request.',
        ],
      },
      {
        heading: 'Where your data sits',
        body: [
          'Order data is held on servers in Switzerland. Where a processor outside Switzerland is used — a shipping carrier, for example — only the data needed for that job is transferred, and only to countries with adequate protection or under contractual safeguards.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'Under the revised Swiss Federal Act on Data Protection (revDSG) you can ask for a copy of the data we hold on you, ask us to correct it, or ask us to delete it. If you are in the EU, the GDPR gives you equivalent rights and we honour them the same way. Email hello@24highshop.com and we will respond within 30 days.',
        ],
      },
    ],
  },
  {
    slug: 'cookies',
    title: 'Cookie policy',
    description: 'The cookies and browser storage this site uses, and what each one does.',
    intro:
      'This site keeps its cookie use small: what is needed to run a basket, plus aggregate analytics. No advertising trackers.',
    sections: [
      {
        heading: 'Strictly necessary',
        body: [
          'Your basket contents and your light/dark preference are stored in your own browser using localStorage. They never leave your device, are not readable by us, and are not shared with anyone.',
        ],
      },
      {
        heading: 'Analytics',
        body: [
          'We use aggregate analytics to see which pages and products people look at, so we know what to stock and what to write about. It is not used to identify individuals and is not shared with advertising networks.',
        ],
      },
      {
        heading: 'Turning them off',
        body: [
          'Blocking cookies in your browser will not break browsing or reading. The basket will simply not remember what you put in it between visits.',
        ],
      },
    ],
  },
  {
    slug: 'disclaimer',
    title: 'Disclaimer',
    description:
      'Important limits on the information and products offered by 24highshop — not medical advice, and not encouragement to break the law.',
    intro:
      'Nothing on this site is medical advice, and nothing here should be read as encouragement to break the law where you live.',
    sections: [
      {
        heading: 'Not medical advice',
        body: [
          'Our guides describe traditional use, botany and the published research as we understand it. They are not a substitute for a doctor or pharmacist. If you take prescription medication — particularly antidepressants, MAO inhibitors, thyroid medication or blood pressure medication — talk to a professional before using anything psychoactive or any new supplement.',
        ],
      },
      {
        heading: 'Use responsibly',
        body: [
          'Start low. Do not combine substances. Do not drive. Have a sober person present if you are trying something for the first time, and give yourself somewhere safe and unhurried to be. If something goes wrong, calling for medical help is always the right decision — Swiss emergency services are 144.',
        ],
      },
      {
        heading: 'Legality',
        body: [
          'Products offered here are lawful to sell in Switzerland. Their status elsewhere varies and changes. Cannabis below 1% THC is legal in Switzerland; psilocybin is not, and we do not sell it. Kratom is unlisted here but not authorised as a foodstuff, so it is sold as a botanical specimen and not for consumption. You are responsible for knowing the law that applies to you.',
        ],
      },
      {
        heading: 'Strictly 18+',
        body: ['We do not sell to anyone under the age of 18 under any circumstances.'],
      },
    ],
  },
];

export const INFO_BY_SLUG = new Map(INFO_PAGES.map((p) => [p.slug, p]));
