
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ShoppingCart, Star, Truck, Clock, Compare, Heart, TrendingUp } from "lucide-react";
import { Product } from "./SearchPage";
import { useState } from "react";

interface EnhancedSearchResultsProps {
  products: Product[];
  searchQuery: string;
}

const EnhancedSearchResults = ({ products, searchQuery }: EnhancedSearchResultsProps) => {
  const [compareList, setCompareList] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const handleViewProduct = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const toggleCompare = (productId: string) => {
    setCompareList(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      'Amazon': 'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
      'Flipkart': 'bg-gradient-to-r from-blue-500 to-blue-700 text-white',
      'Meesho': 'bg-gradient-to-r from-pink-500 to-pink-700 text-white',
      'AliExpress': 'bg-gradient-to-r from-red-500 to-red-700 text-white',
      'eBay': 'bg-gradient-to-r from-yellow-500 to-yellow-700 text-white',
    };
    return colors[platform as keyof typeof colors] || 'bg-gradient-to-r from-gray-500 to-gray-700 text-white';
  };

  const getDeliverySpeed = (shipping: string) => {
    if (shipping?.toLowerCase().includes('same day')) return 'lightning';
    if (shipping?.toLowerCase().includes('next day')) return 'fast';
    if (shipping?.toLowerCase().includes('2-3 days')) return 'normal';
    return 'slow';
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              Results for "{searchQuery}"
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Found {products.length} products across multiple platforms
            </p>
          </div>
          {compareList.length > 0 && (
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Compare className="h-4 w-4 mr-2" />
              Compare ({compareList.length})
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white dark:bg-gray-800 border-0 shadow-lg">
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <Badge className={`absolute top-3 left-3 ${getPlatformColor(product.platform)} font-semibold shadow-lg`}>
                {product.platform}
              </Badge>
              
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                  onClick={() => toggleCompare(product.id)}
                >
                  <Compare className={`h-4 w-4 ${compareList.includes(product.id) ? 'text-purple-600' : 'text-gray-600'}`} />
                </Button>
              </div>

              {product.availability?.toLowerCase().includes('limited') && (
                <Badge className="absolute bottom-3 left-3 bg-red-500 text-white animate-pulse">
                  <Clock className="h-3 w-3 mr-1" />
                  Limited Stock
                </Badge>
              )}
            </div>
            
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-purple-600 transition-colors">
                {product.title}
              </h3>
              
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {product.rating}
                  </span>
                  {product.reviews && (
                    <span className="text-xs text-gray-500">
                      ({product.reviews.toLocaleString()})
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {product.currency}{product.price}
                  </span>
                  {product.shipping && (
                    <div className="flex items-center gap-1 text-xs">
                      <Truck className={`h-3 w-3 ${getDeliverySpeed(product.shipping) === 'lightning' ? 'text-yellow-500' : 'text-gray-500'}`} />
                      <span className={product.shipping.toLowerCase().includes('free') ? 'text-green-600 font-medium' : 'text-gray-600'}>
                        {product.shipping}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                onClick={() => handleViewProduct(product.link)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 group-hover:shadow-lg"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on {product.platform}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No products found</h3>
          <p className="text-gray-500">Try searching with different keywords or adjust your filters.</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchResults;
