// src/constants/marketplaceData.ts

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  farmer: {
    name: string;
    location: string;
    verified: boolean;
    rating: number;
    totalReviews: number;
    yearsExperience: number;
    certifications: string[];
  };
  quality: {
    grade: 'A' | 'B' | 'C';
    certifications: string[];
    inspectionDate: string;
    inspector: string;
  };
  sustainability: {
    organic: boolean;
    fairTrade: boolean;
    carbonFootprint: number;
    waterUsage: number;
    practices: string[];
  };
  images: string[];
  reviews: Array<{
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
    helpful: number;
  }>;
  traceabilityUrl: string;
  marketplaceUrl: string;
  inStock: boolean;
  stockLevel: number;
  soldCount: number;
  viewCount: number;
  tags: string[];
  shipping: {
    weight: number;
    dimensions: { length: number; width: number; height: number };
    options: string[];
    freeShipping: boolean;
  };
  nutrition?: {
    calories: number;
    protein: number;
    vitamins: string[];
    allergens: string[];
  };
}

export const mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Premium Moringa Powder - 250g',
    description: '100% organic moringa powder from certified farms. Rich in vitamins, minerals, and antioxidants. Perfect for smoothies, teas, and cooking.',
    category: 'Powders',
    price: 89.99,
    originalPrice: 120.00,
    discount: 25,
    farmer: {
      name: 'Thabo Molefe',
      location: 'Limpopo Province',
      verified: true,
      rating: 4.8,
      totalReviews: 156,
      yearsExperience: 12,
      certifications: ['Organic Certified', 'Fair Trade', 'Sustainable Farming']
    },
    quality: {
      grade: 'A',
      certifications: ['ISO 9001', 'HACCP', 'Organic Standard'],
      inspectionDate: '2024-01-15',
      inspector: 'Dr. Sarah Chen'
    },
    sustainability: {
      organic: true,
      fairTrade: true,
      carbonFootprint: 2.3,
      waterUsage: 450,
      practices: ['Drip Irrigation', 'Solar Powered', 'Zero Waste Processing']
    },
    images: ['/maroon_traceability/images/moringa-powder.jpg'],
    reviews: [
      {
        id: 'rev1',
        userId: 'user1',
        userName: 'Maria Santos',
        rating: 5,
        comment: 'Excellent quality! Very fresh and potent. I use it daily in my morning smoothie.',
        date: '2024-01-20',
        verified: true,
        helpful: 23
      }
    ],
    traceabilityUrl: '/trace/prod1',
    marketplaceUrl: '/marketplace/products/prod1',
    inStock: true,
    stockLevel: 150,
    soldCount: 892,
    viewCount: 3421,
    tags: ['organic', 'vegan', 'gluten-free', 'superfood'],
    shipping: {
      weight: 0.3,
      dimensions: { length: 15, width: 10, height: 5 },
      options: ['Standard', 'Express', 'International'],
      freeShipping: true
    },
    nutrition: {
      calories: 25,
      protein: 2.5,
      vitamins: ['Vitamin C', 'Vitamin A', 'Vitamin E', 'Calcium', 'Iron'],
      allergens: []
    }
  },
  {
    id: 'prod2',
    name: 'Moringa Tea Bags - 20 count',
    description: 'Premium quality moringa tea bags made from dried moringa leaves. Caffeine-free and rich in antioxidants.',
    category: 'Teas',
    price: 45.99,
    farmer: {
      name: 'Grace Nkosi',
      location: 'Mpumalanga',
      verified: true,
      rating: 4.6,
      totalReviews: 89,
      yearsExperience: 8,
      certifications: ['Organic Certified', 'Rainforest Alliance']
    },
    quality: {
      grade: 'A',
      certifications: ['ISO 9001', 'Organic Standard'],
      inspectionDate: '2024-01-10',
      inspector: 'Dr. James Wilson'
    },
    sustainability: {
      organic: true,
      fairTrade: false,
      carbonFootprint: 1.8,
      waterUsage: 320,
      practices: ['Natural Drying', 'Biodegradable Packaging']
    },
    images: ['/maroon_traceability/images/moringa-tea.jpg'],
    reviews: [],
    traceabilityUrl: '/trace/prod2',
    marketplaceUrl: '/marketplace/products/prod2',
    inStock: true,
    stockLevel: 200,
    soldCount: 445,
    viewCount: 1876,
    tags: ['organic', 'caffeine-free', 'antioxidants'],
    shipping: {
      weight: 0.1,
      dimensions: { length: 12, width: 8, height: 4 },
      options: ['Standard', 'Express'],
      freeShipping: true
    }
  },
  {
    id: 'prod3',
    name: 'Moringa Capsules - 60 count',
    description: 'Convenient moringa capsules for daily supplementation. Each capsule contains 500mg of pure moringa leaf powder.',
    category: 'Supplements',
    price: 125.99,
    farmer: {
      name: 'Samuel Khumalo',
      location: 'North West Province',
      verified: true,
      rating: 4.7,
      totalReviews: 124,
      yearsExperience: 15,
      certifications: ['GMP Certified', 'Organic Certified']
    },
    quality: {
      grade: 'A',
      certifications: ['GMP', 'ISO 9001', 'Organic Standard'],
      inspectionDate: '2024-01-18',
      inspector: 'Dr. Lisa Anderson'
    },
    sustainability: {
      organic: true,
      fairTrade: true,
      carbonFootprint: 3.1,
      waterUsage: 580,
      practices: ['GMP Processing', 'Recyclable Packaging', 'Renewable Energy']
    },
    images: ['/maroon_traceability/images/moringa-capsules.jpg'],
    reviews: [],
    traceabilityUrl: '/trace/prod3',
    marketplaceUrl: '/marketplace/products/prod3',
    inStock: true,
    stockLevel: 75,
    soldCount: 623,
    viewCount: 2890,
    tags: ['organic', 'gmp-certified', 'daily-supplement'],
    shipping: {
      weight: 0.15,
      dimensions: { length: 10, width: 6, height: 3 },
      options: ['Standard', 'Express', 'International'],
      freeShipping: false
    }
  },
  {
    id: 'prod4',
    name: 'Organic Moringa Oil - 100ml',
    description: 'Cold-pressed moringa oil rich in oleic acid. Perfect for cooking, skincare, and hair care.',
    category: 'Oils',
    price: 65.99,
    originalPrice: 89.99,
    discount: 27,
    farmer: {
      name: 'Esther Mbatha',
      location: 'Eastern Cape',
      verified: true,
      rating: 4.9,
      totalReviews: 203,
      yearsExperience: 10,
      certifications: ['Organic Certified', 'Cold Pressed', 'Non-GMO']
    },
    quality: {
      grade: 'A',
      certifications: ['ISO 9001', 'Cold Pressed Standard', 'Organic Standard'],
      inspectionDate: '2024-01-22',
      inspector: 'Dr. Michael Roberts'
    },
    sustainability: {
      organic: true,
      fairTrade: true,
      carbonFootprint: 1.5,
      waterUsage: 280,
      practices: ['Cold Press Extraction', 'Glass Bottling', 'Solar Powered Facility']
    },
    images: ['/maroon_traceability/images/moringa-oil.jpg'],
    reviews: [],
    traceabilityUrl: '/trace/prod4',
    marketplaceUrl: '/marketplace/products/prod4',
    inStock: true,
    stockLevel: 95,
    soldCount: 412,
    viewCount: 1654,
    tags: ['organic', 'cold-pressed', 'versatile', 'skincare'],
    shipping: {
      weight: 0.15,
      dimensions: { length: 8, width: 6, height: 12 },
      options: ['Standard', 'Express'],
      freeShipping: true
    }
  },
  {
    id: 'prod5',
    name: 'Moringa Seeds - Premium Pack - 500g',
    description: 'High-quality moringa seeds for home gardening. 95% germination rate guaranteed.',
    category: 'Seeds',
    price: 35.99,
    originalPrice: 49.99,
    discount: 28,
    farmer: {
      name: 'David Moloi',
      location: 'Free State',
      verified: true,
      rating: 4.5,
      totalReviews: 87,
      yearsExperience: 20,
      certifications: ['Heirloom Seeds', 'Organic Certified']
    },
    quality: {
      grade: 'A',
      certifications: ['Seed Certification', 'ISO 9001'],
      inspectionDate: '2024-01-25',
      inspector: 'Dr. Susan Williams'
    },
    sustainability: {
      organic: true,
      fairTrade: false,
      carbonFootprint: 0.8,
      waterUsage: 150,
      practices: ['Heirloom Varieties', 'Natural Processing', 'Biodegradable Packaging']
    },
    images: ['/maroon_traceability/images/moringa-seeds.jpg'],
    reviews: [],
    traceabilityUrl: '/trace/prod5',
    marketplaceUrl: '/marketplace/products/prod5',
    inStock: true,
    stockLevel: 180,
    soldCount: 234,
    viewCount: 987,
    tags: ['organic', 'heirloom', 'gardening', 'non-gmo'],
    shipping: {
      weight: 0.6,
      dimensions: { length: 15, width: 10, height: 3 },
      options: ['Standard', 'Express'],
      freeShipping: true
    }
  },
  {
    id: 'prod6',
    name: 'Fresh Moringa Leaves - 200g Bundle',
    description: 'Freshly harvested moringa leaves, washed and ready for cooking. Rich in nutrients.',
    category: 'Fresh',
    price: 28.99,
    originalPrice: 39.99,
    discount: 28,
    farmer: {
      name: 'Rachel Ndlovu',
      location: 'KwaZulu-Natal',
      verified: true,
      rating: 4.7,
      totalReviews: 156,
      yearsExperience: 6,
      certifications: ['Organic Certified', 'Fresh Produce Standard']
    },
    quality: {
      grade: 'A',
      certifications: ['Fresh Produce', 'Organic Standard'],
      inspectionDate: '2024-01-28',
      inspector: 'Dr. James Wilson'
    },
    sustainability: {
      organic: true,
      fairTrade: true,
      carbonFootprint: 0.5,
      waterUsage: 80,
      practices: ['Daily Harvest', 'Natural Washing', 'Rapid Cooling']
    },
    images: ['/maroon_traceability/images/fresh-moringa.jpg'],
    reviews: [],
    traceabilityUrl: '/trace/prod6',
    marketplaceUrl: '/marketplace/products/prod6',
    inStock: true,
    stockLevel: 60,
    soldCount: 189,
    viewCount: 1234,
    tags: ['fresh', 'organic', 'ready-to-cook', 'nutrient-rich'],
    shipping: {
      weight: 0.3,
      dimensions: { length: 20, width: 15, height: 5 },
      options: ['Express', 'Same Day'],
      freeShipping: false
    }
  },
  {
    id: 'prod7',
    name: 'Free-Range Chicken Eggs - 30 count',
    description: 'Farm-fresh eggs from free-range chickens fed with moringa-enhanced feed.',
    category: 'Poultry',
    price: 55.99,
    originalPrice: 69.99,
    discount: 20,
    farmer: {
      name: 'Peter van der Merwe',
      location: 'Western Cape',
      verified: true,
      rating: 4.8,
      totalReviews: 298,
      yearsExperience: 12,
      certifications: ['Free Range Certified', 'Animal Welfare Approved']
    },
    quality: {
      grade: 'A',
      certifications: ['Animal Welfare', 'Food Safety'],
      inspectionDate: '2024-01-30',
      inspector: 'Dr. Lisa Anderson'
    },
    sustainability: {
      organic: true,
      fairTrade: true,
      carbonFootprint: 2.1,
      waterUsage: 420,
      practices: ['Free Range', 'Moringa Feed', 'Humane Treatment']
    },
    images: ['/maroon_traceability/images/fresh-eggs.jpg'],
    reviews: [],
    traceabilityUrl: '/trace/prod7',
    marketplaceUrl: '/marketplace/products/prod7',
    inStock: true,
    stockLevel: 45,
    soldCount: 567,
    viewCount: 2890,
    tags: ['free-range', 'organic', 'moringa-enhanced', 'farm-fresh'],
    shipping: {
      weight: 1.2,
      dimensions: { length: 25, width: 20, height: 8 },
      options: ['Express', 'Cool Chain'],
      freeShipping: false
    }
  },
  {
    id: 'prod8',
    name: 'Organic Honey with Moringa - 500g',
    description: 'Pure wildflower honey infused with moringa extract. Natural sweetener with health benefits.',
    category: 'Honey',
    price: 78.99,
    originalPrice: 99.99,
    discount: 21,
    farmer: {
      name: 'Nomvula Dlamini',
      location: 'Mpumalanga',
      verified: true,
      rating: 4.9,
      totalReviews: 412,
      yearsExperience: 18,
      certifications: ['Organic Honey', 'Bee Friendly']
    },
    quality: {
      grade: 'A',
      certifications: ['Honey Standard', 'Organic Certification'],
      inspectionDate: '2024-02-02',
      inspector: 'Dr. Sarah Chen'
    },
    sustainability: {
      organic: true,
      fairTrade: true,
      carbonFootprint: 1.2,
      waterUsage: 90,
      practices: ['Sustainable Beekeeping', 'Natural Infusion', 'Glass Packaging']
    },
    images: ['/maroon_traceability/images/moringa-honey.jpg'],
    reviews: [],
    traceabilityUrl: '/trace/prod8',
    marketplaceUrl: '/marketplace/products/prod8',
    inStock: true,
    stockLevel: 85,
    soldCount: 723,
    viewCount: 3456,
    tags: ['organic', 'wildflower', 'moringa-infused', 'natural-sweetener'],
    shipping: {
      weight: 0.7,
      dimensions: { length: 12, width: 8, height: 8 },
      options: ['Standard', 'Express'],
      freeShipping: true
    }
  }
];

export const categories = [
  'Powders', 
  'Teas', 
  'Supplements', 
  'Oils', 
  'Seeds', 
  'Fresh', 
  'Poultry', 
  'Beef', 
  'Vegetables', 
  'Honey', 
  'Grains'
];

export const featuredProducts = mockProducts.filter(product => product.discount);

export const trustSignals = [
  {
    icon: 'CheckCircle',
    title: 'Verified Farmers',
    description: 'All farmers are verified and certified'
  },
  {
    icon: 'Award',
    title: 'Quality Inspected',
    description: 'Products undergo rigorous quality checks'
  },
  {
    icon: 'Leaf',
    title: 'Sustainably Grown',
    description: 'Environmentally friendly farming practices'
  },
  {
    icon: 'Truck',
    title: 'Fresh Delivery',
    description: 'Fast and reliable delivery nationwide'
  }
];
