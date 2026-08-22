/**
 * Short-form information pages. They live as data rather than as eight
 * near-identical .astro files, because the only thing that varies is the copy.
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
    description: 'Delivery times, shipping costs, packaging and how to return an order.',
    intro:
      'Orders placed before 17:00 on a working day are packed and dispatched the same day, in plain packaging with nothing on the outside that identifies the contents.',
    sections: [
      {
        heading: 'Delivery times',
        body: [
          'Netherlands and Belgium: 1–2 working days. Germany, France and the rest of the EU: 2–5 working days. Every parcel is tracked, and the tracking code reaches you by email as soon as the label is created.',
          'Fresh products such as truffles and grow kits are shipped early in the week so they do not sit in a depot over a weekend.',
        ],
      },
      {
        heading: 'Shipping costs',
        body: [
          'Shipping is free on EU orders over €50. Below that, the cost is calculated at checkout from the destination and the weight of the parcel.',
        ],
      },
      {
        heading: 'Packaging',
        body: [
          'Everything ships in neutral, unmarked boxes or bags. There is no branding, no product name and no indication of the sender on the outside of the parcel.',
        ],
      },
      {
        heading: 'Returns',
        body: [
          'Unopened, undamaged items can be returned within 14 days of delivery for a refund. Perishable goods — fresh truffles, grow kits and anything with a live culture — are excluded, as are opened consumables, for hygiene reasons.',
          'Contact us before sending anything back so we can confirm the return address and expect the parcel.',
        ],
      },
    ],
  },
  {
    slug: 'contact',
    title: 'Contact',
    description: 'How to reach 24High about an order, a product or advice before you buy.',
    intro:
      'Questions about an order, a product, or what to choose — email is the fastest route, and it reaches the people who pack the boxes.',
    sections: [
      {
        heading: 'Email',
        body: [
          'info@24high.com — we answer within one working day, usually much sooner. Include your order number if your question is about an existing order.',
        ],
      },
      {
        heading: 'Advice before you buy',
        body: [
          'If you are not sure which strain, dose or grow kit suits you, ask. We would rather spend five minutes on an email than have you buy the wrong thing.',
        ],
      },
      {
        heading: 'Something wrong with an order',
        body: [
          'Damaged in transit, missing an item, or a grow kit that has not started? Send a photo with your order number and we will sort it out.',
        ],
      },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms & conditions',
    description: 'The terms that apply to orders placed with 24High.',
    intro:
      'These terms apply to every order placed through this site. They sit alongside your statutory rights as an EU consumer rather than replacing them.',
    sections: [
      {
        heading: 'Who you are buying from',
        body: [
          '24High is a retailer registered in the Netherlands. All prices shown include VAT at the applicable Dutch rate unless stated otherwise.',
        ],
      },
      {
        heading: 'Age requirement',
        body: [
          'You must be 18 or over to order. We may ask for proof of age, and we will cancel and refund any order where we have reason to believe the buyer is under 18.',
        ],
      },
      {
        heading: 'Availability and pricing',
        body: [
          'Stock levels and prices are kept current, but errors happen. If a product turns out to be unavailable or was listed at a clearly incorrect price, we will contact you before charging and offer a refund or an alternative.',
        ],
      },
      {
        heading: 'Import restrictions',
        body: [
          'Some products are legal in the Netherlands but restricted or prohibited elsewhere. Checking what may lawfully be imported into your country is your responsibility. We cannot refund parcels seized by customs.',
        ],
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy policy',
    description: 'What personal data 24High collects, why, and what happens to it.',
    intro:
      'We collect the minimum needed to take payment and get a parcel to you, and we do not sell or share it for marketing.',
    sections: [
      {
        heading: 'What we collect',
        body: [
          'Your name, delivery address, email address and order history. Payment details are handled by the payment provider and never reach our servers.',
        ],
      },
      {
        heading: 'Why we hold it',
        body: [
          'To process and deliver your order, to handle returns and support requests, and to meet the record-keeping obligations that apply to a registered retailer.',
        ],
      },
      {
        heading: 'How long',
        body: [
          'Order records are kept for seven years, as Dutch tax law requires. Everything else is deleted on request.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'Under the GDPR you can ask for a copy of the data we hold on you, ask us to correct it, or ask us to delete it. Email info@24high.com and we will respond within 30 days.',
        ],
      },
    ],
  },
  {
    slug: 'cookies',
    title: 'Cookie policy',
    description: 'The cookies this site sets and what they do.',
    intro:
      'This site keeps its cookie use small: what is needed to run a basket, plus anonymous analytics.',
    sections: [
      {
        heading: 'Strictly necessary',
        body: [
          'Your basket contents and your light/dark preference are stored in your own browser. They never leave your device and are not readable by us.',
        ],
      },
      {
        heading: 'Analytics',
        body: [
          'We use aggregate analytics to see which pages and products people look at, so we know what to stock and what to write about. It is not used to identify individuals.',
        ],
      },
      {
        heading: 'Turning them off',
        body: [
          'Blocking cookies in your browser will not break browsing or reading, but the basket will not remember what you put in it between visits.',
        ],
      },
    ],
  },
  {
    slug: 'disclaimer',
    title: 'Disclaimer',
    description: 'Important limits on the information and products offered by 24High.',
    intro:
      'Nothing on this site is medical advice, and nothing here should be read as encouragement to break the law where you live.',
    sections: [
      {
        heading: 'Not medical advice',
        body: [
          'The guides on this site describe traditional use, botany and the published research as we understand it. They are not a substitute for a doctor. If you take prescription medication — particularly antidepressants, MAO inhibitors or blood pressure medication — talk to a professional before using anything psychoactive.',
        ],
      },
      {
        heading: 'Use responsibly',
        body: [
          'Start low. Do not combine substances. Do not drive. Have a sober person present if you are trying something for the first time, and give yourself somewhere safe and unhurried to be.',
        ],
      },
      {
        heading: 'Legality',
        body: [
          'Products offered here are legal to sell in the Netherlands. Their status elsewhere varies and changes. You are responsible for knowing the law that applies to you.',
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
