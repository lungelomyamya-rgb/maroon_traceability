'use client';

import { ArrowLeft, Building2, FileText, Lock, Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser } from '@/src/contexts/userContext';
import { RegistrationValidation, getFieldClassName, getCheckboxClassName } from '@/lib/validation/registrationValidation';

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
    role: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    console.log(`Field changed: ${name} = ${newValue}, step: ${step}`);
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
    
    // Real-time validation for the current step
    setTimeout(() => {
      console.log(`Checking validation for field: ${name}, step: ${step}`);
      if (step === 1 && ['companyName', 'registrationNumber', 'taxNumber', 'vatNumber', 'contactPerson', 'email', 'phone', 'role'].includes(name)) {
        console.log('Triggering validateStep1 for:', name);
        validateStep1();
      } else if (step === 2 && ['numberOfEmployees', 'annualRevenue', 'businessType'].includes(name)) {
        console.log('Triggering validateStep2 for:', name);
        validateStep2();
      } else if (step === 3 && ['address', 'city', 'province', 'postalCode'].includes(name)) {
        console.log('Triggering validateStep3 for:', name);
        validateStep3();
      } else {
        console.log('No validation triggered for:', name, 'step:', step);
      }
    }, 100);
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
    
    // Tax number is required for commercial registration
    if (!formData.taxNumber?.trim()) {
      errors.taxNumber = 'Tax number is required';
    } else {
      const taxError = RegistrationValidation.validateTaxNumber(formData.taxNumber);
      if (taxError) errors.taxNumber = taxError;
    }
    
    const vatError = RegistrationValidation.validateVATNumber(formData.vatNumber);
    if (vatError) errors.vatNumber = vatError;
    
    if (!formData.contactPerson?.trim()) errors.contactPerson = 'Contact person is required';
    
    const emailError = RegistrationValidation.validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const phoneError = RegistrationValidation.validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
    
    if (!formData.role) errors.role = 'Please select a role';
    
    // Validate numberOfEmployees field that's in Step 1
    if (!formData.numberOfEmployees || formData.numberOfEmployees === '' || formData.numberOfEmployees === undefined) {
      errors.numberOfEmployees = 'Please select number of employees';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validate business details fields
    if (!formData.annualRevenue || formData.annualRevenue === '' || formData.annualRevenue === undefined) {
      errors.annualRevenue = 'Please select annual revenue';
    }
    if (!formData.businessType || formData.businessType === '' || formData.businessType === undefined) {
      errors.businessType = 'Please select business type';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validate location fields
    if (!formData.address?.trim()) errors.address = 'Address is required';
    if (!formData.city?.trim()) errors.city = 'City is required';
    if (!formData.province) errors.province = 'Please select a province';
    
    const postalError = RegistrationValidation.validatePostalCode(formData.postalCode);
    if (postalError) errors.postalCode = postalError;

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
      name: formData.contactPerson,
      role: formData.role as any,
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
                        className={getFieldClassName(!!fieldErrors.companyName)}
                      />
                      {fieldErrors.companyName && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.companyName}</p>
                      )}
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
                        className={getFieldClassName(!!fieldErrors.registrationNumber)}
                      />
                      {fieldErrors.registrationNumber && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.registrationNumber}</p>
                      )}
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
                        className={getFieldClassName(!!fieldErrors.taxNumber)}
                      />
                      {fieldErrors.taxNumber && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.taxNumber}</p>
                      )}
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
                        className={getFieldClassName(!!fieldErrors.vatNumber)}
                      />
                      {fieldErrors.vatNumber && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.vatNumber}</p>
                      )}
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
                        className={getFieldClassName(!!fieldErrors.contactPerson)}
                      />
                      {fieldErrors.contactPerson && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.contactPerson}</p>
                      )}
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
                        className={getFieldClassName(!!fieldErrors.email)}
                      />
                      {fieldErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                      )}
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Employees *
                      </label>
                      <select
                        name="numberOfEmployees"
                        required
                        value={formData.numberOfEmployees}
                        onChange={handleChange}
                        className={getFieldClassName(!!fieldErrors.numberOfEmployees)}
                      >
                        <option value="">Select Size</option>
                        <option value="1-10">1-10 Employees</option>
                        <option value="11-50">11-50 Employees</option>
                        <option value="51-100">51-100 Employees</option>
                        <option value="101-200">101-200 Employees</option>
                      </select>
                      {fieldErrors.numberOfEmployees && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.numberOfEmployees}</p>
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
                        className={getFieldClassName(!!fieldErrors.annualRevenue)}
                      >
                        <option value="">Select Range</option>
                        <option value="under-1m">Under R1 Million</option>
                        <option value="1m-5m">R1M - R5 Million</option>
                        <option value="5m-10m">R5M - R10 Million</option>
                        <option value="10m-50m">R10M - R50 Million</option>
                        <option value="over-50m">Over R50 Million</option>
                      </select>
                      {fieldErrors.annualRevenue && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.annualRevenue}</p>
                      )}
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
                        className={getFieldClassName(!!fieldErrors.businessType)}
                      >
                        <option value="">Select Type</option>
                        <option value="commercial-farm">Commercial Farm</option>
                        <option value="agri-business">Agri-Business</option>
                        <option value="food-processor">Food Processor</option>
                        <option value="livestock-operation">Livestock Operation</option>
                        <option value="mixed-operation">Mixed Operation</option>
                      </select>
                      {fieldErrors.businessType && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.businessType}</p>
                      )}
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
