// src/app/farmer-verification/page.tsx
'use client';

import { Card } from '@/components/ui/card';
import { DocumentUpload } from '@/components/ui/document-upload';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DocumentType } from '@/components/ui/document-upload';

export default function FarmerVerificationPage() {
  const router = useRouter();

  const farmerDocuments: { value: DocumentType; label: string; required: boolean }[] = [
    { value: 'id', label: 'ID Document', required: true },
    { value: 'address', label: 'Proof of Address', required: true },
    { value: 'farm', label: 'Farm Registration', required: true },
    { value: 'vet', label: 'Veterinary Certificates', required: true },
    { value: 'permit', label: 'Water/Environmental Permits', required: false },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    router.push('/verification-pending');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Farmer Verification</h1>
          <p className="mt-2 text-muted-foreground">
            Please upload the required documents to verify your farming operation
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="idNumber">
                    ID Number
                  </label>
                  <input
                    id="idNumber"
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" htmlFor="farmName">
                    Farm Name
                  </label>
                  <input
                    id="farmName"
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" htmlFor="farmAddress">
                    Farm Address
                  </label>
                  <textarea
                    id="farmAddress"
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Farm Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="farmSize">
                    Farm Size (hectares)
                  </label>
                  <input
                    id="farmSize"
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="mainCrop">
                    Main Crop/Product
                  </label>
                  <input
                    id="mainCrop"
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Document Upload</h2>
              <DocumentUpload 
                documentTypes={farmerDocuments}
                onUpload={(docs) => console.log('Uploaded docs:', docs)}
              />
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Back
                </Button>
                <Button type="submit" variant="default">
                  Submit for Verification
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
