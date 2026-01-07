// src/components/inspector/thirdPartyVerification.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Upload,
  Eye,
  Download,
  Mail,
  Phone
} from 'lucide-react';
import type { 
  VerificationProvider, 
  ThirdPartyVerification, 
  VerificationDocument
} from '@/types/inspector';
import { VERIFICATION_PROVIDERS } from '@/types/inspector';

const thirdPartyVerificationSchema = z.object({
  provider: z.enum(['sgs', 'bureau-veritas', 'intertek']),
  referenceNumber: z.string().min(1, 'Reference number is required'),
  notes: z.string().optional()
});

type ThirdPartyVerificationFormData = z.infer<typeof thirdPartyVerificationSchema>;

interface ThirdPartyVerificationProps {
  inspectionId: string;
  onSubmit: (data: ThirdPartyVerificationFormData & { documents: VerificationDocument[] }) => Promise<void>;
  existingVerification?: ThirdPartyVerification;
}

export function ThirdPartyVerification({ 
  inspectionId, 
  onSubmit, 
  existingVerification 
}: ThirdPartyVerificationProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ThirdPartyVerificationFormData>({
    resolver: zodResolver(thirdPartyVerificationSchema),
    defaultValues: existingVerification ? {
      provider: existingVerification.provider as 'sgs' | 'bureau-veritas' | 'intertek',
      referenceNumber: existingVerification.referenceNumber,
      notes: existingVerification.notes
    } : {
      provider: 'sgs'
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<VerificationDocument[]>(
    existingVerification?.documents || []
  );
  const [selectedProvider, setSelectedProvider] = useState<'sgs' | 'bureau-veritas' | 'intertek'>(
    (existingVerification?.provider as 'sgs' | 'bureau-veritas' | 'intertek') || 'sgs'
  );

  const watchedProvider = watch('provider');
  const providerInfo = VERIFICATION_PROVIDERS[selectedProvider];

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newDoc: VerificationDocument = {
          id: `doc-${Date.now()}-${index}`,
          type: file.name.toLowerCase().includes('certificate') ? 'certificate' :
                file.name.toLowerCase().includes('report') ? 'report' :
                file.name.toLowerCase().includes('receipt') ? 'receipt' : 'photo',
          title: file.name,
          url: e.target?.result as string,
          uploadedAt: new Date().toISOString()
        };
        setDocuments(prev => [...prev, newDoc]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  const handleFormSubmit = async (data: ThirdPartyVerificationFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit({ ...data, documents });
    } catch (error) {
      console.error('Error submitting verification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDocumentIcon = (type: string) => {
    const icons = {
      certificate: '📜',
      report: '📊',
      receipt: '🧾',
      photo: '📷'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CheckCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Third-Party Verification</h3>
            <p className="text-sm text-gray-500">External verification from accredited laboratories</p>
          </div>
        </div>

        {/* Provider Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(VERIFICATION_PROVIDERS).map(([key, provider]) => (
            <div
              key={key}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedProvider === key 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                const provider = key as 'sgs' | 'bureau-veritas' | 'intertek';
                setSelectedProvider(provider);
                // Update form value
                const form = document.querySelector('form');
                const select = form?.querySelector('select[name="provider"]') as HTMLSelectElement;
                if (select) select.value = provider;
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">
                  {provider.name.split(' ').map(word => word[0]).join('')}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{provider.name}</h4>
                  <p className="text-xs text-gray-500">Accredited Laboratory</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Mail className="h-3 w-3" />
                  <span>{provider.email}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Phone className="h-3 w-3" />
                  <span>{provider.contact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Provider Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-2">{providerInfo.name}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Services:</p>
              <div className="flex flex-wrap gap-1">
                {providerInfo.services.map((service: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <a
                href={providerInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-3 w-3" />
                Visit Website
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Verification Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Provider
              </label>
              <select
                {...register('provider')}
                className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
              >
              {Object.entries(VERIFICATION_PROVIDERS).map(([key, provider]) => (
                <option key={key} value={key}>{provider.name}</option>
              ))}
              </select>
              {errors.provider && (
                <p className="text-red-500 text-xs mt-1">{errors.provider.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference Number
              </label>
              <Input
                {...register('referenceNumber')}
                placeholder="e.g., SGS-2024-001234"
              />
              {errors.referenceNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.referenceNumber.message}</p>
              )}
            </div>
          </div>

          {/* Document Upload */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Supporting Documents</h4>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload verification documents (certificates, reports, receipts)
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleDocumentUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
                >
                  Choose Files
                </label>
              </div>

              {documents.length > 0 && (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getDocumentIcon(doc.type)}</span>
                        <div>
                          <p className="font-medium text-gray-900">{doc.title}</p>
                          <p className="text-xs text-gray-500">{doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(doc.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <Textarea
              {...register('notes')}
              rows={4}
              placeholder="Enter any additional information about the verification..."
            />
          </div>

          {/* Existing Verification Status */}
          {existingVerification && (
            <div className="border-t pt-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Current Status</h4>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(existingVerification.status)}>
                  {existingVerification.status}
                </Badge>
                <div className="text-sm text-gray-600">
                  <p>Verified by: {existingVerification.verifiedBy}</p>
                  <p>Verified at: {new Date(existingVerification.verifiedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline">
              Save Draft
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Verification'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Provider Contact Information */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">{providerInfo.name}</h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{providerInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{providerInfo.contact}</span>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-gray-400" />
                <a
                  href={providerInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {providerInfo.website}
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Available Services</h5>
            <div className="space-y-1">
              {providerInfo.services.map((service: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
