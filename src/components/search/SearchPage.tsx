
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

  const generateEnhancedMockProducts = (query: string, filters: SearchFilters): Product[] => {
    const platforms = ['Amazon', 'Flipkart', 'Meesho', 'AliExpress', 'eBay'];
    const currency = countryConfig?.currency_symbol || "$";
    
    const productVariations = [
      {
        title: `${query} - Premium Quality with Advanced Features`,
        basePrice: 89.99,
        image: "/placeholder.svg",
        rating: 4.7,
        reviews: 2340,
        shipping: "Free same-day delivery",
        availability: "In stock"
      },
      {
        title: `${query} - Best Value Professional Grade`,
        basePrice: 129.99,
        image: "/placeholder.svg",
        rating: 4.8,
        reviews: 1890,
        shipping: "Free next-day delivery",
        availability: "In stock"
      },
      {
        title: `${query} - Budget Friendly High Quality`,
        basePrice: 45.99,
        image: "/placeholder.svg",
        rating: 4.3,
        reviews: 890,
        shipping: "Free shipping",
        availability: "In stock"
      },
      {
        title: `${query} - Luxury Edition with Warranty`,
        basePrice: 199.99,
        image: "/placeholder.svg",
        rating: 4.9,
        reviews: 567,
        shipping: "Free premium delivery",
        availability: "Limited stock"
      },
      {
        title: `${query} - Latest Model 2024`,
        basePrice: 159.99,
        image: "/placeholder.svg",
        rating: 4.6,
        reviews: 1234,
        shipping: "Free 2-day shipping",
        availability: "In stock"
      },
      {
        title: `${query} - Eco-Friendly Sustainable`,
        basePrice: 75.99,
        image: "/placeholder.svg",
        rating: 4.4,
        reviews: 678,
        shipping: "Free shipping",
        availability: "In stock"
      }
    ];

    let products = [];
    
    // Generate multiple products per platform for better comparison
    for (let i = 0; i < productVariations.length; i++) {
      for (let j = 0; j < platforms.length; j++) {
        const variation = productVariations[i];
        const platform = platforms[j];
        const priceVariation = Math.random() * 0.6 + 0.7; // 70% to 130% of base price
        const finalPrice = (variation.basePrice * priceVariation).toFixed(2);
        const ratingVariation = variation.rating + (Math.random() * 0.4 - 0.2); // ±0.2 rating variation

        products.push({
          id: `${i}-${j}-${Date.now()}`,
          title: variation.title,
          price: finalPrice,
          image: variation.image,
          platform,
          link: `https://${platform.toLowerCase()}.com`,
          currency,
          rating: Math.max(3.0, Math.min(5.0, Number(ratingVariation.toFixed(1)))),
          reviews: variation.reviews + Math.floor(Math.random() * 500),
          shipping: variation.shipping,
          availability: variation.availability
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

    // Limit to 20 products for better performance
    return products.slice(0, 20);
  };

  const handleSearch = async (query: string, filters: SearchFilters) => {
    if (!userProfile) return;

    if (userProfile.search_count_today >= (countryConfig?.daily_search_limit || 10)) {
      toast({
        title: "Daily limit reached",
        description: "You've reached your daily search limit. Try again tomorrow!",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setLastQuery(query);

    try {
      const enhancedResults = generateEnhancedMockProducts(query, filters);
      setProducts(enhancedResults);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ search_count_today: userProfile.search_count_today + 1 })
          .eq('id', user.id);

        const filtersJson = filters ? JSON.parse(JSON.stringify(filters)) : null;

        await supabase
          .from('search_history')
          .insert({
            user_id: user.id,
            query,
            filters: filtersJson,
            results_count: enhancedResults.length
          });

        loadUserProfile();
      }

      toast({
        title: "Search completed!",
        description: `Found ${enhancedResults.length} products across ${countryConfig?.platforms?.length || 5} platforms.`,
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <UserStats 
        searchCount={userProfile?.search_count_today || 0}
        searchLimit={countryConfig?.daily_search_limit || 10}
        currency={countryConfig?.currency_symbol || "$"}
        country={userProfile?.country || "US"}
      />
      
      <SearchForm 
        onSearch={handleSearch} 
        loading={loading}
        availablePlatforms={countryConfig?.platforms || ['Amazon', 'Flipkart', 'Meesho', 'AliExpress', 'eBay']}
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
