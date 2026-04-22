// src/components/retailers/customerManagement/CommunicationForm.tsx
'use client';

import { MessageSquare, Send, X, Mail, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface CommunicationFormProps {
  customer: Customer;
  onClose: () => void;
  onSend?: (message: CommunicationMessage) => void;
}

interface CommunicationMessage {
  customerId: string;
  type: 'email' | 'sms' | 'both';
  subject: string;
  message: string;
}

export function CommunicationForm({ customer, onClose, onSend }: CommunicationFormProps) {
  const [formData, setFormData] = useState({
    type: 'email' as 'email' | 'sms' | 'both',
    subject: '',
    message: '',
  });

  const handleSubmit = () => {
    if (!formData.subject.trim() || !formData.message.trim()) {
      return;
    }

    const message: CommunicationMessage = {
      customerId: customer.id,
      type: formData.type,
      subject: formData.subject,
      message: formData.message,
    };

    onSend?.(message);
    onClose();
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b gap-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Contact Customer</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 sm:p-6">
          {/* Customer Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{customer.name}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {customer.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Smartphone className="h-3 w-3" />
                    {customer.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault(); handleSubmit();
          }}>
            <div>
              <label className="text-sm font-medium text-gray-700">Communication Type</label>
              <Select value={formData.type} onValueChange={(value) => updateField('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Subject</label>
              <Input
                value={formData.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                placeholder="Enter subject"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Message</label>
              <Textarea
                value={formData.message}
                onChange={(e) => updateField('message', e.target.value)}
                placeholder="Type your message..."
                rows={6}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
