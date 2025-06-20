
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Filter, X, Star } from "lucide-react";

interface AdvancedFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  availablePlatforms: string[];
  availableBrands: string[];
  isOpen: boolean;
  onToggle: () => void;
}

const AdvancedFilters = ({ 
  filters, 
  onFiltersChange, 
  availablePlatforms, 
  availableBrands,
  isOpen,
  onToggle 
}: AdvancedFiltersProps) => {
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 1000]);
  const [selectedRating, setSelectedRating] = useState(filters.minRating || 0);

  const updateFilters = (newFilters: any) => {
    onFiltersChange({ ...filters, ...newFilters });
  };

  const togglePlatform = (platform: string) => {
    const platforms = filters.platforms || [];
    const newPlatforms = platforms.includes(platform)
      ? platforms.filter((p: string) => p !== platform)
      : [...platforms, platform];
    updateFilters({ platforms: newPlatforms });
  };

  const toggleBrand = (brand: string) => {
    const brands = filters.brands || [];
    const newBrands = brands.includes(brand)
      ? brands.filter((b: string) => b !== brand)
      : [...brands, brand];
    updateFilters({ brands: newBrands });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setPriceRange([0, 1000]);
    setSelectedRating(0);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onToggle}
          className={`flex items-center gap-2 ${hasActiveFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
          {hasActiveFilters && <span className="text-xs">•</span>}
        </Button>
        
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Price Range</Label>
              <div className="px-3">
                <Slider
                  value={priceRange}
                  onValueChange={(value) => {
                    setPriceRange(value);
                    updateFilters({ minPrice: value[0], maxPrice: value[1] });
                  }}
                  max={2000}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Minimum Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={selectedRating >= rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const newRating = selectedRating === rating ? 0 : rating;
                      setSelectedRating(newRating);
                      updateFilters({ minRating: newRating });
                    }}
                    className="flex items-center gap-1"
                  >
                    <Star className="h-3 w-3" />
                    {rating}+
                  </Button>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {availablePlatforms.map((platform) => (
                  <Badge
                    key={platform}
                    variant={(filters.platforms || []).includes(platform) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-opacity-80 transition-colors"
                    onClick={() => togglePlatform(platform)}
                  >
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Brands</Label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableBrands.slice(0, 20).map((brand) => (
                  <Badge
                    key={brand}
                    variant={(filters.brands || []).includes(brand) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-opacity-80 transition-colors"
                    onClick={() => toggleBrand(brand)}
                  >
                    {brand}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Sort By</Label>
              <Select value={filters.sortBy || 'relevance'} onValueChange={(value) => updateFilters({ sortBy: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="delivery">Fastest Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="free-shipping" className="text-sm font-medium">
                  Free Shipping Only
                </Label>
                <Switch
                  id="free-shipping"
                  checked={filters.freeShipping || false}
                  onCheckedChange={(checked) => updateFilters({ freeShipping: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedFilters;
