// src/app/retailer-verification/page.tsx
'use client';

import { Card } from '@/components/ui/card';
import { DocumentUpload, type DocumentType } from '@/components/ui/document-upload';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function RetailerVerificationPage() {
  const router = useRouter();

  const retailerDocuments: { value: DocumentType; label: string; required?: boolean }[] = [
    { value: 'registration', label: 'Company Registration (CIPC)', required: true },
    { value: 'address', label: 'Proof of Business Address', required: true },
    { value: 'tax', label: 'Tax Clearance Certificate', required: true },
    { value: 'id', label: 'Director\'s ID', required: true },
    { value: 'bank', label: 'Bank Confirmation Letter', required: false },
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
          <h1 className="text-3xl font-bold tracking-tight">Retailer Verification</h1>
          <p className="mt-2 text-muted-foreground">
            Please upload the required documents to verify your retail business
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Business Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="companyName">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="registrationNumber">
                    Registration Number
                  </label>
                  <input
                    id="registrationNumber"
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" htmlFor="businessAddress">
                    Business Address
                  </label>
                  <textarea
                    id="businessAddress"
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Document Upload</h2>
              <DocumentUpload 
                documentTypes={retailerDocuments}
                onUpload={(docs) => console.log('Uploaded docs:', docs)}
              />
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Back
                </Button>
                <Button type="submit" variant="primary">
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
