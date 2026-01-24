
import fs from 'fs';

const CATEGORIES = [
  'Outerwear',
  'Dresses',
  'Jackets',
  'Knitwear',
  'Bottoms',
  'Footwear',
  'Tops'
];

const ADJECTIVES = ['Vintage', 'Modern', 'Classic', 'Elegant', 'Urban', 'Chic', 'Boho', 'Minimalist', 'Luxury', 'Casual', 'Sleek', 'Retro', 'Cozy', 'Tailored', 'Oversized'];
const MATERIALS = ['Cotton', 'Wool', 'Silk', 'Leather', 'Denim', 'Linen', 'Velvet', 'Cashmere', 'Satin', 'Corduroy'];
const COLORS = ['Black', 'White', 'Navy', 'Beige', 'Red', 'Emerald', 'Blue', 'Grey', 'Camel', 'Burgundy'];

const NOUNS = {
  'Outerwear': ['Coat', 'Parka', 'Trench', 'Overcoat', 'Cape'],
  'Dresses': ['Gown', 'Dress', 'Sundress', 'Maxi', 'Mini'],
  'Jackets': ['Blazer', 'Jacket', 'Bomber', 'Windbreaker', 'Vest'],
  'Knitwear': ['Sweater', 'Cardigan', 'Pullover', 'Turtleneck', 'Jumper'],
  'Bottoms': ['Trousers', 'Skirt', 'Jeans', 'Shorts', 'Pants'],
  'Footwear': ['Boots', 'Shoes', 'Sneakers', 'Loafers', 'Heels'],
  'Tops': ['Shirt', 'Blouse', 'Tee', 'Crop Top', 'Tunic']
};

const IMAGES = {
  'Outerwear': ['coat', 'winter,fashion'],
  'Dresses': ['dress', 'fashion,woman'],
  'Jackets': ['jacket', 'menswear'],
  'Knitwear': ['sweater', 'winter,cloth'],
  'Bottoms': ['jeans', 'pants'],
  'Footwear': ['shoes', 'boots'],
  'Tops': ['shirt', 'top']
};

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProduct(category, index) {
  const adj = getRandom(ADJECTIVES);
  const material = getRandom(MATERIALS);
  const noun = getRandom(NOUNS[category] || ['Item']);
  const color = getRandom(COLORS);
  
  const name = `${adj} ${color} ${noun}`;
  const price = (Math.random() * 200 + 20).toFixed(2);
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5 to 5.0
  const reviews = Math.floor(Math.random() * 500);
  
  // Use a predictable random seed for picsum or similar to ensure different images
  // LOREM FLICKR is good for keywords: https://loremflickr.com/600/800/dress
  // But to be safe and fast, let's use the one that was working or Unsplash Source if it was reliable.
  // Actually, to ensure "images of that product", keyword-based is best.
  // Let's use https://loremflickr.com/600/800/{keywords}?lock={index}
  const keywords = IMAGES[category][0];
  const image = `https://loremflickr.com/600/800/${keywords}?lock=${index}`;
  
  const description = `This ${name.toLowerCase()} features high-quality ${material.toLowerCase()} construction. Perfect for any occasion, it combines ${adj.toLowerCase()} style with everyday comfort.`;
  
  const tags = [`${category.toLowerCase()}`, material.toLowerCase(), adj.toLowerCase()];
  
  return `('${name.replace(/'/g, "''")}', ${price}, '${category}', '${image}', '${description.replace(/'/g, "''")}', ARRAY['${tags.join("','")}'], ${rating}, ${reviews})`;
}

let sql = `-- Bulk Insert Products\n`;
sql += `INSERT INTO public.products (name, price, category, image, description, tags, rating, reviews) VALUES\n`;

const ALL_VALUES = [];

CATEGORIES.forEach((cat, catIndex) => {
  for (let i = 0; i < 100; i++) {
    // Unique ID for lock to ensure image stability per item
    const uniqueIndex = catIndex * 1000 + i; 
    ALL_VALUES.push(generateProduct(cat, uniqueIndex));
  }
});

sql += ALL_VALUES.join(',\n') + ';';

fs.writeFileSync('bulk_products.sql', sql);
console.log('Generated bulk_products.sql with ' + ALL_VALUES.length + ' items.');
