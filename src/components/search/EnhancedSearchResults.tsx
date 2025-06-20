
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ShoppingCart, Star, Truck, Clock, GitCompare, Heart, TrendingUp, Filter } from "lucide-react";
import { Product } from "./SearchPage";
import { useState } from "react";
import ProductDetailModal from "./ProductDetailModal";

interface EnhancedSearchResultsProps {
  products: Product[];
  searchQuery: string;
}

const EnhancedSearchResults = ({ products, searchQuery }: EnhancedSearchResultsProps) => {
  const [compareList, setCompareList] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
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

  const getFilteredAndSortedProducts = () => {
    let filtered = products;

    // Filter by platform
    if (filterPlatform !== 'all') {
      filtered = filtered.filter(product => product.platform === filterPlatform);
    }

    // Sort products
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'popularity':
          return (b.reviews || 0) - (a.reviews || 0);
        default:
          return 0;
      }
    });
  };

  const filteredProducts = getFilteredAndSortedProducts();
  const platforms = [...new Set(products.map(p => p.platform))];

  return (
    <>
      <div className="space-y-6">
        {/* Header with filters and compare */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                Results for "{searchQuery}"
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Found {filteredProducts.length} products across {platforms.length} platforms
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Platform Filter */}
              <select 
                value={filterPlatform} 
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              >
                <option value="all">All Platforms</option>
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>

              {/* Sort Options */}
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popularity">Most Popular</option>
              </select>

              {compareList.length > 0 && (
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <GitCompare className="h-4 w-4 mr-2" />
                  Compare ({compareList.length})
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border border-gray-200 cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative">
                <div className="aspect-square bg-gray-50 overflow-hidden">
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
