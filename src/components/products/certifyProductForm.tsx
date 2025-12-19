// src/components/products/CertifyProductForm.tsx
'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NewProduct } from '@/types/product';
import { useProducts } from '@/contexts/productContext';
import { useUser } from '@/contexts/userContext';
import { CERTIFICATION_OPTIONS, PRODUCT_CATEGORIES, CATEGORY_COLORS } from '@/lib/constants';
import { ROLE_PERMISSIONS } from '@/types/user';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PhotoUpload } from '@/components/products/photoUpload';
import { SectionTitle, FormLabel, InfoText, Strong } from '@/components/ui/typography';
import { Sparkles, AlertCircle } from 'lucide-react';

// Utility function to render RoleIcon
const renderRoleIcon = (icon: string | React.ComponentType<{ className?: string }>) => {
  if (!icon) return null;
  if (typeof icon === 'string') {
    return <span className="inline-block mr-1">{icon}</span>;
  }
  const IconComponent = icon;
  return <IconComponent className="inline-block h-4 w-4 mr-1" />;
};

export function CertifyProductForm() {
  const router = useRouter();
  const { addProduct, businessMetrics } = useProducts();
  const { user } = useUser();
  const rolePermissions = ROLE_PERMISSIONS[user?.role as keyof typeof ROLE_PERMISSIONS];
  
  const [newProduct, setNewProduct] = useState<NewProduct>({
    productName: '',
    category: 'Fruit',
    location: '',
    harvestDate: '',
    certifications: [],
    batchSize: '',
    description: '',
  });

  const [photos, setPhotos] = useState<string[]>([]);

  const toggleCertification = (cert: string) => {
    setNewProduct((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }));
  };

  const handleSubmit = () => {
    // Check role permissions
    if (!rolePermissions.canCreate) {
      alert(`${rolePermissions.displayName} role cannot create products. Only farmers can certify products.`);
      return;
    }

    if (!newProduct.productName || !newProduct.location || !newProduct.harvestDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Add product with photos
    addProduct({ ...newProduct, photos } as NewProduct & { photos: string[] });
    
    // Reset form
    setNewProduct({
      productName: '',
      category: 'Fruit',
      location: '',
      harvestDate: '',
      certifications: [],
      batchSize: '',
      description: '',
    });
    setPhotos([]);
    
    router.push('/blockchain');
  };

  // Show permission warning if not farmer
  if (!rolePermissions.canCreate) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card variant="outline" className="bg-amber-50 border-amber-200">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-8 w-8 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">
                Permission Required
              </h3>
              <p className="text-amber-800 mb-4">
                You are currently logged in as <strong>{renderRoleIcon(rolePermissions.icon)} {rolePermissions.displayName}</strong>.
                Only <strong>👨‍🌾 Farmers</strong> can certify new products.
              </p>
              <p className="text-sm text-amber-700">
                Switch to Farmer role in the top navigation to certify products.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="h-8 w-8 text-green-600" />
        <SectionTitle>Certify New Product</SectionTitle>
      </div>
      
      <Card variant="outline" className="shadow-xl">
        <div className="space-y-6">
          {/* Role Badge */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Certifying as:</strong> {renderRoleIcon(rolePermissions.icon)} {rolePermissions.displayName}
            </p>
          </div>

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
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className="text-3xl mb-1">
                      {React.createElement(colors.icon, { className: "h-8 w-8" })}
                    </div>
                    <div className="text-sm font-medium">{category}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Name */}
          <FormLabel>Product Name *</FormLabel>
          <Input
            type="text"
            value={newProduct.productName}
            onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
            placeholder="e.g., Organic Apples"
          />

          {/* Location & Date Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormLabel>Location *</FormLabel>
            <Input
              type="text"
              value={newProduct.location}
              onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
              placeholder="e.g., Stellenbosch, Western Cape"
            />

            <FormLabel>Harvest/Production Date *</FormLabel>
            <Input
              type="date"
              value={newProduct.harvestDate}
              onChange={(e) => setNewProduct({ ...newProduct, harvestDate: e.target.value })}
            />
          </div>

          {/* Batch Size */}
          <FormLabel>Batch Size</FormLabel>
          <Input
            type="text"
            value={newProduct.batchSize}
            onChange={(e) => setNewProduct({ ...newProduct, batchSize: e.target.value })}
            placeholder="e.g., 500kg, 1200 units"
          />

          {/* Photo Upload */}
          <PhotoUpload photos={photos} onPhotosChange={setPhotos} maxPhotos={5} />

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
            <FormLabel htmlFor="description">Description</FormLabel>
            <textarea
              id="description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[100px]"
              placeholder="Additional product details, farming practices, or special notes..."
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
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" 
            size="lg"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Certify Product on Blockchain
          </Button>
        </div>
      </Card>
    </div>
  );
}