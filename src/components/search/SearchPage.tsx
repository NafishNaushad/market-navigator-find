
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";
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
    // First detect user's country (using a mock for now)
    const detectedCountry = 'US'; // Will implement IP detection later
    
    const { data } = await supabase
      .from('country_config')
      .select('*')
      .eq('country_code', detectedCountry)
      .single();
    
    setCountryConfig(data);
  };

  const generateMockProducts = (query: string, filters: SearchFilters): Product[] => {
    const platforms = ['Amazon', 'Flipkart', 'Meesho', 'AliExpress', 'eBay'];
    const currency = countryConfig?.currency_symbol || "$";
    
    const baseProducts = [
      {
        title: `${query} - Premium Quality`,
        basePrice: 29.99,
        image: "/placeholder.svg",
        rating: 4.5,
        reviews: 1250,
        shipping: "Free shipping",
        availability: "In stock"
      },
      {
        title: `${query} - Best Value Pack`,
        basePrice: 24.99,
        image: "/placeholder.svg",
        rating: 4.2,
        reviews: 890,
        shipping: "Free shipping",
        availability: "In stock"
      },
      {
        title: `${query} - Professional Grade`,
        basePrice: 49.99,
        image: "/placeholder.svg",
        rating: 4.8,
        reviews: 2100,
        shipping: "$5.99 shipping",
        availability: "In stock"
      },
      {
        title: `${query} - Budget Friendly`,
        basePrice: 15.99,
        image: "/placeholder.svg",
        rating: 3.9,
        reviews: 520,
        shipping: "Free shipping",
        availability: "In stock"
      },
      {
        title: `${query} - Luxury Edition`,
        basePrice: 89.99,
        image: "/placeholder.svg",
        rating: 4.7,
        reviews: 340,
        shipping: "Free shipping",
        availability: "Limited stock"
      }
    ];

    let products = baseProducts.map((product, index) => {
      const platform = platforms[index % platforms.length];
      const priceVariation = Math.random() * 0.4 + 0.8; // 80% to 120% of base price
      const finalPrice = (product.basePrice * priceVariation).toFixed(2);

      return {
        id: `${index}-${Date.now()}`,
        title: product.title,
        price: finalPrice,
        image: product.image,
        platform,
        link: `https://${platform.toLowerCase()}.com`,
        currency,
        rating: product.rating,
        reviews: product.reviews,
        shipping: product.shipping,
        availability: product.availability
      };
    });

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

    return products;
  };

  const handleSearch = async (query: string, filters: SearchFilters) => {
    if (!userProfile) return;

    // Check search limit
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
      // Generate enhanced mock results
      const mockResults = generateMockProducts(query, filters);

      setProducts(mockResults);

      // Update search count and save to history
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ search_count_today: userProfile.search_count_today + 1 })
          .eq('id', user.id);

        // Convert filters to JSON-compatible format
        const filtersJson = filters ? JSON.parse(JSON.stringify(filters)) : null;

        await supabase
          .from('search_history')
          .insert({
            user_id: user.id,
            query,
            filters: filtersJson,
            results_count: mockResults.length
          });

        // Refresh user profile
        loadUserProfile();
      }

      toast({
        title: "Search completed!",
        description: `Found ${mockResults.length} products across platforms.`,
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
    <div className="space-y-6">
      <UserStats 
        searchCount={userProfile?.search_count_today || 0}
        searchLimit={countryConfig?.daily_search_limit || 10}
        currency={countryConfig?.currency_symbol || "$"}
        country={userProfile?.country || "US"}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Search Products</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchForm 
            onSearch={handleSearch} 
            loading={loading}
            availablePlatforms={countryConfig?.platforms || ['Amazon', 'Flipkart', 'Meesho', 'AliExpress']}
          />
        </CardContent>
      </Card>

      {products.length > 0 ? (
        <SearchResults products={products} />
      ) : !loading && (
        <SearchOptimization onSuggestionClick={handleSuggestionClick} />
      )}
    </div>
  );
};

export default SearchPage;
