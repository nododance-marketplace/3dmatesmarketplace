// ── Strata Labs partnership data ─────────────────────────────────────────
// 3DMates partners with Strata Labs (https://stratalabs3d.com) to offer
// network members competitive rates on metal 3D printers. Cards link straight
// to the Strata Labs storefront.

export const STRATA_URL = "https://stratalabs3d.com";

export type StrataPrinter = {
  name: string;
  category: string;
  specLine: string;
  price: string;
  image?: string;
  href: string;
  comingSoon?: boolean;
  featured?: boolean;
};

export const strataPrinters: StrataPrinter[] = [
  {
    name: "SL 3DMPDESK",
    category: "Desktop",
    specLine: "Ø100 × 70 mm build · 300 W fiber laser · CoCr & titanium",
    price: "$33,000",
    image: "/partners/strata/products/sl-3dmpdesk.png",
    href: `${STRATA_URL}/products/sl-3dmpdesk`,
    featured: true,
  },
  {
    name: "SL 3DMP220",
    category: "Dental",
    specLine: "220 × 140 × 100 mm · dual 500 W lasers · 300 crowns / run",
    price: "Competitive rates",
    image: "/partners/strata/products/sl-3dmp220.png",
    href: `${STRATA_URL}/products/sl-3dmp220`,
    featured: true,
  },
  {
    name: "SL 3DMP300",
    category: "Industrial",
    specLine: "Large-format SLM · steel, nickel, titanium & aluminum alloys",
    price: "Competitive rates",
    image: "/partners/strata/products/sl-3dmp300.png",
    href: `${STRATA_URL}/products/sl-3dmp300`,
    featured: true,
  },
  {
    name: "SL 3DMP420",
    category: "Industrial",
    specLine: "Super-large multi-laser SLM · powder circulation system",
    price: "Competitive rates",
    image: "/partners/strata/products/sl-3dmp420.png",
    href: `${STRATA_URL}/products/sl-3dmp420`,
    featured: true,
  },
  {
    name: "SL 3DMP140",
    category: "Dental",
    specLine: "Ø140 × 170 mm build · 500 W laser · ~150 teeth per run",
    price: "Competitive rates",
    image: "/partners/strata/products/sl-3dmp140.png",
    href: `${STRATA_URL}/products/sl-3dmp140`,
  },
];

export const strataComingSoon: StrataPrinter[] = [
  {
    name: "SLS Nylon Printer",
    category: "SLS",
    specLine: "Selective Laser Sintering · strong nylon & composite parts",
    price: "Coming soon",
    href: `${STRATA_URL}/shop`,
    comingSoon: true,
  },
  {
    name: "Resin Printer",
    category: "Resin",
    specLine: "SLA / DLP resin · ultra-fine detail & smooth finish",
    price: "Coming soon",
    href: `${STRATA_URL}/shop`,
    comingSoon: true,
  },
  {
    name: "Large-Format FDM",
    category: "FDM",
    specLine: "Industrial FDM · large build volumes for tooling & prototypes",
    price: "Coming soon",
    href: `${STRATA_URL}/shop`,
    comingSoon: true,
  },
];
