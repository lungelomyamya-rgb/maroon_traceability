'use client';

import { Card } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/typography';
import { Settings, User, Bell, Shield, Database } from 'lucide-react';
import { useUser } from '@/contexts/userContext';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { currentUser: user } = useUser();

  return (
    <div className="space-y-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageTitle className="mb-8">Settings</PageTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-semibold">General Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User Role</span>
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                  {user?.role || 'Unknown'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email</span>
                <span className="text-sm text-muted-foreground">{user?.email || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Notifications</span>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <User className="h-8 w-8 text-secondary" />
              <h3 className="text-lg font-semibold">Profile</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Display Name</span>
                <span className="text-sm text-muted-foreground">{user?.name || 'Anonymous User'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Account Status</span>
                <span className="text-sm text-green-600">Active</span>
              </div>
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-8 w-8 text-accent" />
              <h3 className="text-lg font-semibold">Security</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Two-Factor Auth</span>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Session Timeout</span>
                <select className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                  <option>24 hours</option>
                </select>
              </div>
              <Button variant="outline" className="w-full text-red-600 hover:bg-red-50 hover:text-red-700">
                Change Password
              </Button>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="h-8 w-8 text-warning" />
              <h3 className="text-lg font-semibold">Data & Privacy</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Data Export</span>
                <Button variant="outline" size="sm">
                  Export All Data
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Clear Cache</span>
                <Button variant="outline" size="sm">
                  Clear
                </Button>
              </div>
              <Button variant="outline" className="w-full text-red-600 hover:bg-red-50 hover:text-red-700">
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
