'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Save, X, Briefcase, Building, Package, Truck, Eye, CheckCircle, FileText } from 'lucide-react';
import { useUser } from '@/contexts/userContext';
import { Button } from '@/components/ui/button';
import { DEMO_USERS } from '@/constants/users';
import { UserRole, UniversalUser } from '@/types/user';
import { ProfileService } from '@/services/profileService';
import { useRouter } from 'next/navigation';
import { extractProfileData, createUpdateData, hasBusinessInfo, hasFarmInfo, formatFarmSize, getDisplayValue } from '@/utils/profileDataMapper';
import { uploadImage } from '@/utils/imageUpload';

interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  avatarUrl?: string;
  companyName?: string;
  registrationNumber?: string;
  taxNumber?: string;
  vatNumber?: string;
  businessType?: string;
  numberOfEmployees?: string;
  annualRevenue?: string;
  farmSize?: string;
  farmName?: string;
  livestockType?: string;
}

export default function ProfilePage() {
  const { currentUser, setUser, logout, getAuthToken } = useUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    avatarUrl: '',
    companyName: '',
    registrationNumber: '',
    taxNumber: '',
    vatNumber: '',
    farmSize: '',
    farmName: '',
    livestockType: '',
    businessType: '',
    numberOfEmployees: '',
    annualRevenue: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [profileCompletionClicked, setProfileCompletionClicked] = useState(false);

  useEffect(() => {
    if (currentUser) {
      // Use the profile data mapper to extract all user data
      const profileData = extractProfileData(currentUser);
      if (profileData) {
        setFormData(profileData);
      }
    }
  }, [currentUser]);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ProfileFormData] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentUser) {
      try {
        // Upload to Supabase Storage
        const imageUrl = await uploadImage(file, currentUser.id);
        setFormData(prev => ({
          ...prev,
          avatarUrl: imageUrl,
        }));
      } catch (error) {
        console.error('Failed to upload image:', error);
        // Fallback to base64 if upload fails
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setFormData(prev => ({
            ...prev,
            avatarUrl: result,
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSaveStatus('saving');

    try {
      // Check if user is demo account
      const isDemoUser = currentUser && '_source' in currentUser && 
                       (currentUser as any)._source?.type === 'mock' || 
                       DEMO_USERS.some(u => u.id === currentUser?.id);

      if (!currentUser?.id) {
        throw new Error('User ID not found');
      }

      // Validate form data
      const validation = ProfileService.validateProfileData({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postal_code: formData.postal_code,
        companyName: formData.companyName,
        registrationNumber: formData.registrationNumber,
        taxNumber: formData.taxNumber,
        vatNumber: formData.vatNumber,
        farmSize: formData.farmSize,
        livestockType: formData.livestockType,
        businessType: formData.businessType,
        numberOfEmployees: formData.numberOfEmployees,
        annualRevenue: formData.annualRevenue,
      } as any);

      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Get auth token for real accounts
      let authToken: string | undefined;
      console.log('User is demo account:', isDemoUser);
      console.log('Current user data:', currentUser);
      
      if (!isDemoUser) {
        const token = await getAuthToken();
        console.log('Auth token retrieved:', token ? 'Token exists' : 'No token found');
        if (!token) {
          throw new Error('Authentication required. Please log in again.');
        }
        authToken = token;
      }

      // Prepare update data using the data mapper
      const updateData = createUpdateData(formData, currentUser);

      console.log('Update data being sent:', updateData);
      console.log('Current user data:', currentUser);

      // Call the ProfileService to update profile
      const updatedUser = await ProfileService.updateProfile(
        currentUser.id,
        updateData,
        isDemoUser,
        authToken
      );

      // Update local user context with the updated user data
      if (updatedUser && setUser) {
        // Merge the updated data with the current user to preserve any additional fields
        const mergedUser = {
          ...currentUser,
          ...updatedUser,
          // Preserve source tracking and validation metadata if they exist
          ...(currentUser && '_source' in currentUser && { _source: currentUser._source }),
          ...(currentUser && '_validation' in currentUser && { 
            _validation: {
              ...currentUser._validation,
              validatedAt: new Date().toISOString(),
            }
          }),
          ...(currentUser && !('_normalized' in currentUser) && { _normalized: true }),
        };
        
        setUser(mergedUser);
        
        // Extract updated profile data using the data mapper
        const updatedProfileData = extractProfileData(mergedUser);
        
        // Update formData to reflect the saved changes
        if (updatedProfileData) {
          setFormData(prev => ({
            ...prev,
            name: updatedProfileData.name || prev.name,
            email: updatedProfileData.email || prev.email,
            phone: updatedProfileData.phone || prev.phone,
            address: updatedProfileData.address || prev.address,
            city: updatedProfileData.city || prev.city,
            province: updatedProfileData.province || prev.province,
            postal_code: updatedProfileData.postal_code || prev.postal_code,
            avatarUrl: updatedProfileData.avatarUrl || prev.avatarUrl,
            companyName: updatedProfileData.companyName || prev.companyName,
            registrationNumber: updatedProfileData.registrationNumber || prev.registrationNumber,
            taxNumber: updatedProfileData.taxNumber || prev.taxNumber,
            vatNumber: updatedProfileData.vatNumber || prev.vatNumber,
            businessType: updatedProfileData.businessType || prev.businessType,
            numberOfEmployees: updatedProfileData.numberOfEmployees || prev.numberOfEmployees,
            annualRevenue: updatedProfileData.annualRevenue || prev.annualRevenue,
            farmSize: updatedProfileData.farmSize || prev.farmSize,
            farmName: updatedProfileData.farmName || prev.farmName,
            livestockType: updatedProfileData.livestockType || prev.livestockType,
          }));
        } else {
          console.log('updatedProfileData is null');
        }
      }

      setSaveStatus('saved');
      setTimeout(() => {
        setIsEditing(false);
        setSaveStatus('idle');
      }, 1500);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current user values using the data mapper
    if (currentUser) {
      const profileData = extractProfileData(currentUser);
      if (profileData) {
        setFormData(profileData);
      }
    }
    setIsEditing(false);
    setSaveStatus('idle');
  };

  const getRoleIcon = (role: UserRole) => {
    const iconMap = {
      farmer: <Package className="h-5 w-5" />,
      inspector: <CheckCircle className="h-5 w-5" />,
      logistics: <Truck className="h-5 w-5" />,
      packaging: <Building className="h-5 w-5" />,
      retailer: <Briefcase className="h-5 w-5" />,
      public: <Eye className="h-5 w-5" />,
      government: <Shield className="h-5 w-5" />,
      admin: <Shield className="h-5 w-5" />,
      saps: <Shield className="h-5 w-5" />,
      viewer: <Eye className="h-5 w-5" />,
    };
    return iconMap[role] || <User className="h-5 w-5" />;
  };

  const getRoleDisplayName = (role: UserRole) => {
    const displayMap = {
      farmer: "Farmers'",
      inspector: "Inspectors'",
      logistics: "Logistics Providers'",
      packaging: "Packaging Providers'",
      retailer: "Retailers'",
      public: "Public Users'",
      government: "Government Officials'",
      admin: "Administrators'",
      saps: "SAPS Officials'",
      viewer: "Viewers'",
    };
    return displayMap[role] || role;
  };

  const hasCompleteProfile = (user: any) => {
  if (!user) return false;
  
  // Check if user has basic profile information (excluding bio since it's not in database)
  const hasPhone = user.phone || (user as any).profile?.phone || (user as any).additional_data?.phone;
  const hasAddress = user.address || (user as any).profile?.address || (user as any).additional_data?.address;
  
  return !!(hasPhone || hasAddress);
};

const getDashboardPath = (role: UserRole) => {
    const dashboardMap = {
      farmer: '/farmer',
      inspector: '/inspector',
      logistics: '/logistics',
      packaging: '/packaging',
      retailer: '/retailer',
      public: '/marketplace',
      government: '/admin',
      admin: '/admin',
      saps: '/saps',
      viewer: '/marketplace',
    };
    return dashboardMap[role] || '/marketplace';
  };

  const isDemoUser = currentUser && '_source' in currentUser && 
                   (currentUser as any)._source?.type === 'mock' || 
                   DEMO_USERS.some(u => u.id === currentUser?.id);

const isRealUser = currentUser && '_source' in currentUser && 
                   (currentUser as any)._source?.type === 'api';

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Available</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-4">
            {/* Back Button */}
            <div className="flex justify-center sm:justify-start">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(getDashboardPath(currentUser.role))}
                className="flex items-center space-x-2 text-center sm:text-left"
              >
                <span>Back to {getRoleDisplayName(currentUser.role)} Dashboard</span>
              </Button>
            </div>
            
            {/* Profile Title */}
            <div className="flex items-center justify-center space-x-3 sm:space-x-4 sm:justify-start w-full sm:w-auto">
              <div 
              className="flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full flex-shrink-0 relative group cursor-pointer"
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt="Profile"
                  className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow"
                />
              ) : (
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-white shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow">
                  <span className="text-white text-lg sm:text-xl font-bold">
                    {formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
              )}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="absolute inset-0 h-12 w-12 sm:h-16 sm:w-16 rounded-full opacity-0 cursor-pointer z-10"
                disabled={false}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full z-20 pointer-events-none">
                <span className="text-white text-xs sm:text-sm font-medium">
                  {formData.avatarUrl ? 'Change Photo' : 'Add Photo'}
                </span>
              </div>
            </div>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate text-center sm:text-left">Profile</h1>
                <p className="text-sm sm:text-base text-gray-600 text-center sm:text-left">Manage your account information</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:space-x-2">
              {isDemoUser && (
                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                  Demo Account
                </span>
              )}
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 w-full sm:w-auto justify-center"
                  size="sm"
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                  <span className="sm:hidden">Edit</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Completion Message for Real Users */}
        {isRealUser && !hasCompleteProfile(currentUser) && (
          <div className={`${profileCompletionClicked ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'} rounded-lg p-4 mb-6 transition-all duration-300`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {profileCompletionClicked ? (
                  <svg className="h-6 w-6 text-green-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className={`text-sm font-medium ${profileCompletionClicked ? 'text-green-800' : 'text-blue-800'}`}>
                  {profileCompletionClicked ? 'Profile Editing Started' : 'Complete Your Profile'}
                </h3>
                <p className={`text-sm mt-1 ${profileCompletionClicked ? 'text-green-700' : 'text-blue-700'}`}>
                  {profileCompletionClicked 
                    ? 'Great! You can now edit your profile below. Fill in your contact details, address, and business/farm information to get the most out of the platform.'
                    : 'Your profile is currently incomplete. Add your contact details and address to get the most out of the platform.'
                  }
                </p>
                <div className="mt-3">
                  {!profileCompletionClicked ? (
                    <Button
                      onClick={() => {
                        setIsEditing(true);
                        setProfileCompletionClicked(true);
                      }}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Complete Profile
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-600 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-700 font-medium">Scroll down to edit your profile</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Content */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Account Information */}
          <div className="p-4 sm:p-6 border-b-2 border-gray-200 bg-white text-center sm:text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center sm:text-left">Account Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    disabled={isLoading}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="flex items-center justify-center space-x-2 sm:justify-start">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 text-center sm:text-left">{formData.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    disabled={isLoading}
                    placeholder="Enter your email address"
                  />
                ) : (
                  <div className="flex items-center justify-center space-x-2 sm:justify-start">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 text-center sm:text-left">{formData.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    disabled={isLoading}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="flex items-center justify-center space-x-2 sm:justify-start">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className={`text-center sm:text-left ${
                      !formData.phone && isRealUser
                        ? 'text-orange-600 font-medium'
                        : 'text-gray-900'
                    }`}>
                      {formData.phone || (isRealUser ? 'Add phone number' : 'Not provided')}
                      {!formData.phone && isRealUser && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Required
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                  Role
                </label>
                <div className="flex items-center justify-center space-x-2 sm:justify-start">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 text-center sm:text-left">{getRoleDisplayName(currentUser.role)}</span>
                </div>
              </div>
            </div>
          </div>

          
          {/* Address Information */}
          <div className="p-4 sm:p-6 border-b-2 border-gray-200 bg-gray-50/30 text-center sm:text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center sm:text-left">Address Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Street */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                  Street Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    disabled={isLoading}
                    placeholder="Enter street address"
                  />
                ) : (
                  <div className="flex items-center justify-center space-x-2 sm:justify-start">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 text-center sm:text-left">
                      {formData.address || 'Not provided'}
                    </span>
                  </div>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                  City/Town
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    disabled={isLoading}
                    placeholder="Enter city/town"
                  />
                ) : (
                  <div className="flex items-center justify-center space-x-2 sm:justify-start">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 text-center sm:text-left">
                      {formData.city || 'Not provided'}
                    </span>
                  </div>
                )}
              </div>

              {/* Province */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                  Province
                </label>
                {isEditing ? (
                  <select
                    value={formData.province || ''}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    disabled={isLoading}
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
                ) : (
                  <div className="flex items-center justify-center space-x-2 sm:justify-start">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 text-center sm:text-left">
                      {formData.province || 'Not provided'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                  Postal Code
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.postal_code || ''}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    disabled={isLoading}
                    placeholder="Enter postal code"
                  />
                ) : (
                  <span className="text-gray-900 text-center sm:text-left">
                    {formData.postal_code || 'Not provided'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Business Information - Show for users with business data */}
          {hasBusinessInfo(currentUser) && (
            <div className="p-4 sm:p-6 border-b-2 border-gray-200 bg-blue-50/30 text-center sm:text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center sm:text-left flex items-center justify-center sm:justify-start">
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                Business Information
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                    Company Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.companyName || ''}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      disabled={isLoading}
                      placeholder="Enter company name"
                    />
                  ) : (
                    <div className="flex items-center justify-center space-x-2 sm:justify-start">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 text-center sm:text-left">
                        {getDisplayValue(currentUser, 'retailInfo.companyName', 'additional_data.companyName') || 'Not provided'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Registration Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                    Registration Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.registrationNumber || ''}
                      onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      disabled={isLoading}
                      placeholder="Enter registration number"
                    />
                  ) : (
                    <div className="flex items-center justify-center space-x-2 sm:justify-start">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 text-center sm:text-left">
                        {getDisplayValue(currentUser, 'retailInfo.registrationNumber', 'additional_data.registrationNumber') || 'Not provided'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tax Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                    Tax Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.taxNumber || ''}
                      onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      disabled={isLoading}
                      placeholder="Enter tax number"
                    />
                  ) : (
                    <div className="flex items-center justify-center space-x-2 sm:justify-start">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 text-center sm:text-left">
                        {getDisplayValue(currentUser, 'retailInfo.taxNumber', 'additional_data.taxNumber') || 'Not provided'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                    Business Type
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.businessType || ''}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      disabled={isLoading}
                    >
                      <option value="">Select Type</option>
                      <option value="commercial-farm">Commercial Farm</option>
                      <option value="agri-business">Agri-Business</option>
                      <option value="food-processor">Food Processor</option>
                      <option value="livestock-operation">Livestock Operation</option>
                      <option value="mixed-operation">Mixed Operation</option>
                      <option value="cooperative">Cooperative</option>
                      <option value="joint-venture">Joint Venture</option>
                      <option value="small-enterprise">Small Enterprise</option>
                      <option value="medium-enterprise">Medium Enterprise</option>
                      <option value="retail">Retail</option>
                    </select>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 sm:justify-start">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 text-center sm:text-left">
                        {getDisplayValue(currentUser, 'retailInfo.businessType', 'additional_data.businessType') || 'Not provided'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Farm Information - Show for users with farm data */}
          {hasFarmInfo(currentUser) && (
            <div className="p-4 sm:p-6 border-b-2 border-gray-200 bg-green-50/30 text-center sm:text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center sm:text-left flex items-center justify-center sm:justify-start">
                <Package className="h-5 w-5 mr-2 text-green-600" />
                Farm Information
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Farm Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                    Farm Size (hectares)
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.farmSize || ''}
                      onChange={(e) => handleInputChange('farmSize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      disabled={isLoading}
                      placeholder="Enter farm size in hectares"
                    />
                  ) : (
                    <div className="flex items-center justify-center space-x-2 sm:justify-start">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 text-center sm:text-left">
                        {formatFarmSize(getDisplayValue(currentUser, 'farmInfo.farmSize', 'additional_data.farmSize'))}
                      </span>
                    </div>
                  )}
                </div>

                {/* Livestock Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                    Primary Livestock
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.livestockType || ''}
                      onChange={(e) => handleInputChange('livestockType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      disabled={isLoading}
                    >
                      <option value="">Select Type</option>
                      <option value="cattle">Cattle</option>
                      <option value="sheep">Sheep</option>
                      <option value="goats">Goats</option>
                      <option value="pigs">Pigs</option>
                      <option value="poultry">Poultry</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 sm:justify-start">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 text-center sm:text-left">
                        {getDisplayValue(currentUser, 'farmInfo.livestockType', 'additional_data.livestockType') || 'Not provided'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Account Status */}
          <div className="p-4 sm:p-6 bg-gray-50/30 text-center sm:text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center sm:text-left">Account Status</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                  Account Status
                </label>
                <div className="flex items-center justify-center space-x-2 sm:justify-start">
                  <div className={`h-3 w-3 rounded-full ${currentUser.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-gray-900 text-center sm:text-left">{currentUser.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>

              {/* Email Verification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                  Email Verification
                </label>
                <div className="flex items-center justify-center space-x-2 sm:justify-start">
                  {currentUser.emailVerified ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-900 text-center sm:text-left">Verified</span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-gray-900 text-center sm:text-left">Not Verified</span>
                    </>
                  )}
                </div>
              </div>

              {/* Member Since */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                  Member Since
                </label>
                <div className="flex items-center justify-center space-x-2 sm:justify-start">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 text-center sm:text-left">
                    {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  {saveStatus === 'saved' && (
                    <p className="text-sm text-green-600">Profile updated successfully!</p>
                  )}
                  {saveStatus === 'error' && (
                    <p className="text-sm text-red-600">Failed to update profile. Please try again.</p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                    size="sm"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logout Section */}
        <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 mt-4 sm:mt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Management</h3>
              <p className="text-sm text-gray-600">Sign out of your account to protect your privacy</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                logout().then(() => {
                  // Check if user was using demo mode
                  const isDemoUser = currentUser && '_source' in currentUser && 
                                   (currentUser as any)._source?.type === 'mock' || 
                                   DEMO_USERS.some(u => u.id === currentUser?.id);
                  
                  if (isDemoUser) {
                    // For demo users, redirect to demo login page
                    router.push('/login');
                  } else {
                    // For real accounts, redirect to intro screen
                    router.push('/intro');
                  }
                });
              }}
              className="flex items-center space-x-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 w-full sm:w-auto"
            >
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
