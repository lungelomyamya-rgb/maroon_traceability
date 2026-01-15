// src/app/retailer/product-management.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  BarChart3,
  Download,
  Upload,
  MoreHorizontal,
  Copy,
  Archive,
  Power
} from 'lucide-react';

interface Batch {
  id: string;
  batchCode: string;
  productName: string;
  quantity: number;
  availableQuantity: number;
  qualityGrade: 'A' | 'B' | 'C';
  inspectionDate: string;
  expiryDate: string;
  wholesalePrice: number;
  farmer: {
    name: string;
    location: string;
    certified: boolean;
  };
  certifications: string[];
  marketplaceEligible: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  wholesalePrice: number;
  markup: number;
  stockLevel: number;
  minStockLevel: number;
  batchCode: string;
  qualityGrade: 'A' | 'B' | 'C';
  status: 'active' | 'inactive' | 'draft' | 'archived';
  images: string[];
  tags: string[];
  shipping: {
    weight: number;
    dimensions: { length: number; width: number; height: number };
    freeShippingThreshold: number;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
  soldCount: number;
  viewCount: number;
  rating: number;
  reviews: number;
  revenue: number;
}

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  wholesalePrice: number;
  markup: number;
  stockQuantity: number;
  images: string[];
  tags: string[];
  shipping: {
    weight: number;
    dimensions: { length: number; width: number; height: number };
    freeShippingThreshold: number;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// Product Management Components
function BatchSelector({ batches, onSelectBatch }: { batches: Batch[]; onSelectBatch: (batch: Batch) => void }) {
  const eligibleBatches = batches.filter(b => 
    b.marketplaceEligible && 
    b.availableQuantity > 0 && 
    new Date(b.expiryDate) > new Date()
  );

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Select Verified Batch</h3>
      <div className="space-y-3">
        {eligibleBatches.map((batch) => (
          <div 
            key={batch.id}
            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onSelectBatch(batch)}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium">{batch.productName}</h4>
                <p className="text-sm text-gray-600">Batch: {batch.batchCode}</p>
              </div>
              <Badge className={batch.qualityGrade === 'A' ? 'bg-green-100 text-green-800' : 
                              batch.qualityGrade === 'B' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}>
                Grade {batch.qualityGrade}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Available:</span>
                <span className="ml-2 font-medium">{batch.availableQuantity} units</span>
              </div>
              <div>
                <span className="text-gray-600">Wholesale:</span>
                <span className="ml-2 font-medium">R{batch.wholesalePrice.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-600">Farmer:</span>
                <span className="ml-2">{batch.farmer.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Expires:</span>
                <span className="ml-2">{new Date(batch.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {batch.certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ProductForm({ batch, onSave, onCancel }: { 
  batch: Batch | null; 
  onSave: (product: ProductFormData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: batch?.productName || '',
    description: '',
    category: '',
    price: batch ? batch.wholesalePrice * 1.5 : 0,
    wholesalePrice: batch?.wholesalePrice || 0,
    markup: 50,
    stockQuantity: batch?.availableQuantity || 0,
    images: [] as string[],
    tags: [] as string[],
    shipping: {
      weight: 0.5,
      dimensions: { length: 10, width: 10, height: 5 },
      freeShippingThreshold: 200
    },
    seo: {
      title: '',
      description: '',
      keywords: [] as string[]
    }
  });

  const categories = ['Powders', 'Teas', 'Supplements', 'Oils', 'Seeds', 'Fresh'];
  const suggestedTags = ['organic', 'premium', 'superfood', 'natural', 'vegan', 'gluten-free'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Create Product Listing</h3>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h4 className="font-medium mb-3">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your product..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h4 className="font-medium mb-3">Pricing & Inventory</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wholesale Cost
              </label>
              <Input
                value={formData.wholesalePrice}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Retail Price *
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => {
                  const price = parseFloat(e.target.value);
                  const markup = formData.wholesalePrice > 0 ? ((price - formData.wholesalePrice) / formData.wholesalePrice * 100) : 0;
                  setFormData(prev => ({ ...prev, price, markup }));
                }}
                min={formData.wholesalePrice * 1.1}
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Markup
              </label>
              <Input
                value={`${formData.markup.toFixed(1)}%`}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity *
            </label>
            <Input
              type="number"
              value={formData.stockQuantity}
              onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) || 0 }))}
              max={batch?.availableQuantity || 0}
              min="0"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum available: {batch?.availableQuantity || 0} units
            </p>
          </div>
        </div>

        {/* Shipping */}
        <div>
          <h4 className="font-medium mb-3">Shipping Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <Input
                type="number"
                value={formData.shipping.weight}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  shipping: { ...prev.shipping, weight: parseFloat(e.target.value) || 0 }
                }))}
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Free Shipping Threshold
              </label>
              <Input
                type="number"
                value={formData.shipping.freeShippingThreshold}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  shipping: { ...prev.shipping, freeShippingThreshold: parseFloat(e.target.value) || 0 }
                }))}
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <h4 className="font-medium mb-3">Product Tags</h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestedTags.map((tag) => (
              <Button
                key={tag}
                type="button"
                variant={formData.tags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    tags: prev.tags.includes(tag) 
                      ? prev.tags.filter(t => t !== tag)
                      : [...prev.tags, tag]
                  }));
                }}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Batch Information */}
        {batch && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Batch Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Batch Code:</span>
                <span className="ml-2 font-medium">{batch.batchCode}</span>
              </div>
              <div>
                <span className="text-gray-600">Quality Grade:</span>
                <span className="ml-2 font-medium">{batch.qualityGrade}</span>
              </div>
              <div>
                <span className="text-gray-600">Inspection Date:</span>
                <span className="ml-2">{new Date(batch.inspectionDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Farmer:</span>
                <span className="ml-2">{batch.farmer.name}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            Save as Draft
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

function ProductList({ products, onEdit, onDelete, onToggleStatus }: {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onToggleStatus: (productId: string, status: 'active' | 'inactive') => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Product Listings</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Powders">Powders</SelectItem>
            <SelectItem value="Teas">Teas</SelectItem>
            <SelectItem value="Supplements">Supplements</SelectItem>
            <SelectItem value="Oils">Oils</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <img 
                src={product.images[0] || '/images/placeholder.jpg'} 
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <Badge className={getStatusColor(product.status)}>
                  {product.status}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-lg font-bold text-gray-900">R{product.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Stock: {product.stockLevel}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-sm ml-1">{product.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">{product.reviews} reviews</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onToggleStatus(product.id, product.status === 'active' ? 'inactive' : 'active')}
                >
                  {product.status === 'active' ? <Archive className="h-3 w-3" /> : <Power className="h-3 w-3" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDelete(product.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}

export default function ProductManagement() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockBatches: Batch[] = [
      {
        id: 'batch1',
        batchCode: 'BATCH-001',
        productName: 'Organic Moringa Powder',
        quantity: 1000,
        availableQuantity: 850,
        qualityGrade: 'A',
        inspectionDate: '2025-01-15',
        expiryDate: '2025-12-31',
        wholesalePrice: 45.00,
        farmer: {
          name: 'Green Valley Farm',
          location: 'Stellenbosch',
          certified: true
        },
        certifications: ['Organic', 'GMP', 'HACCP'],
        marketplaceEligible: true
      },
      {
        id: 'batch2',
        batchCode: 'BATCH-002',
        productName: 'Moringa Tea Bags',
        quantity: 500,
        availableQuantity: 320,
        qualityGrade: 'A',
        inspectionDate: '2025-01-10',
        expiryDate: '2025-10-31',
        wholesalePrice: 22.00,
        farmer: {
          name: 'Sunny Acres Farm',
          location: 'Pretoria',
          certified: true
        },
        certifications: ['Organic', 'Fair Trade'],
        marketplaceEligible: true
      }
    ];

    const mockProducts: Product[] = [
      {
        id: 'prod1',
        name: 'Premium Organic Moringa Powder - 250g',
        description: '100% organic moringa powder, rich in nutrients and antioxidants.',
        category: 'Powders',
        price: 89.99,
        wholesalePrice: 45.00,
        markup: 100,
        stockLevel: 85,
        minStockLevel: 20,
        batchCode: 'BATCH-001',
        qualityGrade: 'A',
        status: 'active',
        images: ['/images/moringa-powder.jpg'],
        tags: ['organic', 'premium', 'superfood'],
        shipping: {
          weight: 0.25,
          dimensions: { length: 10, width: 10, height: 15 },
          freeShippingThreshold: 200
        },
        seo: {
          title: 'Premium Organic Moringa Powder',
          description: 'High-quality organic moringa powder',
          keywords: ['moringa', 'organic', 'superfood', 'powder']
        },
        createdAt: '2025-01-01',
        updatedAt: '2025-01-18',
        soldCount: 342,
        viewCount: 1250,
        rating: 4.8,
        reviews: 127,
        revenue: 30778.58
      }
    ];

    setBatches(mockBatches);
    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const handleSelectBatch = (batch: Batch) => {
    setSelectedBatch(batch);
    setShowForm(true);
  };

  const handleSaveProduct = (productData: ProductFormData) => {
    const newProduct: Product = {
      id: `prod${Date.now()}`,
      name: productData.name,
      description: productData.description,
      category: productData.category,
      price: productData.price,
      wholesalePrice: productData.wholesalePrice,
      markup: productData.markup,
      stockLevel: productData.stockQuantity,
      minStockLevel: 20,
      batchCode: selectedBatch?.batchCode || '',
      qualityGrade: selectedBatch?.qualityGrade || 'B',
      status: 'draft',
      images: productData.images,
      tags: productData.tags,
      shipping: productData.shipping,
      seo: productData.seo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      soldCount: 0,
      viewCount: 0,
      rating: 0,
      reviews: 0,
      revenue: 0
    };

    setProducts(prev => [...prev, newProduct]);
    setShowForm(false);
    setSelectedBatch(null);
  };

  const handleEditProduct = (product: Product) => {
    // Navigate to edit page or open edit modal
    console.log('Edit product:', product);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleToggleStatus = (productId: string, status: 'active' | 'inactive') => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, status } : p
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
              <p className="text-sm text-gray-600">Manage your marketplace listings</p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          <ProductForm
            batch={selectedBatch}
            onSave={handleSaveProduct}
            onCancel={() => {
              setShowForm(false);
              setSelectedBatch(null);
            }}
          />
        ) : (
          <>
            {!showForm && !selectedBatch && (
              <BatchSelector
                batches={batches}
                onSelectBatch={handleSelectBatch}
              />
            )}
            
            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onToggleStatus={handleToggleStatus}
            />
          </>
        )}
      </main>
    </div>
  );
}
