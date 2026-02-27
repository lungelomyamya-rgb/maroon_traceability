'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { Shield, Search, AlertTriangle, FileText, MapPin, Activity, TrendingUp, Users, Calendar, CheckCircle } from 'lucide-react';

export default function SAPSPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      setIsChecking(false);

      // If user is not logged in, redirect to login
      if (!currentUser) {
        router.replace('/login?redirect=/saps');
        return;
      }
      // If user is logged in but not SAPS, redirect to unauthorized
      if (currentUser.role && !['saps'].includes(currentUser.role)) {
        router.replace('/unauthorized');
        return;
      }
    };

    // Add a small delay to prevent flickering
    const timeoutId = setTimeout(checkAuth, 100);

    return () => clearTimeout(timeoutId);
  }, [currentUser, router]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'saps') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Active Inspections', value: '12', icon: Search, color: 'text-blue-600' },
    { label: 'Assets Recovered', value: '8', icon: Shield, color: 'text-green-600' },
    { label: 'Pending Reports', value: '3', icon: FileText, color: 'text-orange-600' },
    { label: 'Theft Alerts', value: '5', icon: AlertTriangle, color: 'text-red-600' },
  ];

  const quickActions = [
    {
      title: 'Roadside Inspection',
      description: 'Scan QR codes and verify livestock ownership',
      href: '/saps/inspections',
      icon: Search,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    },
    {
      title: 'Asset Recovery',
      description: 'Handle theft cases and recover stolen livestock',
      href: '/saps/recovery',
      icon: Shield,
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
    },
    {
      title: 'Theft Reports',
      description: 'View and manage theft incident reports',
      href: '/saps/reports',
      icon: FileText,
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    },
    {
      title: 'Heatmaps',
      description: 'View theft hotspots and patrol areas',
      href: '/saps/heatmaps',
      icon: MapPin,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    },
  ];

  return (
    <DashboardLayout
      description="Roadside Inspections & Asset Recovery Portal"
    >
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-900 to-gray-800 rounded-2xl p-4 sm:p-8 text-white relative">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">SAPS Dashboard</h1>
            <p className="text-gray-100 mb-4 sm:mb-6 text-sm sm:text-base">Complete law enforcement operations management for Maroon Traceability System</p>
            <div className="flex justify-center items-center gap-3 sm:gap-6 mb-4 sm:mb-8 flex-wrap">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">12 Active Inspections</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">8 Assets Recovered</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">5 Theft Alerts</span>
              </div>
            </div>
            <div className="hidden md:block">
              <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-blue-200 mx-auto" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {stat.label}
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-center">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Activity className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Access key SAPS functionalities for roadside operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className={`cursor-pointer transition-colors ${action.color} border`}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex items-center space-x-3">
                        <action.icon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Recent Activity</CardTitle>
            <CardDescription>Latest inspections and recovery operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-4">
                <div className="flex items-center space-x-3">
                  <Search className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Roadside Inspection Completed</p>
                    <p className="text-sm text-gray-600">N3 Highway - Cattle transport verified</p>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0">2 hours ago</Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Asset Recovery Successful</p>
                    <p className="text-sm text-gray-600">Stolen livestock recovered - Case #2024-045</p>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0">5 hours ago</Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium">Theft Alert Received</p>
                    <p className="text-sm text-gray-600">Panic button activated - Eastern Cape</p>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0">1 day ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
