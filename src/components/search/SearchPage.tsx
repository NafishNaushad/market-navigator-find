
import { useState, useEffect } from "react";
import SearchForm from "./SearchForm";
import EnhancedSearchResults from "./EnhancedSearchResults";
import SearchOptimization from "./SearchOptimization";
import UserStats from "./UserStats";
import { generateRealisticProducts, getCountryConfig, getAllBrands } from "@/utils/productGenerator";
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
  category?: string;
  brand?: string;
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

const SearchPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [countryConfig, setCountryConfig] = useState<any>(null);
  const [lastQuery, setLastQuery] = useState<string>("");
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadUserProfile();
    detectUserLocation();
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

  const detectUserLocation = () => {
    // Try to detect user's country from various sources
    let detectedCountry = 'US'; // Default to US
    
    // Try to get from browser timezone
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta')) {
        detectedCountry = 'IN';
      } else if (timezone.includes('Europe/London')) {
        detectedCountry = 'GB';
      }
    } catch (error) {
      console.log('Could not detect timezone');
    }

    const config = getCountryConfig(detectedCountry);
    setCountryConfig(config);
    setAvailableBrands(getAllBrands(detectedCountry));
  };

  const handleSearch = async (query: string, filters: SearchFilters) => {
    setLoading(true);
    setLastQuery(query);

    try {
      // Generate comprehensive product results
      const enhancedResults = generateRealisticProducts(
        query, 
        userProfile?.country || 'US', 
        filters
      );
      
      setProducts(enhancedResults);

      // Store search history
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('search_history')
          .insert({
            user_id: user.id,
            query,
            filters: filters as any, // Cast to any to satisfy Json type
            results_count: enhancedResults.length
          });
      }

      toast({
        title: "Search completed!",
        description: `Found ${enhancedResults.length} products across ${countryConfig?.platforms?.length || 5} platforms.`,
      });

    } catch (error) {
      console.error('Search error:', error);
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

  const platforms = countryConfig?.platforms || ['Amazon', 'Flipkart', 'Meesho', 'eBay'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <UserStats 
        searchCount={0}
        searchLimit={999} // Unlimited for testing
        currency={countryConfig?.symbol || "$"}
        country={userProfile?.country || "US"}
      />
      
      <SearchForm 
        onSearch={handleSearch} 
        loading={loading}
        availablePlatforms={platforms}
        availableBrands={availableBrands}
      />

      {products.length > 0 ? (
        <EnhancedSearchResults 
          products={products} 
          searchQuery={lastQuery}
          availablePlatforms={platforms}
          availableBrands={availableBrands}
        />
      ) : !loading && (
        <SearchOptimization onSuggestionClick={handleSuggestionClick} />
      )}
    </div>
  );
};

export default SearchPage;
