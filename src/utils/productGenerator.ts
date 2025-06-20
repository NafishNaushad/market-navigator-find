
interface ProductTemplate {
  baseTitle: string;
  category: string;
  brands: string[];
  priceRanges: { min: number; max: number }[];
  features: string[];
  specifications: Record<string, string[]>;
  images: string[];
}

interface CountryConfig {
  currency: string;
  symbol: string;
  platforms: string[];
  priceMultiplier: number;
  popularBrands: string[];
}

const countryConfigs: Record<string, CountryConfig> = {
  'US': {
    currency: 'USD',
    symbol: '$',
    platforms: ['Amazon', 'eBay', 'Walmart', 'Best Buy', 'Target'],
    priceMultiplier: 1.0,
    popularBrands: ['Apple', 'Samsung', 'Sony', 'Microsoft', 'Google']
  },
  'IN': {
    currency: 'INR',
    symbol: '₹',
    platforms: ['Amazon', 'Flipkart', 'Meesho', 'Myntra', 'Snapdeal'],
    priceMultiplier: 75.0,
    popularBrands: ['Xiaomi', 'OnePlus', 'Realme', 'Vivo', 'Samsung']
  },
  'GB': {
    currency: 'GBP',
    symbol: '£',
    platforms: ['Amazon', 'eBay', 'Argos', 'Currys', 'John Lewis'],
    priceMultiplier: 0.85,
    popularBrands: ['Apple', 'Samsung', 'Sony', 'LG', 'Dyson']
  }
};

const productTemplates: Record<string, ProductTemplate[]> = {
  'headphones': [
    {
      baseTitle: 'Wireless Bluetooth Headphones',
      category: 'Electronics',
      brands: ['Sony', 'Apple', 'Bose', 'Samsung', 'JBL', 'Audio-Technica', 'Sennheiser'],
      priceRanges: [
        { min: 50, max: 150 },
        { min: 150, max: 300 },
        { min: 300, max: 500 }
      ],
      features: [
        'Active Noise Cancellation',
        'Wireless Bluetooth 5.0',
        '30-hour battery life',
        'Fast charging',
        'Premium audio quality',
        'Comfortable over-ear design',
        'Built-in microphone',
        'Foldable design'
      ],
      specifications: {
        'Driver Size': ['40mm', '50mm', '45mm'],
        'Frequency Response': ['20Hz-20kHz', '16Hz-22kHz', '18Hz-24kHz'],
        'Battery Life': ['25 hours', '30 hours', '35 hours'],
        'Connectivity': ['Bluetooth 5.0', 'Bluetooth 5.2', 'Wired + Wireless']
      },
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944',
        'https://images.unsplash.com/photo-1545127398-14699f92334b'
      ]
    }
  ],
  'smartphone': [
    {
      baseTitle: 'Smartphone',
      category: 'Electronics',
      brands: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Realme', 'Vivo'],
      priceRanges: [
        { min: 200, max: 500 },
        { min: 500, max: 800 },
        { min: 800, max: 1200 }
      ],
      features: [
        'Triple camera system',
        '5G connectivity',
        'Fast charging',
        'Wireless charging',
        'Water resistant',
        'Face recognition',
        'Fingerprint sensor',
        'High refresh rate display'
      ],
      specifications: {
        'Display': ['6.1 inch', '6.4 inch', '6.7 inch'],
        'Storage': ['128GB', '256GB', '512GB'],
        'RAM': ['6GB', '8GB', '12GB'],
        'Camera': ['48MP', '64MP', '108MP']
      },
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab',
        'https://images.unsplash.com/photo-1556656793-08538906a9f8'
      ]
    }
  ],
  'laptop': [
    {
      baseTitle: 'Laptop',
      category: 'Electronics',
      brands: ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'Microsoft'],
      priceRanges: [
        { min: 400, max: 800 },
        { min: 800, max: 1500 },
        { min: 1500, max: 2500 }
      ],
      features: [
        'Intel Core processor',
        'SSD storage',
        'Full HD display',
        'Backlit keyboard',
        'Long battery life',
        'Lightweight design',
        'Fast boot time',
        'Multi-port connectivity'
      ],
      specifications: {
        'Processor': ['Intel i5', 'Intel i7', 'AMD Ryzen 5', 'AMD Ryzen 7'],
        'RAM': ['8GB', '16GB', '32GB'],
        'Storage': ['256GB SSD', '512GB SSD', '1TB SSD'],
        'Display': ['13.3 inch', '15.6 inch', '17.3 inch']
      },
      images: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed'
      ]
    }
  ]
};

