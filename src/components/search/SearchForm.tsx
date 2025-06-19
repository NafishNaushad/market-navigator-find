import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X, Zap } from "lucide-react";
import { SearchFilters } from "./SearchPage";

interface SearchFormProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  loading: boolean;
  availablePlatforms: string[];
}

const SearchForm = ({ onSearch, loading, availablePlatforms }: SearchFormProps) => {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'popularity' | 'relevance'>('relevance');
  const [freeShipping, setFreeShipping] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const filters: SearchFilters = {};
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (selectedPlatforms.length > 0) filters.platforms = selectedPlatforms;
    if (sortBy !== 'relevance') filters.sortBy = sortBy;
    if (freeShipping) filters.freeShipping = true;

    onSearch(query, filters);
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedPlatforms([]);
    setSortBy('relevance');
    setFreeShipping(false);
  };

  const hasActiveFilters = minPrice || maxPrice || selectedPlatforms.length > 0 || sortBy !== 'relevance' || freeShipping;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Search for products (e.g., wireless headphones, laptop, shoes)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-lg pr-10"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => setQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 ${hasActiveFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
          >
            <Filter className="h-4 w-4" />
            {hasActiveFilters && <span className="ml-1 text-xs">•</span>}
          </Button>
          <Button type="submit" disabled={loading || !query.trim()} className="px-6">
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Search className="h-4 w-4" />
            )}
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>

      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Advanced Filters
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-sm"
                  disabled={!hasActiveFilters}
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Price Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Sort By</Label>
                  <Select value={sortBy} onValueChange={(value: 'price' | 'rating' | 'popularity' | 'relevance') => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price">Price: Low to High</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="popularity">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Free Shipping */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Shipping</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="free-shipping"
                      checked={freeShipping}
                      onCheckedChange={setFreeShipping}
                    />
                    <Label htmlFor="free-shipping" className="text-sm">
                      Free shipping only
                    </Label>
                  </div>
                </div>
              </div>

              {/* Platforms */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Platforms</Label>
                <div className="flex flex-wrap gap-2">
                  {availablePlatforms.map((platform) => (
                    <Badge
                      key={platform}
                      variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-opacity-80 transition-colors"
                      onClick={() => togglePlatform(platform)}
                    >
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchForm;
