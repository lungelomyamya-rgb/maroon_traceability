// src/components/inspector/thirdPartyVerification/VerificationForm.tsx
'use client';

import { X, ExternalLink, CheckCircle, Upload, Eye, Download, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { VerificationDocument } from '@/types/inspector';
import type { ThirdPartyVerificationComputed, ThirdPartyVerificationState } from './hooks/useThirdPartyVerification';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface VerificationFormProps {
  form: ThirdPartyVerificationComputed['form'];
  isSubmitting: ThirdPartyVerificationState['isSubmitting'];
  documents: VerificationDocument[];
  verificationProviders: any[];
  providerInfo: ThirdPartyVerificationComputed['providerInfo'];
  selectedProvider: ThirdPartyVerificationState['selectedProvider'];
  onDocumentUpload: (files: FileList) => void;
  removeDocument: (docId: string) => void;
  setSelectedProvider: (provider: string) => void;
  onFormSubmit: (data: any) => void;
  onClose: () => void;
}

export function VerificationForm({
  form,
  isSubmitting,
  documents,
  verificationProviders,
  providerInfo,
  selectedProvider,
  onDocumentUpload,
  removeDocument,
  setSelectedProvider,
  onFormSubmit,
  onClose,
}: VerificationFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = form;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const watchedProvider = watch('provider');

  const getDocumentIcon = (type: string) => {
    switch (type) {
    case 'certificate':
      return <CheckCircle className="h-4 w-4" />;
    case 'report':
      return <FileText className="h-4 w-4" />;
    case 'photo':
      return <Eye className="h-4 w-4" />;
    case 'receipt':
      return <Download className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
    }
  };

  const getDocumentColor = (type: string) => {
    switch (type) {
    case 'certificate':
      return 'bg-green-100 text-green-800';
    case 'report':
      return 'bg-blue-100 text-blue-800';
    case 'photo':
      return 'bg-purple-100 text-purple-800';
    case 'receipt':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Third-Party Verification</h3>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Provider Selection */}
          <Card className="p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-4">Select Verification Provider</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {verificationProviders.map((provider) => (
                <div
                  key={provider.name}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedProvider === provider.name.toLowerCase().replace(' ', '-')
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    const providerKey = provider.name.toLowerCase().replace(' ', '-');
                    setSelectedProvider(providerKey);
                    form.setValue('provider', providerKey as 'sgs' | 'bureau-veritas' | 'intertek');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      const providerKey = provider.name.toLowerCase().replace(' ', '-');
                      setSelectedProvider(providerKey);
                      form.setValue('provider', providerKey as 'sgs' | 'bureau-veritas' | 'intertek');
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">
                      {provider.name.split(' ').map((word: string) => word[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{provider.name}</h4>
                      <p className="text-xs text-gray-500">Accredited Laboratory</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <ExternalLink className="h-3 w-3" />
                      <span>{provider.contact}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <span>{provider.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Selected Provider Details */}
          <Card className="p-4 mb-6 bg-gray-50">
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
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  {providerInfo.website}
                </a>
              </div>
            </div>
          </Card>

          {/* Verification Form */}
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference Number *
                </label>
                <Input
                  {...register('referenceNumber', { required: 'Reference number is required' })}
                  placeholder="e.g., VER-2024-001234"
                  disabled={isSubmitting}
                />
                {errors.referenceNumber && (
                  <p className="text-sm text-red-600">{errors.referenceNumber.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider
                </label>
                <select
                  {...register('provider')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  <option value="sgs">SGS South Africa</option>
                  <option value="bureau-veritas">Bureau Veritas</option>
                  <option value="intertek">Intertek</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <Textarea
                {...register('notes')}
                placeholder="Additional notes about this verification"
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            {/* Document Upload */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Verification Documents</h4>
                <Badge variant="outline" className="text-xs">
                  {documents.length} uploaded
                </Badge>
              </div>

              <div className="mb-4">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => e.target.files && onDocumentUpload(e.target.files)}
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload documents (PDF, JPG, PNG, DOC, DOCX)
                  </span>
                </label>
              </div>

              {documents.length > 0 && (
                <div className="space-y-2">
                  {documents.map((doc: VerificationDocument) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${getDocumentColor(doc.type)}`}>
                          {getDocumentIcon(doc.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{doc.title}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(doc.url, '_blank')}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeDocument(doc.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Submit Verification
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
