export type Scent = {
  name: string;
  line: string;
  liquid: string;
  accent: string;
  glow: string;
  price: number;
  notes: { top: string; heart: string; base: string };
  desc: string;
};

export const SCENTS: Scent[] = [
  {
    name: "Oud Impérial",
    line: "The signature",
    liquid: "#C07F2A",
    accent: "#D9A94F",
    glow: "rgba(217,169,79,.17)",
    price: 240,
    notes: { top: "Saffron · Bergamot", heart: "Smoked oud · Rose", base: "Amber · Leather" },
    desc: "Smoked oud wrapped in amber and old leather — the one people remember you by.",
  },
  {
    name: "Rose Velours",
    line: "The romantic",
    liquid: "#A93350",
    accent: "#E58AA5",
    glow: "rgba(229,138,165,.15)",
    price: 225,
    notes: { top: "Pink pepper · Litchi", heart: "Damask rose · Peony", base: "Velvet musk · Suede" },
    desc: "Damask rose at dusk, soft as suede. Intimate, never sweet for the sake of it.",
  },
  {
    name: "Vétiver Vert",
    line: "The purist",
    liquid: "#5C7434",
    accent: "#A9C686",
    glow: "rgba(169,198,134,.14)",
    price: 210,
    notes: { top: "Grapefruit · Basil", heart: "Vétiver · Fig leaf", base: "Cedar · Oakmoss" },
    desc: "Green, dry and impossibly clean — a white shirt in a bottle, cut perfectly.",
  },
];

/** Mutable bridge between the React UI and the Three.js render loop. */
export const stage = {
  progress: 0,
  scent: 0,
  capTarget: 0, // 0 closed, 1 lifted
};
