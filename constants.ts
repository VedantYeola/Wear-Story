import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Minimalist Wool Coat",
    price: 189.99,
    category: "Outerwear",
    image: "https://picsum.photos/seed/coat1/600/800",
    description: "Wrap yourself in sophisticated warmth with this timeless wool coat. The structured silhouette commands attention, while the premium wool blend offers a luxuriously soft touch against the winter chill.",
    tags: ["winter", "formal", "coat", "wool"],
    rating: 4.8,
    reviews: 128
  },
  {
    id: 2,
    name: "Silk Evening Dress",
    price: 249.50,
    category: "Dresses",
    image: "https://picsum.photos/seed/dress2/600/800",
    description: "Exude ethereal grace in this flowing silk evening dress. The fabric cascades like liquid moonlight, offering a cool, breathable embrace perfect for galas and starlit soirées.",
    tags: ["evening", "summer", "luxury", "silk"],
    rating: 4.9,
    reviews: 84
  },
  {
    id: 3,
    name: "Urban Denim Jacket",
    price: 89.00,
    category: "Jackets",
    image: "https://picsum.photos/seed/jacket3/600/800",
    description: "Redefine urban edge with this modern denim jacket. Crafted from rugged, stonewashed denim that softens with age, it's the ultimate layering piece for crisp mornings and cool city nights.",
    tags: ["casual", "streetwear", "denim"],
    rating: 4.6,
    reviews: 215
  },
  {
    id: 4,
    name: "Cashmere Turtleneck",
    price: 120.00,
    category: "Knitwear",
    image: "https://picsum.photos/seed/sweater4/600/800",
    description: "Indulge in the cloud-like embrace of pure cashmere. This turtleneck offers unparalleled softness and warmth, a cozy yet elegant staple that feels like a gentle hug on a cold day.",
    tags: ["winter", "cozy", "casual"],
    rating: 4.9,
    reviews: 62
  },
  {
    id: 5,
    name: "Tailored Linen Trousers",
    price: 95.00,
    category: "Bottoms",
    image: "https://picsum.photos/seed/pant5/600/800",
    description: "Experience the breezy freedom of these tailored linen trousers. The lightweight fabric dances with every step, keeping you cool and polished from sun-drenched offices to seaside weekends.",
    tags: ["summer", "formal", "office", "breathable"],
    rating: 4.5,
    reviews: 94
  },
  {
    id: 6,
    name: "Leather Chelsea Boots",
    price: 155.00,
    category: "Footwear",
    image: "https://picsum.photos/seed/boot6/600/800",
    description: "Step with confidence in these handcrafted leather Chelsea boots. The supple, full-grain leather molds to your foot, while the sturdy sole provides a grounded, rhythmic stride for any terrain.",
    tags: ["shoes", "leather", "winter", "casual"],
    rating: 4.7,
    reviews: 156
  },
  {
    id: 7,
    name: "Oversized Cotton Shirt",
    price: 65.00,
    category: "Tops",
    image: "https://picsum.photos/seed/shirt7/600/800",
    description: "Capture the essence of effortless chic with this oversized cotton shirt. The crisp, cool fabric rustles softly as you move, offering a blank canvas for endless styling possibilities.",
    tags: ["casual", "summer", "basics"],
    rating: 4.4,
    reviews: 302
  },
  {
    id: 8,
    name: "Bohemian Maxi Skirt",
    price: 78.00,
    category: "Bottoms",
    image: "https://picsum.photos/seed/skirt8/600/800",
    description: "Embrace bohemian whimsy with this vibrant maxi skirt. The intricate patterns tell a story of wanderlust, while the airy fabric swirls around your ankles, perfect for festival dancing or barefoot beach walks.",
    tags: ["summer", "boho", "casual"],
    rating: 4.8,
    reviews: 110
  }
];

export const AI_SYSTEM_INSTRUCTION = `
You are 'Lumi', a knowledgeable and chic AI personal stylist for the 'Wear-Story' clothing store.
Your goal is to help customers find the perfect outfit from our catalog.
Be friendly, concise, and helpful. 
When suggesting items, ALWAYS refer to them by their exact names from the catalog provided.
If a user asks for something we don't have, politely suggest the closest alternative or explain we don't carry it.
Do not use markdown formatting for lists, just natural text or bullet points using hyphens.
Keep responses short (under 100 words) unless detailed advice is requested.
`;