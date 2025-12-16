// src/components/products/CertifyProductForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NewProduct, ProductCategory } from '@/types/product';
import { useProducts } from '@/contexts/productContext';
import { CERTIFICATION_OPTIONS, PRODUCT_CATEGORIES, CATEGORY_COLORS, getCategoryIcon } from '@/lib/constants';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SectionTitle, FormLabel, InfoText, Strong } from '@/components/ui/typography';
import { Sparkles } from 'lucide-react';

export function CertifyProductForm() {
  const router = useRouter();
  const { addProduct, businessMetrics } = useProducts();
  
  const [newProduct, setNewProduct] = useState<NewProduct>({
    productName: '',
    category: 'Fruit',
    location: '',
    harvestDate: '',
    certifications: [],
    batchSize: '',
    description: '',
  });

  const toggleCertification = (cert: string) => {
    setNewProduct((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }));
  };

  const handleSubmit = () => {
    if (!newProduct.productName || !newProduct.location || !newProduct.harvestDate) {
      alert('Please fill in all required fields');
      return;
    }

    addProduct(newProduct);
    
    setNewProduct({
      productName: '',
      category: 'Fruit',
      location: '',
      harvestDate: '',
      certifications: [],
      batchSize: '',
      description: '',
    });
    
    router.push('/blockchain');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="h-8 w-8 text-primary" />
        <SectionTitle>Certify New Product</SectionTitle>
      </div>
      
      <Card variant="bordered" className="shadow-xl">
        <div className="space-y-6">
          {/* Product Category Selection */}
          <div>
            <FormLabel>Product Category *</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {PRODUCT_CATEGORIES.map((category) => {
                const isSelected = newProduct.category === category;
                const colors = CATEGORY_COLORS[category];
                
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setNewProduct({ ...newProduct, category })}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-200
                      ${isSelected 
                        ? `${colors.bg} ${colors.text} border-current shadow-md scale-105` 
                        : 'bg-background border-border hover:border-primary/50 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className="text-3xl mb-1">
                      {(() => {
                        const Icon = getCategoryIcon(category);
                        return <Icon className={`h-8 w-8 ${colors.text}`} />;
                      })()}
                    </div>
                    <div className="text-sm font-medium">{category}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Name */}
          <div>
            <FormLabel>Product Name *</FormLabel>
            <Input
              value={newProduct.productName}
              onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
              placeholder="Enter product name"
              className="mt-1 bg-background"
            />
          </div>

          {/* Location & Date Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormLabel>Location *</FormLabel>
              <Input
                value={newProduct.location}
                onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                placeholder="e.g., California, USA"
                className="mt-1 bg-background"
              />
            </div>

            <div>
              <FormLabel>Harvest Date *</FormLabel>
              <Input
                type="date"
                value={newProduct.harvestDate}
                onChange={(e) => setNewProduct({ ...newProduct, harvestDate: e.target.value })}
                className="mt-1 bg-background"
              />
            </div>
          </div>

          {/* Batch Size */}
          <div>
            <FormLabel>Batch Size (optional)</FormLabel>
            <Input
              value={newProduct.batchSize}
              onChange={(e) => setNewProduct({ ...newProduct, batchSize: e.target.value })}
              placeholder="e.g., 100 kg, 50 units"
              className="mt-1 bg-background"
            />
          </div>

          {/* Certifications */}
          <div>
            <FormLabel>Certifications</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {CERTIFICATION_OPTIONS.map((cert) => (
                <label key={cert} className="flex items-center cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={newProduct.certifications.includes(cert)}
                    onChange={() => toggleCertification(cert)}
                    className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <InfoText className="m-0">{cert}</InfoText>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <FormLabel>Additional Notes (optional)</FormLabel>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder="Any additional information about this product..."
              className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:outline-none transition-all"
              rows={3}
            />
          </div>

          {/* Transaction Fee Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <InfoText className="text-blue-800">
              <Strong>Transaction Fee:</Strong> R{businessMetrics.averageFee} (automatically calculated)
            </InfoText>
            <InfoText className="text-xs text-blue-600 mt-1">
              This covers blockchain gas costs and platform maintenance
            </InfoText>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            variant="primary" 
            className="w-full py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Certify Product on Blockchain
          </Button>
        </div>
      </Card>
    </div>
  );
}