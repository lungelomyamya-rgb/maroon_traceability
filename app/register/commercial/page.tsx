'use client';

import { ArrowLeft, Building2, FileText, Lock, Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRegistration } from '@/src/features/registration/hooks/useRegistration';

export default function CommercialRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    taxNumber: '',
    vatNumber: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    numberOfEmployees: '',
    annualRevenue: '',
    businessType: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      name: formData.contactPerson,
      role: 'farmer' as const,
      additionalData: {
        userType: 'commercial',
        companyName: formData.companyName,
        registrationNumber: formData.registrationNumber,
        taxNumber: formData.taxNumber,
        vatNumber: formData.vatNumber,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
        numberOfEmployees: formData.numberOfEmployees,
        annualRevenue: formData.annualRevenue,
        businessType: formData.businessType,
        registrationType: 'commercial',
        plan: 'professional',
      },
    };

    const success = await register(registrationData);
    if (success) {
      router.push(`/verification-pending?email=${encodeURIComponent(formData.email)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/get-started')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Plans
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Commercial Farmer Registration</h1>
            <p className="text-gray-600">Professional plan for commercial agricultural operations</p>
            <div className="mt-2 inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              Most Popular · R7,500/month
            </div>
          </div>
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
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Building2 className="mr-2 h-5 w-5 text-blue-600" />
                    Business Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Number *
                      </label>
                      <input
                        type="text"
                        name="registrationNumber"
                        required
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tax Number *
                      </label>
                      <input
                        type="text"
                        name="taxNumber"
                        required
                        value={formData.taxNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        VAT Number
                      </label>
                      <input
                        type="text"
                        name="vatNumber"
                        value={formData.vatNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        required
                        value={formData.contactPerson}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Employees *
                      </label>
                      <select
                        name="numberOfEmployees"
                        required
                        value={formData.numberOfEmployees}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Size</option>
                        <option value="1-10">1-10 Employees</option>
                        <option value="11-50">11-50 Employees</option>
                        <option value="51-100">51-100 Employees</option>
                        <option value="101-200">101-200 Employees</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setStep(2)}>
                    Next: Financial Details
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-600" />
                    Financial & Location Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Annual Revenue *
                      </label>
                      <select
                        name="annualRevenue"
                        required
                        value={formData.annualRevenue}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Range</option>
                        <option value="under-1m">Under R1 Million</option>
                        <option value="1m-5m">R1M - R5 Million</option>
                        <option value="5m-10m">R5M - R10 Million</option>
                        <option value="10m-50m">R10M - R50 Million</option>
                        <option value="over-50m">Over R50 Million</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Type *
                      </label>
                      <select
                        name="businessType"
                        required
                        value={formData.businessType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Type</option>
                        <option value="commercial-farm">Commercial Farm</option>
                        <option value="agri-business">Agri-Business</option>
                        <option value="food-processor">Food Processor</option>
                        <option value="livestock-operation">Livestock Operation</option>
                        <option value="mixed-operation">Mixed Operation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Address *
                      </label>
                      <textarea
                        name="address"
                        rows={2}
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City/Town *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Province *
                      </label>
                      <select
                        name="province"
                        required
                        value={formData.province}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Province</option>
                        <option value="eastern-cape">Eastern Cape</option>
                        <option value="free-state">Free State</option>
                        <option value="gauteng">Gauteng</option>
                        <option value="kwazulu-natal">KwaZulu-Natal</option>
                        <option value="limpopo">Limpopo</option>
                        <option value="mpumalanga">Mpumalanga</option>
                        <option value="northern-cape">Northern Cape</option>
                        <option value="north-west">North West</option>
                        <option value="western-cape">Western Cape</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setStep(3)}>
                    Next: Security
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Lock className="mr-2 h-5 w-5 text-blue-600" />
                    Account Security
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      'Go Pro Now'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Card>

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-green-600 text-2xl mb-2">200 Records/Month</div>
            <p className="text-sm text-gray-600">Scale your operations</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-blue-600 text-2xl mb-2">Up to 200 Users</div>
            <p className="text-sm text-gray-600">Large team support</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-purple-600 text-2xl mb-2">API Access</div>
            <p className="text-sm text-gray-600">Integrate with your systems</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
