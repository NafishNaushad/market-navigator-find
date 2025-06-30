import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ShoppingCart, Star, Truck, Clock, GitCompare, Heart, TrendingUp } from "lucide-react";
import { Product } from "./SearchPage";
import { useState } from "react";
import ProductDetailModal from "./ProductDetailModal";
import AdvancedFilters from "./AdvancedFilters";

interface EnhancedSearchResultsProps {
  products: Product[];
  searchQuery: string;
  availablePlatforms: string[];
  availableBrands: string[];
}

const EnhancedSearchResults = ({ 
  products, 
  searchQuery, 
  availablePlatforms, 
  availableBrands 
}: EnhancedSearchResultsProps) => {
  const [compareList, setCompareList] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleShopNow = (product: Product) => {
    // Open the actual shopping platform with search query
    const platformUrls = {
      'Amazon India': `https://www.amazon.in/s?k=${encodeURIComponent(searchQuery)}`,
      'Flipkart': `https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`,
      'Meesho': `https://www.meesho.com/search?q=${encodeURIComponent(searchQuery)}`,
      'Myntra': `https://www.myntra.com/${encodeURIComponent(searchQuery)}`,
      'Snapdeal': `https://www.snapdeal.com/search?keyword=${encodeURIComponent(searchQuery)}`,
      'Amazon': `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}`,
      'eBay': `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchQuery)}`,
      'Walmart': `https://www.walmart.com/search?q=${encodeURIComponent(searchQuery)}`,
      'Best Buy': `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(searchQuery)}`,
      'Target': `https://www.target.com/s?searchTerm=${encodeURIComponent(searchQuery)}`,
      'Amazon UK': `https://www.amazon.co.uk/s?k=${encodeURIComponent(searchQuery)}`,
      'eBay UK': `https://www.ebay.co.uk/sch/i.html?_nkw=${encodeURIComponent(searchQuery)}`,
      'Argos': `https://www.argos.co.uk/search/${encodeURIComponent(searchQuery)}`,
      'Currys': `https://www.currys.co.uk/search?q=${encodeURIComponent(searchQuery)}`,
      'John Lewis': `https://www.johnlewis.com/search?search-term=${encodeURIComponent(searchQuery)}`
    };

    const url = platformUrls[product.platform as keyof typeof platformUrls];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
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
      'Amazon India': 'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
      'Amazon UK': 'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
      'Flipkart': 'bg-gradient-to-r from-blue-500 to-blue-700 text-white',
      'Meesho': 'bg-gradient-to-r from-pink-500 to-pink-700 text-white',
      'Myntra': 'bg-gradient-to-r from-purple-500 to-purple-700 text-white',
      'Snapdeal': 'bg-gradient-to-r from-red-500 to-red-700 text-white',
      'AliExpress': 'bg-gradient-to-r from-red-500 to-red-700 text-white',
      'eBay': 'bg-gradient-to-r from-yellow-500 to-yellow-700 text-white',
      'eBay UK': 'bg-gradient-to-r from-yellow-500 to-yellow-700 text-white',
      'Walmart': 'bg-gradient-to-r from-blue-400 to-blue-600 text-white',
      'Best Buy': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
      'Target': 'bg-gradient-to-r from-red-400 to-red-600 text-white',
      'Argos': 'bg-gradient-to-r from-red-400 to-red-600 text-white',
      'Currys': 'bg-gradient-to-r from-blue-500 to-blue-700 text-white',
      'John Lewis': 'bg-gradient-to-r from-green-500 to-green-700 text-white',
    };
    return colors[platform as keyof typeof colors] || 'bg-gradient-to-r from-gray-500 to-gray-700 text-white';
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

  // Apply client-side filtering
  const getFilteredProducts = () => {
    let filtered = products;

    if (filters.minPrice || filters.maxPrice) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        if (filters.minPrice && price < filters.minPrice) return false;
        if (filters.maxPrice && price > filters.maxPrice) return false;
        return true;
      });
    }

    if (filters.platforms && filters.platforms.length > 0) {
      filtered = filtered.filter(product => 
        filters.platforms.includes(product.platform)
      );
    }

    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        filters.brands.includes(product.brand)
      );
    }

    if (filters.minRating) {
      filtered = filtered.filter(product => 
        (product.rating || 0) >= filters.minRating
      );
    }

    if (filters.freeShipping) {
      filtered = filtered.filter(product => 
        product.shipping?.toLowerCase().includes('free')
      );
    }

    // Apply sorting
    if (filters.sortBy && filters.sortBy !== 'relevance') {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-low':
            return parseFloat(a.price) - parseFloat(b.price);
          case 'price-high':
            return parseFloat(b.price) - parseFloat(a.price);
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'popularity':
            return (b.reviews || 0) - (a.reviews || 0);
          case 'delivery':
            return (a.deliveryTime || 7) - (b.deliveryTime || 7);
          default:
            return 0;
        }
      });
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <>
      <div className="space-y-6">
        {/* Header with results info and compare */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                Results for "{searchQuery}"
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Found {filteredProducts.length} products across {availablePlatforms.length} platforms
              </p>
            </div>
            
            {compareList.length > 0 && (
              <Button className="bg-purple-600 hover:bg-purple-700">
                <GitCompare className="h-4 w-4 mr-2" />
                Compare ({compareList.length})
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        <AdvancedFilters
          filters={filters}
          onFiltersChange={setFilters}
          availablePlatforms={availablePlatforms}
          availableBrands={availableBrands}
          isOpen={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border border-gray-200"
            >
              <div className="relative">
                <div 
                  className="aspect-square bg-gray-50 overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Platform Badge */}
                <Badge className={`absolute top-2 right-2 ${getPlatformColor(product.platform)} text-xs font-semibold shadow-lg`}>
                  {product.platform}
                </Badge>
                
                {/* Discount Badge */}
                {product.discount && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold">
                    {product.discount}% OFF
                  </Badge>
                )}
                
                {/* Action Buttons */}
                <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 w-7 p-0 bg-white/90 hover:bg-white shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                  >
                    <Heart className={`h-3 w-3 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 w-7 p-0 bg-white/90 hover:bg-white shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompare(product.id);
                    }}
                  >
                    <GitCompare className={`h-3 w-3 ${compareList.includes(product.id) ? 'text-purple-600' : 'text-gray-600'}`} />
                  </Button>
                </div>

                {/* Limited Stock Badge */}
                {product.availability?.toLowerCase().includes('limited') && (
                  <Badge className="absolute bottom-2 left-2 bg-red-500 text-white animate-pulse text-xs">
                    <Clock className="h-2 w-2 mr-1" />
                    Limited
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-3 space-y-2">
                <h3 className="font-medium text-sm leading-tight line-clamp-2 min-h-[2.5rem] text-gray-900 group-hover:text-purple-600 transition-colors">
                  {product.title}
                </h3>
                
                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      {product.rating}
                    </span>
                    {product.reviews && (
                      <span className="text-xs text-gray-500">
                        ({product.reviews.toLocaleString()})
                      </span>
                    )}
                  </div>
                )}

                {/* Pricing */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">
                      {product.currency}{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {product.currency}{product.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  {/* Shipping */}
                  {product.shipping && (
                    <div className="flex items-center gap-1">
                      <Truck className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">
                        {product.shipping}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500">by {product.seller}</p>
                </div>

                {/* Shop Now Button */}
                <Button 
                  onClick={() => handleShopNow(product)}
                  className={`w-full text-xs ${getPlatformColor(product.platform)} hover:opacity-90 transition-opacity`}
                  size="sm"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Shop on {product.platform}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or search with different keywords.</p>
          </div>
        )}
      </div>

      <ProductDetailModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default EnhancedSearchResults;
