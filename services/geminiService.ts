import { GoogleGenerativeAI } from "@google/generative-ai";
import { Product } from "../types";
import { AI_SYSTEM_INSTRUCTION } from "../constants";

let genAI: GoogleGenerativeAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log("[Lumi AI] Initializing... Key Present?", !!apiKey); // Debug Log
    if (!apiKey) {
      console.error("VITE_GEMINI_API_KEY is missing from environment.");
      return null;
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

export const generateStylistResponse = async (
  userMessage: string,
  products: Product[],
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  const ai = getGenAI();
  if (!ai) return "I'm offline. Please check your API Key configuration.";

  try {
    const productCatalogContext = products
      .map((p) => `- ${p.name} ($${p.price}): ${p.description}`)
      .join("\n");

    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `${AI_SYSTEM_INSTRUCTION}\n\nCurrent Product Catalog:\n${productCatalogContext}`
    });

    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    // Fallback to Mock Response if API fails
    return getMockStylistResponse(userMessage, products);
  }
};

// Simple rule-based fallback when offline or API key fails
const getMockStylistResponse = (query: string, products: Product[]): string => {
  const lowerQuery = query.toLowerCase();

  // 1. Basic Greetings
  if (lowerQuery.match(/\b(hi|hello|hey|greetings)\b/)) {
    return "Hello! I'm ready to help you find your perfect look. Are you looking for shirts, dresses, jeans, shoes, or something else?";
  }

  // 2. Keyword Mapping (User input -> Database Category/Tag context)
  const keywordMap: { [key: string]: string } = {
    'shirt': 'Tops', 't-shirt': 'Tops', 'top': 'Tops', 'blouse': 'Tops', 'tee': 'Tops',
    'dress': 'Dresses', 'gown': 'Dresses', 'sundress': 'Dresses', 'frock': 'Dresses',
    'jeans': 'Bottoms', 'jense': 'Bottoms', 'denim': 'Bottoms', 'pants': 'Bottoms', 'trousers': 'Bottoms', 'skirt': 'Bottoms', 'shorts': 'Bottoms',
    'shoe': 'Footwear', 'shoes': 'Footwear', 'sneaker': 'Footwear', 'boot': 'Footwear', 'heel': 'Footwear', 'footwear': 'Footwear', 'sandals': 'Footwear',
    'jacket': 'Jackets', 'blazer': 'Jackets', 'windbreaker': 'Jackets', 'parka': 'Jackets',
    'sweater': 'Knitwear', 'cardigan': 'Knitwear', 'knit': 'Knitwear', 'pullover': 'Knitwear',
    'coat': 'Outerwear', 'trench': 'Outerwear'
  };

  // Identify target category from query
  let targetCategory = '';
  for (const [key, category] of Object.entries(keywordMap)) {
    if (lowerQuery.includes(key)) {
      targetCategory = category;
      break;
    }
  }

  // 3. Find matching items
  let matchingProducts = products.filter(p => {
    // Check if product matches the mapped category
    if (targetCategory && p.category === targetCategory) return true;

    // Fallback: Check name, category text, or tags directly
    return lowerQuery.includes(p.category.toLowerCase()) ||
      p.name.toLowerCase().includes(lowerQuery) ||
      p.tags.some(t => lowerQuery.includes(t));
  });

  // Shuffle and slice to give variety
  matchingProducts = matchingProducts.sort(() => 0.5 - Math.random()).slice(0, 3);

  if (matchingProducts.length > 0) {
    const suggestions = matchingProducts.map(p => p.name).join(', ');
    return `For "${query}", I picked out some stylish options: ${suggestions}. Would you like to see more details on any of these?`;
  }

  // 4. Color fallback
  if (lowerQuery.match(/red|blue|black|white|green|yellow|pink|purple/)) {
    return "That's a fantastic color! We have several items in that palette. Try filtering the main catalog by Category to narrow it down.";
  }

  // 5. Generic fallback
  return "I'm loving your style direction! While I check our inventory for that specific request, I recommend browsing our 'Tops' and 'Dresses' sections for our latest arrivals.";
};

export const generateProductStyling = async (
  currentProduct: Product,
  allProducts: Product[]
): Promise<string> => {
  const ai = getGenAI();
  if (!ai) return "";

  try {
    const otherProducts = allProducts
      .filter((p) => p.id !== currentProduct.id)
      .map((p) => `- ${p.name} (${p.category})`)
      .join("\n");

    const prompt = `
      I am viewing the "${currentProduct.name}" (${currentProduct.category}).
      Description: ${currentProduct.description}

      Here is the rest of the catalog:
      ${otherProducts}

      Suggest 1 or 2 specific items from the catalog that pair well with this to create a cohesive look.
      Briefly explain the style vibe in 2 sentences. Be chic and encouraging.
    `;

    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: AI_SYSTEM_INSTRUCTION
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Styling generation error:", error);
    return "This piece is versatile! Try pairing it with our classic denim or a structured blazer for a complete look.";
  }
};

export const matchCategoryWithAI = async (
  query: string,
  categories: string[]
): Promise<string | null> => {
  const ai = getGenAI();
  if (!ai) return null;

  try {
    const prompt = `
      You are an AI classifier for a clothing store.
      User Query: "${query}"
      Available Categories: ${JSON.stringify(categories)}

      Task: Return ONLY the exact name of the single most relevant category from the list above.
      If the query is unrelated to any category or too vague, return "null" (as a string).
      Do not add markdown, quotes, or explanations. Just the category name.
    `;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    if (categories.includes(text)) {
      return text;
    }
    return null;
  } catch (error) {
    console.error("AI Category Match Error:", error);
    return null;
  }
};