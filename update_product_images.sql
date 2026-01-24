-- -------------------------------------------------------------
-- WEARE-STORY AUTOMATIC IMAGE REFRESH SCRIPT
-- -------------------------------------------------------------
-- Run this script in your Supabase SQL Editor to instantly
-- replace all the random "scenery" images with curated,
-- high-fashion photography that matches your product names.
-- -------------------------------------------------------------

-- 1. Oversized Cotton Shirt (White/Beige aesthetic)
UPDATE products 
SET image = 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800' 
WHERE name ILIKE '%Cotton Shirt%';

-- 2. Pleated Midi Skirt (Elegant/Street style)
UPDATE products 
SET image = 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800' 
WHERE name ILIKE '%Midi Skirt%';

-- 3. Classic Leather Jacket (Edgy/Black)
UPDATE products 
SET image = 'https://images.unsplash.com/photo-1551028919-ac7eed8ca53d?q=80&w=800' 
WHERE name ILIKE '%Leather Jacket%';

-- 4. Cashmere Turtleneck (Cozy/Portrait)
UPDATE products 
SET image = 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800' 
WHERE name ILIKE '%Turtleneck%';

-- 5. High-Waist Trousers (Chic/Office)
UPDATE products 
SET image = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800' 
WHERE name ILIKE '%Trousers%';

-- 6. Ankle Boots (Detail shot)
UPDATE products 
SET image = 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800' 
WHERE name ILIKE '%Boots%';

-- 7. Silk Slip Dress (Elegant)
UPDATE products 
SET image = 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=800' 
WHERE name ILIKE '%Dress%';

-- 8. Wool Blend Coat (Winter/Street)
UPDATE products 
SET image = 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800' 
WHERE name ILIKE '%Coat%';
