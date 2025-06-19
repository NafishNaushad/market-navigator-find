
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const SearchInput = ({ query, onQueryChange, onSubmit, loading }: SearchInputProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            placeholder="Search for products (e.g., wireless headphones, laptop, shoes)"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="text-lg pr-10"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              onClick={() => onQueryChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
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
  );
};

export default SearchInput;
