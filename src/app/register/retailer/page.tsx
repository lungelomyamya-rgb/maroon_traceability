// src/app/register/retailer/page.tsx
'use client';

import { Check, AlertCircle, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DocumentUpload, type DocumentType } from '@/components/ui/document-upload';
import { useUser } from '@/src/contexts/userContext';
import { RegistrationValidation, getFieldClassName, getCheckboxClassName } from '@/lib/validation/registrationValidation';

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
    role: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    
    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const { register, loading, user } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Step validation functions
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validate business information fields
    if (!formData.companyName?.trim()) errors.companyName = 'Company name is required';
    
    const regError = RegistrationValidation.validateRegistrationNumber(formData.registrationNumber);
    if (regError) errors.registrationNumber = regError;
    
    const emailError = RegistrationValidation.validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const phoneError = RegistrationValidation.validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
    
    if (!formData.role) errors.role = 'Please select a role';

    // Validate location fields that are in Step 1
    if (!formData.address?.trim()) errors.address = 'Address is required';
    if (!formData.city?.trim()) errors.city = 'City is required';
    if (!formData.country || formData.country === '') errors.country = 'Country is required';
    
    const postalError = RegistrationValidation.validatePostalCode(formData.postalCode);
    if (postalError) errors.postalCode = postalError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Step 2 only contains document upload which is optional for now
    // Users can proceed without uploading documents in this demo
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setError(null);
    setFieldErrors({});

    // Validate final step (password and terms)
    const errors: Record<string, string> = {};
    
    const passwordError = RegistrationValidation.validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    if (!formData.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms and conditions';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors below and try again.');
      return;
    }

    // Prepare registration data
    const registrationData = {
      email: formData.email,
      password: formData.password,
      name: formData.companyName,
      role: formData.role as any,
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
      setIsRegistered(true);
      // Redirect to role-based dashboard instead of verification
      const roleDashboardMap: Record<string, string> = {
        farmer: '/farmer',
        inspector: '/inspector',
        logistics: '/logistics',
        packaging: '/packaging',
        retailer: '/retailer',
        public: '/public',
      };
      
      const dashboardPath = roleDashboardMap[formData.role] || '/retailer';
      router.push(dashboardPath);
    } else {
      setError('Registration failed. Please try again.');
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
                      className={getFieldClassName(!!fieldErrors.companyName)}
                    />
                    {fieldErrors.companyName && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.companyName}</p>
                    )}
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
                      className={getFieldClassName(!!fieldErrors.registrationNumber)}
                    />
                    {fieldErrors.registrationNumber && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.registrationNumber}</p>
                    )}
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
                      className={getFieldClassName(!!fieldErrors.email)}
                    />
                    {fieldErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                    )}
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
                      className={getFieldClassName(!!fieldErrors.phone)}
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="role">
                      Select Role *
                    </label>
                    <select
                      id="role"
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleChange}
                      className={getFieldClassName(!!fieldErrors.role)}
                    >
                      <option value="">Select your role</option>
                      <option value="farmer">Farmer</option>
                      <option value="inspector">Inspector</option>
                      <option value="logistics">Logistics Provider</option>
                      <option value="packaging">Packaging Provider</option>
                      <option value="retailer">Retailer</option>
                      <option value="public">Public User</option>
                    </select>
                    {fieldErrors.role && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.role}</p>
                    )}
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
                      className={getFieldClassName(!!fieldErrors.address)}
                    />
                    {fieldErrors.address && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.address}</p>
                    )}
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
                      className={getFieldClassName(!!fieldErrors.city)}
                    />
                    {fieldErrors.city && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.city}</p>
                    )}
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
                      className={getFieldClassName(!!fieldErrors.postalCode)}
                    />
                    {fieldErrors.postalCode && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.postalCode}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    onClick={() => {
                      if (validateStep1()) {
                        setStep(2);
                      }
                    }}
                  >
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
                  <Button 
                    type="button" 
                    onClick={() => {
                      if (validateStep2()) {
                        setStep(3);
                      }
                    }}
                  >
                    Next: Account Security
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Lock className="mr-2 h-5 w-5 text-blue-600" />
                    Account Security
                  </h2>

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
                      className={getFieldClassName(!!fieldErrors.password)}
                    />
                    {fieldErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      <p>Password must contain:</p>
                      <ul className="mt-1 space-y-1">
                        <li className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                          ✓ At least 8 characters
                        </li>
                        <li className={/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                          ✓ One lowercase letter
                        </li>
                        <li className={/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                          ✓ One uppercase letter
                        </li>
                        <li className={/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                          ✓ One number
                        </li>
                      </ul>
                    </div>
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
                      className={getFieldClassName(!!fieldErrors.confirmPassword)}
                    />
                    {fieldErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                    )}
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
                      className={getCheckboxClassName(!!fieldErrors.agreeToTerms)}
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the Terms of Service and Privacy Policy *
                    </span>
                  </label>
                  {fieldErrors.agreeToTerms && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.agreeToTerms}</p>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
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
