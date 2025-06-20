
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Sparkles } from "lucide-react";

interface SearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const SearchInput = ({ query, onQueryChange, onSubmit, loading }: SearchInputProps) => {
  const quickSearchSuggestions = [
    "Wireless Headphones", "Gaming Laptop", "Smartphone", "Running Shoes", "Coffee Maker"
  ];

  return (
    <form onSubmit={onSubmit} className="flex-1">
      <div className="flex gap-3">
        <div className="flex-1 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative">
            <Input
              placeholder="Search for any product across all platforms..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="text-lg h-14 pr-12 bg-white/95 backdrop-blur-sm border-2 border-white/50 rounded-xl shadow-lg focus:border-purple-400 focus:ring-4 focus:ring-purple-200 transition-all duration-300"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => onQueryChange("")}
              >
                <X className="h-5 w-5 text-gray-400" />
              </Button>
            )}
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={loading || !query.trim()} 
          className="h-14 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Searching...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span>Compare</span>
            </div>
          )}
        </Button>
      </div>
      
      {!query && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-white/80">Quick search:</span>
          {quickSearchSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onQueryChange(suggestion)}
              className="px-3 py-1 text-sm bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </form>
  );
};

export default SearchInput;