export const generateRealisticProducts = (
  query: string,
  userCountry: string = 'US',
  filters: any = {}
): any[] => {
  const country = countryConfigs[userCountry] || countryConfigs['US'];
  const searchTerm = query.toLowerCase();
  
  // Find relevant product templates
  const relevantTemplates: ProductTemplate[] = [];
  Object.entries(productTemplates).forEach(([category, templates]) => {
    if (searchTerm.includes(category) || templates.some(t => 
      t.baseTitle.toLowerCase().includes(searchTerm) ||
      t.brands.some(brand => brand.toLowerCase().includes(searchTerm))
    )) {
      relevantTemplates.push(...templates);
    }
  });

  // If no specific templates found, use all templates for broader search
  if (relevantTemplates.length === 0) {
    Object.values(productTemplates).forEach(templates => {
      relevantTemplates.push(...templates);
    });
  }

  const products: any[] = [];

  relevantTemplates.forEach(template => {
    template.brands.forEach(brand => {
      template.priceRanges.forEach((priceRange, priceIndex) => {
        country.platforms.forEach(platform => {
          // Generate multiple variants per brand/platform/price range
          for (let variant = 0; variant < 2; variant++) {
            const basePrice = Math.random() * (priceRange.max - priceRange.min) + priceRange.min;
            const finalPrice = (basePrice * country.priceMultiplier).toFixed(2);
            
            // Platform-specific price variations
            const platformMultipliers = {
              'Amazon': 1.0,
              'Flipkart': 0.95,
              'eBay': 0.90,
              'Meesho': 0.85,
              'Walmart': 0.92,
              'Best Buy': 1.05
            };
            
            const platformPrice = (parseFloat(finalPrice) * (platformMultipliers[platform as keyof typeof platformMultipliers] || 1.0)).toFixed(2);
            const originalPrice = (parseFloat(platformPrice) * 1.2).toFixed(2);
            const discount = Math.floor(Math.random() * 30) + 10;
            
            // Generate realistic product details
            const selectedFeatures = template.features
              .sort(() => 0.5 - Math.random())
              .slice(0, Math.floor(Math.random() * 4) + 3);
            
            const specifications: Record<string, string> = {};
            Object.entries(template.specifications).forEach(([key, values]) => {
              specifications[key] = values[Math.floor(Math.random() * values.length)];
            });
            
            const rating = Math.random() * 1.5 + 3.5; // 3.5 to 5.0
            const reviews = Math.floor(Math.random() * 10000) + 100;
            const imageIndex = Math.floor(Math.random() * template.images.length);
            
            // Generate realistic titles with brand and model
            const modelNumbers = ['Pro', 'Max', 'Ultra', 'Plus', 'Elite', 'Premium', 'Advanced'];
            const modelNumber = modelNumbers[Math.floor(Math.random() * modelNumbers.length)];
            const title = `${brand} ${template.baseTitle} ${modelNumber} - ${selectedFeatures[0]}`;
            
            const shippingOptions = [
              'Free same-day delivery',
              'Free 2-day shipping',
              'Free standard shipping',
              'Express delivery available',
              'Next-day delivery'
            ];
            
            const availabilityOptions = [
              'In stock',
              'In stock',
              'In stock',
              'Limited stock',
              'Only 3 left in stock'
            ];
            
            products.push({
              id: `${brand}-${platform}-${priceIndex}-${variant}-${Date.now()}`,
              title,
              price: platformPrice,
              originalPrice,
              image: `${template.images[imageIndex]}?w=400&h=400&fit=crop`,
              platform,
              link: `https://${platform.toLowerCase().replace(' ', '')}.com/product/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}`,
              currency: country.symbol,
              rating: parseFloat(rating.toFixed(1)),
              reviews,
              shipping: shippingOptions[Math.floor(Math.random() * shippingOptions.length)],
              availability: availabilityOptions[Math.floor(Math.random() * availabilityOptions.length)],
              discount,
              seller: `${brand} Official Store`,
              description: `Premium ${template.baseTitle.toLowerCase()} from ${brand} featuring ${selectedFeatures.slice(0, 3).join(', ')}. Perfect for ${template.category.toLowerCase()} enthusiasts.`,
              features: selectedFeatures,
              specifications,
              category: template.category,
              brand,
              deliveryTime: Math.floor(Math.random() * 7) + 1 // 1-7 days
            });
          }
        });
      });
    });
  });

  // Apply filters
  let filteredProducts = products;

  if (filters.minPrice || filters.maxPrice) {
    filteredProducts = filteredProducts.filter(product => {
      const price = parseFloat(product.price);
      if (filters.minPrice && price < filters.minPrice) return false;
      if (filters.maxPrice && price > filters.maxPrice) return false;
      return true;
    });
  }

  if (filters.platforms && filters.platforms.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      filters.platforms.includes(product.platform)
    );
  }

  if (filters.freeShipping) {
    filteredProducts = filteredProducts.filter(product => 
      product.shipping.toLowerCase().includes('free')
    );
  }

  if (filters.brands && filters.brands.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      filters.brands.includes(product.brand)
    );
  }

  if (filters.minRating) {
    filteredProducts = filteredProducts.filter(product => 
      product.rating >= filters.minRating
    );
  }

  // Apply sorting
  if (filters.sortBy) {
    filteredProducts.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
          return b.reviews - a.reviews;
        case 'delivery':
          return a.deliveryTime - b.deliveryTime;
        default:
          return 0;
      }
    });
  }

  // Return a realistic number of products (simulate real marketplace density)
  return filteredProducts.slice(0, Math.min(50, filteredProducts.length));
};

export const getCountryConfig = (country: string) => {
  return countryConfigs[country] || countryConfigs['US'];
};

export const getAllBrands = (country: string = 'US') => {
  const allBrands = new Set<string>();
  Object.values(productTemplates).forEach(templates => {
    templates.forEach(template => {
      template.brands.forEach(brand => allBrands.add(brand));
    });
  });
  return Array.from(allBrands);
};
