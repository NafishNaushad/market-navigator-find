export interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  platform: string;
  link: string;
  currency: string;
  rating?: number;
  reviews?: number;
  originalPrice?: string;
  discount?: number;
  seller?: string;
  isSponsored?: boolean;
  freeShipping?: boolean;
  features?: string[];
  specifications?: Record<string, string>;
  brand?: string;
  shipping?: string;
  availability?: string;
  description?: string;
  deliveryTime?: number;
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  platforms?: string[];
  brands?: string[];
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'popularity' | 'delivery' | 'relevance';
  freeShipping?: boolean;
  minRating?: number;
}