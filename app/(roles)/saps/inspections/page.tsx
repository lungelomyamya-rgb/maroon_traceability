'use client';

import { Search, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useUser } from '@/contexts/userContext';
import { Badge } from '@/src/features/shared/ui/badge';
import { Button } from '@/src/features/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/features/shared/ui/card';
import { Input } from '@/src/features/shared/ui/input';
import { Label } from '@/src/features/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/features/shared/ui/select';
import { Textarea } from '@/src/features/shared/ui/textarea';




export default function SAPSInspectionsPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const [isChecking, setIsChecking] = useState(true);
  const [scanResult, setScanResult] = useState<string>('');
  const [inspectionStatus, setInspectionStatus] = useState<'pending' | 'verified' | 'flagged'>('pending');

  useEffect(() => {
    const checkAuth = () => {
      setIsChecking(false);

      // If user is not logged in, redirect to login
      if (!currentUser) {
        router.replace('/login?redirect=/saps/inspections');
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

  const handleScan = () => {
    // Simulate QR code scan
    setScanResult('QR-ABC123-XYZ789');
    setInspectionStatus('verified');
  };

  const recentInspections = [
    {
      id: 'INS-2024-001',
      location: 'N3 Highway - Johannesburg',
      livestock: 'Cattle (12 head)',
      status: 'verified',
      timestamp: '2024-01-15 14:30',
      officer: 'Constable Mthembu',
    },
    {
      id: 'INS-2024-002',
      location: 'R61 - Bloemfontein',
      livestock: 'Sheep (45 head)',
      status: 'flagged',
      timestamp: '2024-01-15 11:15',
      officer: 'Sergeant Nkosi',
    },
    {
      id: 'INS-2024-003',
      location: 'N2 Highway - Port Elizabeth',
      livestock: 'Goats (28 head)',
      status: 'verified',
      timestamp: '2024-01-14 16:45',
      officer: 'Constable Zulu',
    },
  ];

  return (
    <DashboardLayout
      description="Perform roadside inspections and verify livestock ownership"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="mb-4">
          <Button variant="outline" onClick={() => router.push('/saps')} className="inline-flex items-center gap-2">
            Back
          </Button>
        </div>

        {/* Scan Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">QR Code Scanner</CardTitle>
            <CardDescription>
              Scan IoT ear tags or QR codes to verify livestock ownership and transit permits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="scan-input">Scan Result</Label>
                <div className="flex space-x-2">
                  <Input
                    id="scan-input"
                    value={scanResult}
                    onChange={(e) => setScanResult(e.target.value)}
                    placeholder="QR code will appear here..."
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={handleScan}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Inspection Status</Label>
                <Select value={inspectionStatus} onValueChange={(value: string) => setInspectionStatus(value as 'pending' | 'verified' | 'flagged')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="verified">Verified - Proceed</SelectItem>
                    <SelectItem value="flagged">Flagged - Hold Vehicle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {scanResult && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {inspectionStatus === 'verified' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {inspectionStatus === 'flagged' && <XCircle className="w-5 h-5 text-red-600" />}
                  <span className="font-medium">Scan Result: {scanResult}</span>
                  <Badge variant={inspectionStatus === 'verified' ? 'default' : 'destructive'}>
                    {inspectionStatus === 'verified' ? 'VERIFIED' : 'FLAGGED'}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div><strong>Owner:</strong> John Farmer (ID: FM001)</div>
                  <div><strong>Origin:</strong> Farm Alpha, Gauteng</div>
                  <div><strong>Destination:</strong> Abattoir Beta, KZN</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inspection Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Inspection Details</CardTitle>
            <CardDescription>Record inspection findings and actions taken</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle-reg">Vehicle Registration</Label>
                <Input id="vehicle-reg" placeholder="Enter vehicle registration" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver-id">Driver ID/Document</Label>
                <Input id="driver-id" placeholder="ID number or license" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Inspection Location</Label>
              <Input id="location" placeholder="Highway and coordinates" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="findings">Inspection Findings</Label>
              <Textarea
                id="findings"
                placeholder="Document any issues, compliance status, or actions taken..."
                rows={4}
              />
            </div>
            <div className="flex space-x-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve & Release
              </Button>
              <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                <XCircle className="w-4 h-4 mr-2" />
                Flag & Impound
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Inspections */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Recent Inspections</CardTitle>
            <CardDescription>Inspection history and outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInspections.map((inspection) => (
                <div key={inspection.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {inspection.status === 'verified' ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      ) : (
                        <XCircle className="w-8 h-8 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{inspection.id}</p>
                      <p className="text-sm text-gray-600">{inspection.location}</p>
                      <p className="text-sm text-gray-600">{inspection.livestock}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={inspection.status === 'verified' ? 'default' : 'destructive'}>
                      {inspection.status.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">{inspection.timestamp}</p>
                    <p className="text-sm text-gray-600">{inspection.officer}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
