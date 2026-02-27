'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { Shield, AlertTriangle, CheckCircle, MapPin, FileText, Camera, TrendingUp, ArrowLeft } from 'lucide-react';

export default function SAPSRecoveryPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const [isChecking, setIsChecking] = useState(true);
  const [selectedCase, setSelectedCase] = useState<string>('');

  useEffect(() => {
    const checkAuth = () => {
      setIsChecking(false);

      // If user is not logged in, redirect to login
      if (!currentUser) {
        router.replace('/login?redirect=/saps/recovery');
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

  const activeCases = [
    {
      id: 'CASE-2024-045',
      status: 'active',
      priority: 'high',
      livestock: 'Cattle (5 head)',
      location: 'Eastern Cape - Last seen near Port Elizabeth',
      reported: '2024-01-15 08:30',
      farmer: 'John Farmer',
      value: 'R75,000'
    },
    {
      id: 'CASE-2024-044',
      status: 'active',
      priority: 'medium',
      livestock: 'Sheep (12 head)',
      location: 'Free State - Moving towards Bloemfontein',
      reported: '2024-01-14 16:20',
      farmer: 'Sarah Shepherd',
      value: 'R24,000'
    },
    {
      id: 'CASE-2024-043',
      status: 'recovered',
      priority: 'high',
      livestock: 'Goats (8 head)',
      location: 'KwaZulu-Natal - Recovered at N3 checkpoint',
      reported: '2024-01-13 12:15',
      farmer: 'Mike Goat',
      value: 'R16,000'
    }
  ];

  const recoveryActions = [
    {
      title: 'Scan Recovered Asset',
      description: 'Verify ownership using QR code or IoT tag',
      icon: Camera,
      action: () => console.log('Scan asset')
    },
    {
      title: 'Update Case Status',
      description: 'Mark case as recovered or update progress',
      icon: CheckCircle,
      action: () => console.log('Update status')
    },
    {
      title: 'Generate Recovery Report',
      description: 'Create official recovery documentation',
      icon: FileText,
      action: () => console.log('Generate report')
    },
    {
      title: 'Notify Owner',
      description: 'Inform farmer of recovery status',
      icon: AlertTriangle,
      action: () => console.log('Notify owner')
    }
  ];

  return (
    <DashboardLayout
      description="Handle theft cases and recover stolen livestock"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="mb-4">
          <Button variant="outline" onClick={() => router.push('/saps')} className="inline-flex items-center gap-2">
            Back
          </Button>
        </div>

        {/* Active Cases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
              Active Theft Cases
            </CardTitle>
            <CardDescription>
              Cases requiring immediate attention and recovery operations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {activeCases.map((case_) => (
                <div key={case_.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                     onClick={() => setSelectedCase(case_.id)}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <h3 className="font-semibold text-lg">{case_.id}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={case_.status === 'recovered' ? 'default' : 'destructive'}>
                          {case_.status.toUpperCase()}
                        </Badge>
                        <Badge variant={case_.priority === 'high' ? 'destructive' : 'secondary'}>
                          {case_.priority.toUpperCase()} PRIORITY
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="font-semibold text-green-600">{case_.value}</p>
                      <p className="text-sm text-gray-600">Estimated Value</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Livestock:</strong> {case_.livestock}
                    </div>
                    <div>
                      <strong>Farmer:</strong> {case_.farmer}
                    </div>
                    <div>
                      <strong>Reported:</strong> {case_.reported}
                    </div>
                  </div>
                  <div className="mt-2 flex items-start space-x-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{case_.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recovery Actions */}
        {selectedCase && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Recovery Actions - {selectedCase}</CardTitle>
              <CardDescription>
                Execute recovery protocol and document all actions taken
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {recoveryActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={action.action}
                  >
                    <action.icon className="w-6 h-6" />
                    <span className="text-center text-sm">{action.title}</span>
                  </Button>
                ))}
              </div>

              {/* Recovery Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recovery-location">Recovery Location</Label>
                    <Input id="recovery-location" placeholder="Enter GPS coordinates or address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recovery-time">Recovery Time</Label>
                    <Input id="recovery-time" type="datetime-local" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recovery-details">Recovery Details</Label>
                  <Textarea
                    id="recovery-details"
                    placeholder="Describe how the asset was recovered, condition of livestock, actions taken..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evidence">Evidence Collected</Label>
                  <Textarea
                    id="evidence"
                    placeholder="Document evidence, witness statements, vehicle details..."
                    rows={3}
                  />
                </div>
                <div className="flex space-x-4">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Recovery
                  </Button>
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recovery Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-center">Recovery Rate</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-green-600">78%</div>
              <p className="text-sm text-gray-600 mt-1">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-center">Assets Recovered</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-blue-600">156</div>
              <p className="text-sm text-gray-600 mt-1">This year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-center">Value Recovered</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-purple-600">R2.4M</div>
              <p className="text-sm text-gray-600 mt-1">This year</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
