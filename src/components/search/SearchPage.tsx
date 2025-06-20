import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchForm from "./SearchForm";
import EnhancedSearchResults from "./EnhancedSearchResults";
import SearchOptimization from "./SearchOptimization";
import UserStats from "./UserStats";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  shipping?: string;
  availability?: string;
  originalPrice?: string;
  discount?: number;
  seller?: string;
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  platforms?: string[];
  sortBy?: 'price' | 'rating' | 'popularity';
  freeShipping?: boolean;
}

const SearchPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [countryConfig, setCountryConfig] = useState<any>(null);
  const [lastQuery, setLastQuery] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    loadUserProfile();
    loadCountryConfig();
  }, []);

  const loadUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setUserProfile(data);
    }
  };

  const loadCountryConfig = async () => {
    const detectedCountry = 'US';
    
    const { data } = await supabase
      .from('country_config')
      .select('*')
      .eq('country_code', detectedCountry)
      .single();
    
    setCountryConfig(data);
  };

  const generateRealisticProducts = (query: string, filters: SearchFilters): Product[] => {
    const platforms = ['Amazon', 'Flipkart', 'Meesho', 'AliExpress', 'eBay'];
    const currency = countryConfig?.currency_symbol || "$";
    
    // More realistic product variations based on the search query
    const getProductVariations = (searchTerm: string) => {
      const baseProducts = [
        {
          title: `${searchTerm} - Premium Wireless Bluetooth with Noise Cancellation`,
          basePrice: 299.99,
          image: "/placeholder.svg",
          rating: 4.7,
          reviews: 12450,
          shipping: "Free same-day delivery",
          availability: "In stock",
          discount: 25,
          seller: "TechHub Electronics",
          description: `High-quality ${searchTerm} with advanced features and premium build quality. Perfect for music lovers and professionals.`,
          features: ["Wireless Bluetooth 5.0", "30-hour battery life", "Active noise cancellation", "Premium leather finish"],
          specifications: {
            "Battery Life": "30 hours",
            "Connectivity": "Bluetooth 5.0, 3.5mm jack",
            "Weight": "250g",
            "Warranty": "2 years"
          }
        },
        {
          title: `${searchTerm} - Professional Grade Studio Quality`,
          basePrice: 459.99,
          image: "/placeholder.svg",
          rating: 4.9,
          reviews: 8930,
          shipping: "Free 2-day shipping",
          availability: "In stock",
          discount: 15,
          seller: "AudioPro Official Store",
          description: `Professional ${searchTerm} designed for studio use and audiophiles. Crystal clear sound quality.`,
          features: ["Studio-grade drivers", "Detachable cable", "Foldable design", "Carrying case included"],
          specifications: {
            "Frequency Response": "20Hz - 40kHz",
            "Impedance": "32 Ohms",
            "Driver Size": "50mm",
            "Warranty": "3 years"
          }
        },
        {
          title: `${searchTerm} - Budget Friendly High Performance`,
          basePrice: 79.99,
          image: "/placeholder.svg",
          rating: 4.3,
          reviews: 15670,
          shipping: "Free shipping",
          availability: "In stock",
          discount: 30,
          seller: "ValueTech",
          description: `Affordable ${searchTerm} without compromising on quality. Great value for money.`,
          features: ["Clear audio", "Comfortable padding", "Adjustable headband", "1-year warranty"],
          specifications: {
            "Driver Size": "40mm",
            "Connectivity": "3.5mm jack",
            "Weight": "180g",
            "Warranty": "1 year"
          }
        },
        {
          title: `${searchTerm} - Gaming Edition RGB LED`,
          basePrice: 189.99,
          image: "/placeholder.svg",
          rating: 4.6,
          reviews: 9840,
          shipping: "Free next-day delivery",
          availability: "In stock",
          discount: 20,
          seller: "GameZone Pro",
          description: `Gaming ${searchTerm} with RGB lighting and surround sound. Perfect for gamers.`,
          features: ["7.1 surround sound", "RGB LED lighting", "Noise-canceling mic", "Gaming software"],
          specifications: {
            "Surround Sound": "7.1 virtual",
            "Microphone": "Detachable boom mic",
            "Lighting": "RGB LED",
            "Platform": "PC, PS5, Xbox"
          }
        },
        {
          title: `${searchTerm} - Travel Compact Foldable`,
          basePrice: 129.99,
          image: "/placeholder.svg",
          rating: 4.4,
          reviews: 6780,
          shipping: "Free shipping",
          availability: "Limited stock",
          discount: 35,
          seller: "TravelGear Co",
          description: `Compact ${searchTerm} perfect for travel. Lightweight and foldable design.`,
          features: ["Ultra-lightweight", "Foldable design", "Travel case", "Long battery life"],
          specifications: {
            "Weight": "150g",
            "Battery": "25 hours",
            "Folded Size": "15cm x 12cm",
            "Warranty": "18 months"
          }
        }
      ];
      return baseProducts;
    };

    const productVariations = getProductVariations(query);
    let products = [];
    
    // Generate products for each platform with realistic variations
    for (let i = 0; i < productVariations.length; i++) {
      for (let j = 0; j < platforms.length; j++) {
        const variation = productVariations[i];
        const platform = platforms[j];
        
        // Platform-specific price variations
        const platformMultiplier = {
          'Amazon': 1.0,
          'Flipkart': 0.95,
          'Meesho': 0.85,
          'AliExpress': 0.75,
          'eBay': 0.90
        }[platform] || 1.0;
        
        const finalPrice = (variation.basePrice * platformMultiplier).toFixed(2);
        const originalPrice = (parseFloat(finalPrice) / (1 - variation.discount / 100)).toFixed(2);
        const ratingVariation = variation.rating + (Math.random() * 0.3 - 0.15);

        products.push({
          id: `${i}-${j}-${Date.now()}`,
          title: variation.title,
          price: finalPrice,
          originalPrice: originalPrice,
          image: variation.image,
          platform,
          link: `https://${platform.toLowerCase()}.com/product/${query.toLowerCase().replace(' ', '-')}-${i}`,
          currency,
          rating: Math.max(3.5, Math.min(5.0, Number(ratingVariation.toFixed(1)))),
          reviews: variation.reviews + Math.floor(Math.random() * 1000),
          shipping: variation.shipping,
          availability: variation.availability,
          discount: variation.discount,
          seller: variation.seller,
          description: variation.description,
          features: variation.features,
          specifications: variation.specifications
        });
      }
    }

    // Apply filters
    if (filters.minPrice || filters.maxPrice) {
      products = products.filter(product => {
        const price = parseFloat(product.price);
        if (filters.minPrice && price < filters.minPrice) return false;
        if (filters.maxPrice && price > filters.maxPrice) return false;
        return true;
      });
    }

    if (filters.platforms && filters.platforms.length > 0) {
      products = products.filter(product => 
        filters.platforms!.includes(product.platform)
      );
    }

    if (filters.freeShipping) {
      products = products.filter(product => 
        product.shipping?.toLowerCase().includes('free')
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      products.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price':
            return parseFloat(a.price) - parseFloat(b.price);
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'popularity':
            return (b.reviews || 0) - (a.reviews || 0);
          default:
            return 0;
        }
      });
    }

    return products.slice(0, 25);
  };

  const handleSearch = async (query: string, filters: SearchFilters) => {
    setLoading(true);
    setLastQuery(query);

    try {
      const enhancedResults = generateRealisticProducts(query, filters);
      setProducts(enhancedResults);

      // Store search history (but no daily limits for now)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const filtersJson = filters ? JSON.parse(JSON.stringify(filters)) : null;

        await supabase
          .from('search_history')
          .insert({
            user_id: user.id,
            query,
            filters: filtersJson,
            results_count: enhancedResults.length
          });
      }

      toast({
        title: "Search completed!",
        description: `Found ${enhancedResults.length} products across ${platforms.length} platforms.`,
      });

    } catch (error) {
      toast({
        title: "Search failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (query: string) => {
    handleSearch(query, {});
  };

  const platforms = countryConfig?.platforms || ['Amazon', 'Flipkart', 'Meesho', 'AliExpress', 'eBay'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <UserStats 
        searchCount={0}
        searchLimit={999}
        currency={countryConfig?.currency_symbol || "$"}
        country={userProfile?.country || "US"}
      />
      
      <SearchForm 
        onSearch={handleSearch} 
        loading={loading}
        availablePlatforms={platforms}
      />

      {products.length > 0 ? (
        <EnhancedSearchResults products={products} searchQuery={lastQuery} />
      ) : !loading && (
        <SearchOptimization onSuggestionClick={handleSuggestionClick} />
      )}
    </div>
  );
};

export default SearchPage;
