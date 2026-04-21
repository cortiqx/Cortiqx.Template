import wedding1 from "@/assets/template-wedding-1.jpg";
import wedding2 from "@/assets/template-wedding-2.jpg";
import portfolio1 from "@/assets/template-portfolio-1.jpg";
import portfolio2 from "@/assets/template-portfolio-2.jpg";
import business1 from "@/assets/template-business-1.jpg";
import invitation1 from "@/assets/template-invitation-1.jpg";

export type Category = "Wedding" | "Portfolio" | "Business" | "Invitation";

export interface Template {
  id: string;
  title: string;
  description: string;
  price: number; // 0 = free, INR otherwise
  category: Category;
  tags: string[];
  cover: string;
  gallery: string[];
  author: string;
  trending?: boolean;
  isNew?: boolean;
}

const allImages = [wedding1, wedding2, portfolio1, portfolio2, business1, invitation1];
const buildGallery = (cover: string) =>
  Array.from({ length: 10 }, (_, i) => (i === 0 ? cover : allImages[(i + 2) % allImages.length]));

export const categories: { key: Category | "All"; label: string; emoji: string }[] = [
  { key: "All", label: "All", emoji: "✨" },
  { key: "Wedding", label: "Wedding", emoji: "💍" },
  { key: "Invitation", label: "Invitation", emoji: "💌" },
  { key: "Portfolio", label: "Portfolio", emoji: "🎨" },
  { key: "Business", label: "Business", emoji: "💼" },
];

export const templates: Template[] = [
  {
    id: "rose-vows",
    title: "Rose & Vows",
    description:
      "A romantic, blush-toned wedding website template with elegant serif typography, RSVP form, and a love-story timeline.",
    price: 0,
    category: "Wedding",
    tags: ["romantic", "floral", "rsvp", "timeline"],
    cover: wedding1,
    gallery: buildGallery(wedding1),
    author: "Aanya P.",
    trending: true,
    isNew: false,
  },
  {
    id: "sage-bloom",
    title: "Sage Bloom",
    description:
      "A botanical, sage-green wedding template with a refined editorial feel — perfect for outdoor weddings.",
    price: 499,
    category: "Wedding",
    tags: ["botanical", "minimal", "editorial"],
    cover: wedding2,
    gallery: buildGallery(wedding2),
    author: "Rohan M.",
    trending: true,
  },
  {
    id: "noir-folio",
    title: "Noir Folio",
    description:
      "A bold, dark-themed portfolio template with neon highlights — ideal for designers and creative directors.",
    price: 799,
    category: "Portfolio",
    tags: ["dark", "creative", "designer"],
    cover: portfolio1,
    gallery: buildGallery(portfolio1),
    author: "Kabir S.",
    trending: true,
  },
  {
    id: "silver-frame",
    title: "Silver Frame",
    description:
      "A minimalist photography portfolio with grid-based galleries, lightbox views, and clean typography.",
    price: 0,
    category: "Portfolio",
    tags: ["minimal", "photography", "grid"],
    cover: portfolio2,
    gallery: buildGallery(portfolio2),
    author: "Meera J.",
    isNew: true,
  },
  {
    id: "northwind-corp",
    title: "Northwind Corp",
    description:
      "A professional corporate template with hero sections, feature grids, testimonials, and contact forms.",
    price: 1299,
    category: "Business",
    tags: ["corporate", "saas", "professional"],
    cover: business1,
    gallery: buildGallery(business1),
    author: "Devansh K.",
    isNew: true,
  },
  {
    id: "crimson-invite",
    title: "Crimson Invite",
    description:
      "An ornate, traditional Indian wedding invitation page with floral motifs and an interactive RSVP.",
    price: 299,
    category: "Invitation",
    tags: ["traditional", "indian", "ornate"],
    cover: invitation1,
    gallery: buildGallery(invitation1),
    author: "Priya V.",
    trending: true,
    isNew: true,
  },
];

export const getTemplate = (id: string) => templates.find((t) => t.id === id);

export const getRelated = (id: string) => {
  const t = getTemplate(id);
  if (!t) return [];
  return templates.filter((x) => x.id !== id && x.category === t.category).slice(0, 4);
};
