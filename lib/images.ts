// lib/images.ts

// Fallback images from Unsplash (free to use)
export const fallbackImages = {
  products: [
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=700&fit=crop',
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=700&fit=crop',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=700&fit=crop',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&h=700&fit=crop',
    'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500&h=700&fit=crop',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=700&fit=crop',
    'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500&h=700&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=700&fit=crop',
  ],
  categories: {
    'new-arrivals': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=600&fit=crop',
    'dresses': 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=500&h=600&fit=crop',
    'tops': 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500&h=600&fit=crop',
    'bottoms': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=600&fit=crop',
    'best-sellers': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=600&fit=crop',
    'sale': 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=500&h=600&fit=crop',
  },
  banners: [
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&h=600&fit=crop',
  ],
};

// Get a product image by index (cycles through available images)
export function getProductImage(index: number): string {
  return fallbackImages.products[index % fallbackImages.products.length];
}

// Get category image by slug
export function getCategoryImage(slug: string): string {
  const categories = fallbackImages.categories as Record<string, string>;
  return categories[slug] || fallbackImages.categories['new-arrivals'];
}

// Get banner image by index
export function getBannerImage(index: number): string {
  return fallbackImages.banners[index % fallbackImages.banners.length];
}

// Check if URL is valid (starts with http)
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

// Get image URL with fallback
export function getImageUrl(url: string | null | undefined, fallbackIndex: number = 0): string {
  if (isValidImageUrl(url)) return url!;
  return getProductImage(fallbackIndex);
}