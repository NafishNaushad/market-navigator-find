
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";
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
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  platforms?: string[];
}

const SearchPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [countryConfig, setCountryConfig] = useState<any>(null);
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

    try {
      // Mock search results for now - will implement actual scraping via edge function
      const mockResults: Product[] = [
        {
          id: "1",
          title: `${query} - Premium Quality`,
          price: "29.99",
          image: "/placeholder.svg",
          platform: "Amazon",
          link: "https://amazon.com",
          currency: countryConfig?.currency_symbol || "$"
        },
        {
          id: "2",
          title: `${query} - Best Value`,
          price: "24.99",
          image: "/placeholder.svg",
          platform: "Flipkart",
          link: "https://flipkart.com",
          currency: countryConfig?.currency_symbol || "$"
        },
        {
          id: "3",
          title: `${query} - Top Rated`,
          price: "34.99",
          image: "/placeholder.svg",
          platform: "Meesho",
          link: "https://meesho.com",
          currency: countryConfig?.currency_symbol || "$"
        }
      ];

      setProducts(mockResults);

      // Update search count and save to history
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ search_count_today: userProfile.search_count_today + 1 })
          .eq('id', user.id);

        await supabase
          .from('search_history')
          .insert({
            user_id: user.id,
            query,
            filters,
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
            availablePlatforms={countryConfig?.platforms || []}
          />
        </CardContent>
      </Card>

      {products.length > 0 && (
        <SearchResults products={products} />
      )}
    </div>
  );
};

export default SearchPage;
