// src/app/register/retailer/page.tsx
'use client';

import { Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DocumentUpload, type DocumentType } from '@/components/ui/document-upload';
import { useRegistration } from '@/src/features/registration/hooks/useRegistration';

export default function RetailerRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'South Africa',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const requiredDocuments: { value: DocumentType; label: string }[] = [
    { value: 'registration', label: 'Company Registration (CIPC)' },
    { value: 'address', label: 'Proof of Business Address' },
    { value: 'tax', label: 'Tax Clearance Certificate' },
    { value: 'id', label: 'Director\'s ID' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const { register, isLoading, error, isRegistered, checkEmailAvailability } = useRegistration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Check email availability
    const isEmailAvailable = await checkEmailAvailability(formData.email);
    if (!isEmailAvailable) {
      alert('Email is already registered');
      return;
    }

    // Prepare registration data
    const registrationData = {
      email: formData.email,
      password: formData.password,
      name: formData.companyName,
      role: 'retailer' as const,
      additionalData: {
        userType: 'retailer',
        companyName: formData.companyName,
        registrationNumber: formData.registrationNumber,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        registrationType: 'retailer',
        plan: 'professional',
      },
    };

    const success = await register(registrationData);
    if (success) {
      router.push(`/verification-pending?email=${encodeURIComponent(formData.email)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Retailer Registration</h1>
          <p className="mt-2 text-muted-foreground">
            Complete your registration to start certifying products
          </p>
        </div>

        <Card className="p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {isRegistered && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-sm text-green-800">Registration successful! Please check your email for verification.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Business Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="companyName">
                      Company Name *
                    </label>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="registrationNumber">
                      Registration Number *
                    </label>
                    <input
                      id="registrationNumber"
                      name="registrationNumber"
                      type="text"
                      required
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="email">
                      Business Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="phone">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium" htmlFor="address">
                      Business Address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={2}
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="city">
                      City *
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="postalCode">
                      Postal Code *
                    </label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" onClick={() => setStep(2)}>
                    Next: Account Security
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Required Documents</h2>
                  <p className="text-sm text-muted-foreground">
                    Please upload the following documents to complete your registration.
                  </p>
                </div>

                <DocumentUpload
                  acceptedTypes={requiredDocuments.map(doc => doc.value)}
                  onUpload={(docs) => console.log('Uploaded docs:', docs)}
                />

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button type="button" onClick={() => setStep(3)}>
                    Next: Account Security
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Account Security</h2>
                  <p className="text-sm text-muted-foreground">
                    Create a secure password for your account.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="password">
                      Password *
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="confirmPassword">
                      Confirm Password *
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      required
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the Terms of Service and Privacy Policy *
                    </span>
                  </label>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
