export const getProductImage = (name: string, category: string, originalImage: string) => {
    // If the database has a valid, non-generated-seed image, use it.
    // (Assuming 'picsum' or 'pollinations' are the ones we want to override)
    if (originalImage && !originalImage.includes('picsum') && !originalImage.includes('pollinations')) {
        return originalImage;
    }

    // Fallback: Curated High-Fashion Unsplash Images based on keywords
    const n = name.toLowerCase();
    const c = category.toLowerCase();

    if (n.includes('shirt') || n.includes('blouse')) return 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800';
    if (n.includes('skirt')) return 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800';
    if (n.includes('leather') || n.includes('jacket')) return 'https://images.unsplash.com/photo-1551028919-ac7eed8ca53d?q=80&w=800';
    if (n.includes('turtleneck') || n.includes('sweater')) return 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800';
    if (n.includes('trouser') || n.includes('pant')) return 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800';
    if (n.includes('boot') || n.includes('shoe')) return 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800';
    if (n.includes('dress')) return 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=800';
    if (n.includes('coat') || n.includes('outerwear')) return 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800';
    if (c.includes('bag') || n.includes('bag')) return 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800';

    // Generic Category Fallbacks
    if (c === 'tops') return 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800';
    if (c === 'bottoms') return 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=800';
    if (c === 'outerwear') return 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800';

    return originalImage;
};
