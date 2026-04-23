'use client';

import { ArrowLeft, User, MapPin, Lock, Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser } from '@/src/contexts/userContext';
import { RegistrationValidation, getFieldClassName, getCheckboxClassName } from '@/lib/validation/registrationValidation';

export default function IndividualRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    farmSize: '',
    livestockType: '',
    role: '',
    agreeToTerms: false,
  });

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

  const validateForm = (): boolean => {
    const errors = RegistrationValidation.validateIndividualForm(formData);
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step validation functions
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validate personal information fields
    if (!formData.firstName?.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) errors.lastName = 'Last name is required';
    
    const emailError = RegistrationValidation.validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const phoneError = RegistrationValidation.validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
    
    if (!formData.role) errors.role = 'Please select a role';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validate farm information fields
    if (!formData.address?.trim()) errors.address = 'Address is required';
    if (!formData.city?.trim()) errors.city = 'City is required';
    if (!formData.province || formData.province === '') errors.province = 'Please select a province';
    
    const postalError = RegistrationValidation.validatePostalCode(formData.postalCode);
    if (postalError) errors.postalCode = postalError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validate security fields
    const passwordError = RegistrationValidation.validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    if (!formData.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms and conditions';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setError(null);
    setFieldErrors({});

    // Validate final step
    if (!validateStep3()) {
      setError('Please fix the errors below and try again.');
      return;
    }

    // Prepare registration data
    const registrationData = {
      email: formData.email,
      password: formData.password,
      name: `${formData.firstName} ${formData.lastName}`,
      role: formData.role as any,
      additionalData: {
        userType: 'individual',
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
        farmSize: formData.farmSize,
        livestockType: formData.livestockType,
        registrationType: 'individual',
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
      
      const dashboardPath = roleDashboardMap[formData.role] || '/farmer';
      router.push(dashboardPath);
    } else {
      setError('Registration failed. Please try again.');
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
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Individual Farmer Registration</h1>
            <p className="text-gray-600">Start your digital traceability journey - Free forever</p>
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
                    <User className="mr-2 h-5 w-5 text-blue-600" />
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className={getFieldClassName(!!fieldErrors.firstName)}
                      />
                      {fieldErrors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className={getFieldClassName(!!fieldErrors.lastName)}
                      />
                      {fieldErrors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.lastName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={getFieldClassName(!!fieldErrors.email)}
                      />
                      {fieldErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className={getFieldClassName(!!fieldErrors.phone)}
                      />
                      {fieldErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Role *
                      </label>
                      <select
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
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="button" 
                   onClick={() => {
                      if (validateStep1()) {
                        setStep(2);
                      }
                    }}
                  >
                    Next: Farm Details
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                    Farm Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Farm Address *
                      </label>
                      <textarea
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
                        className={getFieldClassName(!!fieldErrors.city)}
                      />
                      {fieldErrors.city && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.city}</p>
                      )}
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
                        className={getFieldClassName(!!fieldErrors.province)}
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
                      {fieldErrors.province && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.province}</p>
                      )}
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
                        className={getFieldClassName(!!fieldErrors.postalCode)}
                      />
                      {fieldErrors.postalCode && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.postalCode}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Farm Size (hectares)
                      </label>
                      <input
                        type="text"
                        name="farmSize"
                        value={formData.farmSize}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Livestock
                      </label>
                      <select
                        name="livestockType"
                        value={formData.livestockType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Type</option>
                        <option value="cattle">Cattle</option>
                        <option value="sheep">Sheep</option>
                        <option value="goats">Goats</option>
                        <option value="pigs">Pigs</option>
                        <option value="poultry">Poultry</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
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
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
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

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-green-600 text-2xl mb-2">Free Forever</div>
            <p className="text-sm text-gray-600">No monthly fees for individual farmers</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-blue-600 text-2xl mb-2">5 Records/Month</div>
            <p className="text-sm text-gray-600">Perfect for small-scale operations</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-purple-600 text-2xl mb-2">Basic Traceability</div>
            <p className="text-sm text-gray-600">Essential features for livestock protection</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
