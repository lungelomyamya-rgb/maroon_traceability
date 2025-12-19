// src/app/farmer/certify/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, X, File as FileIcon } from 'lucide-react';
import { DocumentVerification } from '@/components/products/document-verification';
import { type DocumentType } from '@/components/ui/document-upload';
import { format } from 'date-fns';
import { productCategories, type ProductCategory } from '@/lib/productCategories';
import { productCertificationDocs } from '@/lib/documentTypes';

// Create simple inline components to replace the missing shadcn ones
const Popover = ({ children, open, onOpenChange }: { 
  children: React.ReactNode; 
  open: boolean; 
  onOpenChange: (open: boolean) => void 
}) => {
  return (
    <div className="relative">
      {children}
    </div>
  );
};

const PopoverTrigger = ({ 
  children, 
  asChild = false 
}: { 
  children: React.ReactNode;
  asChild?: boolean;
}) => {
  return <div className="inline-block">{children}</div>;
};

const PopoverContent = ({ 
  children, 
  className = '',
  align = 'start' 
}: { 
  children: React.ReactNode; 
  className?: string;
  align?: 'start' | 'center' | 'end';
}) => {
  return (
    <div className={`absolute z-50 w-auto p-4 bg-white border rounded-md shadow-md ${className}`}>
      {children}
    </div>
  );
};


interface UploadedFile extends File {
  preview: string;
  type: string;
  size: number;
}

export default function CertifyProductPage() {
  const router = useRouter();
  const { user } = useUser();
const userRole = user?.role;
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    batchNumber: '',
    productionDate: new Date(),
    quantity: '',
    unit: 'kg',
    description: '',
  });
  const [documentsVerified, setDocumentsVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Redirect if not a farmer
  if (userRole !== 'farmer') {
    router.push('/unauthorized');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (files: File[]) => {
    const newFiles = files.map(file => ({
      ...file,
      preview: URL.createObjectURL(file)
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentsVerified) {
      alert('Please upload and verify all required documents');
      return;
    }
    
    if (!formData.category) {
      alert('Please select a product category');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // TODO: Implement form submission logic with file uploads
      console.log('Form submitted:', {
        ...formData,
        files: uploadedFiles.map(f => ({
          name: f.name,
          type: f.type,
          size: f.size
        }))
      });
      // Redirect to success page or show success message
      router.push('/farmer/dashboard?certified=success');
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Certify New Product</h1>
          <p className="mt-2 text-muted-foreground">
            Complete the form and upload required documents to certify your product
          </p>
        </div>

        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Product Name */}
              <div>
                <Label htmlFor="productName">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              {/* Category Selector */}
              <div>
                <Label>
                  Product Category <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="flex h-9 w-full appearance-none rounded-md border border-gray-300 bg-white pl-2.5 pr-7 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select a category</option>
                    {productCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground">
                      <path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.2663 6.09731 10.3806 6.04999 10.5 6.04999C10.6194 6.04999 10.7337 6.09731 10.8182 6.18181C10.9027 6.26632 10.95 6.38062 10.95 6.50001C10.95 6.6194 10.9027 6.7337 10.8182 6.81821L7.81819 9.81821C7.73368 9.90272 7.61938 9.95004 7.49999 9.95004C7.3806 9.95004 7.2663 9.90272 7.18179 9.81821L4.18179 6.81821C4.09728 6.7337 4.04996 6.6194 4.04996 6.50001C4.04996 6.38062 4.09728 6.26632 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Batch Number */}
              <div>
                <Label htmlFor="batchNumber">
                  Batch Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="batchNumber"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({...formData, batchNumber: e.target.value})}
                  placeholder="Enter batch number"
                  required
                />
              </div>
              
              {/* Production Date with Calendar Picker */}
              <div className="space-y-1">
                <Label className="text-sm">
                  Production Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={format(formData.productionDate, 'PPP')}
                    readOnly
                    className="pr-10 cursor-pointer"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {showDatePicker && (
                    <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg">
                      <div className="p-2">
                        <input 
                          type="date"
                          className="block w-full p-2 border rounded"
                          value={formData.productionDate.toISOString().split('T')[0]}
                          onChange={(e) => {
                            if (e.target.valueAsDate) {
                              setFormData({...formData, productionDate: e.target.valueAsDate});
                              setShowDatePicker(false);
                            }
                          }}
                          onKeyDown={(e) => e.key === 'Escape' && setShowDatePicker(false)}
                          autoFocus
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Quantity */}
              <div className="space-y-1">
                <Label htmlFor="quantity" className="text-sm">
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  min="1"
                  placeholder="Enter quantity"
                  required
                />
              </div>
              
              {/* Unit Selector */}
              <div className="space-y-1">
                <Label htmlFor="unit" className="text-sm">
                  Unit <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="flex h-9 w-full appearance-none rounded-md border border-gray-300 bg-white pl-2.5 pr-7 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="lbs">Pounds (lbs)</option>
                    <option value="oz">Ounces (oz)</option>
                    <option value="units">Units</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground">
                      <path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.2663 6.09731 10.3806 6.04999 10.5 6.04999C10.6194 6.04999 10.7337 6.09731 10.8182 6.18181C10.9027 6.26632 10.95 6.38062 10.95 6.50001C10.95 6.6194 10.9027 6.7337 10.8182 6.81821L7.81819 9.81821C7.73368 9.90272 7.61938 9.95004 7.49999 9.95004C7.3806 9.95004 7.2663 9.90272 7.18179 9.81821L4.18179 6.81821C4.09728 6.7337 4.04996 6.6194 4.04996 6.50001C4.04996 6.38062 4.09728 6.26632 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <Label htmlFor="description">
                Product Description
              </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter product description (optional)"
              />
            </div>
            
            {/* Document Upload Section */}
            <div className="pt-4">
              <h2 className="text-lg font-medium text-foreground mb-4">Required Documents</h2>
              <DocumentVerification 
                onDocumentsVerified={setDocumentsVerified} 
                documentTypes={productCertificationDocs}
                required={true}
                onFilesUploaded={handleFileUpload}
              />
              
              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-foreground mb-2">Uploaded Documents</h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-muted rounded">
                            <FileIcon className="h-5 w-5" />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium truncate max-w-xs">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {Math.round(file.size / 1024)} KB · {file.type}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting || !documentsVerified}
                className="min-w-[120px] bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 font-medium"
              >
                {isSubmitting ? 'Certifying...' : 'Certify Product'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
