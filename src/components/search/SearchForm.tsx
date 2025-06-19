
import { useState } from "react";
import { SearchFilters } from "./SearchPage";
import SearchInput from "./SearchInput";
import SearchFilters as SearchFiltersComponent from "./SearchFilters";

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
      <div className="flex gap-2">
        <SearchInput
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
          loading={loading}
        />
        <SearchFiltersComponent
          showFilters={false}
          minPrice={minPrice}
          maxPrice={maxPrice}
          selectedPlatforms={selectedPlatforms}
          sortBy={sortBy}
          freeShipping={freeShipping}
          availablePlatforms={availablePlatforms}
          hasActiveFilters={hasActiveFilters}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onTogglePlatform={togglePlatform}
          onSortByChange={setSortBy}
          onFreeShippingChange={setFreeShipping}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onClearFilters={clearFilters}
        />
      </div>

      <SearchFiltersComponent
        showFilters={showFilters}
        minPrice={minPrice}
        maxPrice={maxPrice}
        selectedPlatforms={selectedPlatforms}
        sortBy={sortBy}
        freeShipping={freeShipping}
        availablePlatforms={availablePlatforms}
        hasActiveFilters={hasActiveFilters}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onTogglePlatform={togglePlatform}
        onSortByChange={setSortBy}
        onFreeShippingChange={setFreeShipping}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearFilters={clearFilters}
      />
    </div>
  );
};

export default SearchForm;
