'use client';

import { ArrowLeft, Building2, Mail, Phone, MapPin, Users, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ContactSalesPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    organizationType: '',
    numberOfUsers: '',
    requirements: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would submit this to your backend
    console.log('Submitting contact sales:', formData);
    alert('Thank you for your interest! Our sales team will contact you within 24 hours.');
    router.push('/get-started');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Sales</h1>
            <p className="text-gray-600">Enterprise solutions for Government & SOEs</p>
            <div className="mt-2 inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              Custom Quote · Tailored Solutions
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Building2 className="mr-2 h-5 w-5 text-blue-600" />
                    Organization Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Organization Name *
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
                        Organization Type *
                      </label>
                      <select
                        name="organizationType"
                        required
                        value={formData.organizationType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Type</option>
                        <option value="government">Government Department</option>
                        <option value="soe">State-Owned Enterprise</option>
                        <option value="municipality">Municipality</option>
                        <option value="public-entity">Public Entity</option>
                        <option value="large-enterprise">Large Enterprise</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Users *
                      </label>
                      <select
                        name="numberOfUsers"
                        required
                        value={formData.numberOfUsers}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Range</option>
                        <option value="50-200">50-200 Users</option>
                        <option value="201-500">201-500 Users</option>
                        <option value="501-1000">501-1000 Users</option>
                        <option value="1000+">1000+ Users</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-600" />
                    Requirements
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Requirements *
                      </label>
                      <textarea
                        name="requirements"
                        rows={3}
                        required
                        value={formData.requirements}
                        onChange={handleChange}
                        placeholder="Please describe your specific traceability needs, compliance requirements, and integration needs..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Message
                      </label>
                      <textarea
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Any additional information or questions..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button type="submit" size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-blue-500 disabled:opacity-50 disabled:transform-none"
                      >
                    Contact Sales Team
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Enterprise Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Unlimited Users</span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">GRAP & SITA Aligned</span>
                </li>
                <li className="flex items-start">
                  <Phone className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">24/7 Dedicated Manager</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Custom ERP Integration</span>
                </li>
                <li className="flex items-start">
                  <Building2 className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Unlimited Records</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-sm text-gray-700">sales@tactpam.co.za</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-sm text-gray-700">+27 12 345 6789</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-sm text-gray-700">Pretoria, South Africa</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold mb-4 text-blue-900">Response Time</h3>
              <p className="text-sm text-blue-800">
                Our enterprise sales team typically responds within 24 hours during business days.
              </p>
              <div className="mt-4 text-sm text-blue-700">
                <strong>Business Hours:</strong><br />
                Monday - Friday: 8:00 - 17:00<br />
                Saturday: 9:00 - 13:00<br />
                Sunday: Closed
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
