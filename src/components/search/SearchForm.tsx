
import { useState } from "react";
import { SearchFilters as SearchFiltersType } from "@/types/product";
import SearchInput from "./SearchInput";
import AdvancedFilters from "./AdvancedFilters";

interface SearchFormProps {
  onSearch: (query: string, filters: SearchFiltersType) => void;
  loading: boolean;
  availablePlatforms: string[];
  availableBrands: string[];
}

const SearchForm = ({ onSearch, loading, availablePlatforms, availableBrands }: SearchFormProps) => {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersType>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query, filters);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Compare Products Across All Platforms</h2>
          <p className="text-blue-100">Find the best deals from multiple e-commerce platforms in one place!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <SearchInput
            query={query}
            onQueryChange={setQuery}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </form>
      </div>

      <AdvancedFilters
        filters={filters}
        onFiltersChange={setFilters}
        availablePlatforms={availablePlatforms}
        availableBrands={availableBrands}
        isOpen={showFilters}
        onToggle={() => setShowFilters(!showFilters)}
      />
    </div>
  );
};

export default SearchForm;
