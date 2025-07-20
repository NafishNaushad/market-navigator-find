
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink, Truck, Shield, Heart } from "lucide-react";
import { Product } from "@/types/product";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal = ({ product, isOpen, onClose }: ProductDetailModalProps) => {
  if (!product) return null;

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

  const handleBuyNow = () => {
    window.open(product.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left">Product Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex gap-2">
              <Badge className={`${getPlatformColor(product.platform)} text-sm font-semibold`}>
                Available on {product.platform}
              </Badge>
              {product.availability === "Limited stock" && (
                <Badge variant="destructive">Limited Stock</Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-lg font-medium text-gray-700">
                    {product.rating}
                  </span>
                  {product.reviews && (
                    <span className="text-sm text-gray-500">
                      ({product.reviews.toLocaleString()} reviews)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-green-600">
                  {product.currency}{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {product.currency}{product.originalPrice}
                  </span>
                )}
                {product.discount && (
                  <Badge className="bg-red-500 text-white">
                    {product.discount}% OFF
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">Sold by {product.seller}</p>
            </div>

            {/* Shipping */}
            {product.shipping && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Truck className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">{product.shipping}</span>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Key Features:</h4>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Specifications:</h4>
                <div className="grid grid-cols-1 gap-1">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm py-1 border-b border-gray-100">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleBuyNow}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Buy on {product.platform}
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
              <Shield className="h-3 w-3" />
              <span>Secure checkout on {product.platform}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
