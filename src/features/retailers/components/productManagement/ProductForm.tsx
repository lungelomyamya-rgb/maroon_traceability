// src/components/retailers/productManagement/ProductForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Package, DollarSign, Ruler } from 'lucide-react';
import { Product, NewProduct } from './hooks/useProductManagement';

interface ProductFormProps {
  product?: Product;
  categories: { value: string; label: string }[];
  qualityGrades: { value: string; label: string; description: string }[];
  onSubmit: (productData: NewProduct) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({ 
  product, 
  categories, 
  qualityGrades, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: ProductFormProps) {
  const [formData, setFormData] = useState<NewProduct>({
    name: '',
    category: 'vegetables',
    price: 0,
    wholesalePrice: 0,
    stockLevel: 0,
    minStockLevel: 10,
    batchCode: '',
    qualityGrade: 'A',
    description: '',
    tags: [],
    supplier: '',
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      weight: 0
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        wholesalePrice: product.wholesalePrice,
        stockLevel: product.stockLevel,
        minStockLevel: product.minStockLevel,
        batchCode: product.batchCode,
        qualityGrade: product.qualityGrade,
        description: product.description,
        tags: product.tags,
        supplier: product.supplier || '',
        dimensions: product.dimensions || {
          length: 0,
          width: 0,
          height: 0,
          weight: 0
        }
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.wholesalePrice <= 0) {
      newErrors.wholesalePrice = 'Wholesale price must be greater than 0';
    }
    if (formData.stockLevel < 0) {
      newErrors.stockLevel = 'Stock level cannot be negative';
    }
    if (formData.minStockLevel < 0) {
      newErrors.minStockLevel = 'Minimum stock level cannot be negative';
    }
    if (!formData.batchCode.trim()) {
      newErrors.batchCode = 'Batch code is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof NewProduct, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDimensionChange = (field: keyof NonNullable<NewProduct['dimensions']>, value: number) => {
    setFormData(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions!, [field]: value }
    }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Basic Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Organic Tomatoes"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500 mt-1">{errors.category}</p>
              )}
            </div>
            <div>
              <Label htmlFor="batchCode">Batch Code</Label>
              <Input
                id="batchCode"
                value={formData.batchCode}
                onChange={(e) => handleInputChange('batchCode', e.target.value)}
                placeholder="e.g., BATCH-2024-001"
                className={errors.batchCode ? 'border-red-500' : ''}
              />
              {errors.batchCode && (
                <p className="text-sm text-red-500 mt-1">{errors.batchCode}</p>
              )}
            </div>
            <div>
              <Label htmlFor="supplier">Supplier (Optional)</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                placeholder="e.g., Green Farms Co."
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Pricing</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Retail Price (ZAR)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                placeholder="45.99"
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <Label htmlFor="wholesalePrice">Wholesale Price (ZAR)</Label>
              <Input
                id="wholesalePrice"
                type="number"
                step="0.01"
                value={formData.wholesalePrice}
                onChange={(e) => handleInputChange('wholesalePrice', parseFloat(e.target.value))}
                placeholder="35.99"
                className={errors.wholesalePrice ? 'border-red-500' : ''}
              />
              {errors.wholesalePrice && (
                <p className="text-sm text-red-500 mt-1">{errors.wholesalePrice}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stock Management */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Stock Management</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stockLevel">Current Stock Level</Label>
              <Input
                id="stockLevel"
                type="number"
                value={formData.stockLevel}
                onChange={(e) => handleInputChange('stockLevel', parseInt(e.target.value))}
                placeholder="150"
                className={errors.stockLevel ? 'border-red-500' : ''}
              />
              {errors.stockLevel && (
                <p className="text-sm text-red-500 mt-1">{errors.stockLevel}</p>
              )}
            </div>
            <div>
              <Label htmlFor="minStockLevel">Minimum Stock Level</Label>
              <Input
                id="minStockLevel"
                type="number"
                value={formData.minStockLevel}
                onChange={(e) => handleInputChange('minStockLevel', parseInt(e.target.value))}
                placeholder="50"
                className={errors.minStockLevel ? 'border-red-500' : ''}
              />
              {errors.minStockLevel && (
                <p className="text-sm text-red-500 mt-1">{errors.minStockLevel}</p>
              )}
            </div>
          </div>
        </div>

        {/* Quality and Description */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Quality & Description</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="qualityGrade">Quality Grade</Label>
              <Select value={formData.qualityGrade} onValueChange={(value) => handleInputChange('qualityGrade', value as 'A' | 'B' | 'C')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {qualityGrades.map(grade => (
                    <SelectItem key={grade.value} value={grade.value}>
                      <div>
                        <div className="font-medium">{grade.label}</div>
                        <div className="text-sm text-gray-500">{grade.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="organic, fresh, local"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the product, its features, and benefits..."
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Dimensions */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Dimensions (cm/kg)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="length">Length (cm)</Label>
              <Input
                id="length"
                type="number"
                value={formData.dimensions?.length || 0}
                onChange={(e) => handleDimensionChange('length', parseFloat(e.target.value))}
                placeholder="10"
              />
            </div>
            <div>
              <Label htmlFor="width">Width (cm)</Label>
              <Input
                id="width"
                type="number"
                value={formData.dimensions?.width || 0}
                onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value))}
                placeholder="8"
              />
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.dimensions?.height || 0}
                onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value))}
                placeholder="6"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.dimensions?.weight || 0}
                onChange={(e) => handleDimensionChange('weight', parseFloat(e.target.value))}
                placeholder="2.5"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
          </Button>
        </div>
      </form>
    </Card>
  );
}
