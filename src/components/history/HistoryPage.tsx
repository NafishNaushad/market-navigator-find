
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Clock, Trash2, Filter, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface SearchHistoryItem {
  id: string;
  query: string;
  filters: any;
  results_count: number;
  timestamp: string;
}

const HistoryPage = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHistory, setFilteredHistory] = useState<SearchHistoryItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = history.filter(item =>
        item.query.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHistory(filtered);
    } else {
      setFilteredHistory(history);
    }
  }, [searchTerm, history]);

  const loadHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
      toast({
        title: "Error loading history",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(prev => prev.filter(item => item.id !== id));
      toast({
        title: "History item deleted",
        description: "Search history item has been removed.",
      });
    } catch (error) {
      console.error('Error deleting history item:', error);
      toast({
        title: "Error deleting item",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const clearAllHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setHistory([]);
      toast({
        title: "History cleared",
        description: "All search history has been removed.",
      });
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        title: "Error clearing history",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const repeatSearch = (query: string, filters: any) => {
    // This would trigger a new search with the same parameters
    // For now, we'll just show a toast
    toast({
      title: "Repeating search",
      description: `Searching for "${query}" again...`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Search History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search your history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={clearAllHistory}
              disabled={history.length === 0}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {history.length === 0 ? (
                <div>
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No search history yet</p>
                  <p className="text-sm">Your searches will appear here</p>
                </div>
              ) : (
                <p>No searches match your filter</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-lg">{item.query}</h3>
                        <Badge variant="secondary">
                          {item.results_count} results
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {format(new Date(item.timestamp), 'PPpp')}
                      </p>
                      {item.filters && Object.keys(item.filters).length > 0 && (
                        <div className="flex items-center gap-2 mb-2">
                          <Filter className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Filters applied
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => repeatSearch(item.query, item.filters)}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Repeat
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteHistoryItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryPage;
