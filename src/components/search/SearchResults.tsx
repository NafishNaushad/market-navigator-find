
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { Product } from "./SearchPage";

interface SearchResultsProps {
  products: Product[];
}

const SearchResults = ({ products }: SearchResultsProps) => {
  const handleViewProduct = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      'Amazon': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Flipkart': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Meesho': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'AliExpress': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[platform as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Search Results ({products.length} products found)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <Badge 
                  className={`absolute top-2 right-2 ${getPlatformColor(product.platform)}`}
                >
                  {product.platform}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {product.currency}{product.price}
                  </span>
                </div>
                <Button 
                  onClick={() => handleViewProduct(product.link)}
                  className="w-full"
                  size="sm"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Product
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchResults;
