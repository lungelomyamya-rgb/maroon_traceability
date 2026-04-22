'use client';

import { MapPin, AlertTriangle, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardLayoutUnified as DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/userContext';


export default function SAPSHeatmapsPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const [isChecking, setIsChecking] = useState(true);
  const [timeRange, setTimeRange] = useState('30');
  const [mapView, setMapView] = useState('theft');

  useEffect(() => {
    const checkAuth = () => {
      setIsChecking(false);

      // If user is not logged in, redirect to login
      if (!currentUser) {
        router.replace('/login?redirect=/saps/heatmaps');
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

  const hotspots = [
    {
      province: 'Eastern Cape',
      thefts: 45,
      risk: 'high',
      coordinates: '-33.9608, 25.6022',
      trend: '+12%',
    },
    {
      province: 'KwaZulu-Natal',
      thefts: 38,
      risk: 'high',
      coordinates: '-28.5306, 30.8958',
      trend: '+8%',
    },
    {
      province: 'Free State',
      thefts: 29,
      risk: 'medium',
      coordinates: '-28.4541, 26.7968',
      trend: '+5%',
    },
    {
      province: 'Limpopo',
      thefts: 22,
      risk: 'medium',
      coordinates: '-23.4013, 29.4179',
      trend: '+15%',
    },
    {
      province: 'North West',
      thefts: 18,
      risk: 'low',
      coordinates: '-26.6639, 25.9442',
      trend: '-3%',
    },
  ];

  const activeAlerts = [
    {
      id: 'ALERT-2024-001',
      type: 'panic-button',
      location: 'N3 Highway, Johannesburg',
      livestock: 'Cattle transport',
      timestamp: '2024-01-15 14:30',
      status: 'active',
    },
    {
      id: 'ALERT-2024-002',
      type: 'geofence-breach',
      location: 'R61, Bloemfontein',
      livestock: 'Sheep herd',
      timestamp: '2024-01-15 11:15',
      status: 'investigating',
    },
    {
      id: 'ALERT-2024-003',
      type: 'suspicious-movement',
      location: 'N2 Highway, Port Elizabeth',
      livestock: 'Goat transport',
      timestamp: '2024-01-14 16:45',
      status: 'monitoring',
    },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertColor = (status: string) => {
    switch (status) {
    case 'active':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'investigating':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'monitoring':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <DashboardLayout
      description="View theft hotspots and real-time alerts"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="mb-4">
          <Button variant="outline" onClick={() => router.push('/saps')} className="inline-flex items-center gap-2">
            Back
          </Button>
        </div>

        {/* Map Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <MapPin className="w-5 h-5 mr-2" />
              Map Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 3 months</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Map View</label>
                <Select value={mapView} onValueChange={setMapView}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="theft">Theft Hotspots</SelectItem>
                    <SelectItem value="recovery">Recovery Zones</SelectItem>
                    <SelectItem value="patrol">Patrol Routes</SelectItem>
                    <SelectItem value="alerts">Active Alerts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Province Filter</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All provinces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ec">Eastern Cape</SelectItem>
                    <SelectItem value="kzn">KwaZulu-Natal</SelectItem>
                    <SelectItem value="fs">Free State</SelectItem>
                    <SelectItem value="lp">Limpopo</SelectItem>
                    <SelectItem value="nw">North West</SelectItem>
                    <SelectItem value="gp">Gauteng</SelectItem>
                    <SelectItem value="mp">Mpumalanga</SelectItem>
                    <SelectItem value="nc">Northern Cape</SelectItem>
                    <SelectItem value="wc">Western Cape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">South Africa Theft Heatmap</CardTitle>
            <CardDescription>
              Interactive map showing theft hotspots and active alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Interactive Map</h3>
                <p className="text-gray-500 mb-4">
                  Real-time theft heatmap would be displayed here
                </p>
                <div className="flex justify-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>High Risk</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Medium Risk</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Low Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
              Active Alerts
            </CardTitle>
            <CardDescription>
              Real-time alerts requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-shrink-0">
                      <AlertTriangle className={`w-6 h-6 sm:w-8 sm:h-8 ${
                        alert.status === 'active' ? 'text-red-600' :
                          alert.status === 'investigating' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{alert.id}</p>
                      <p className="text-sm text-gray-600">{alert.location}</p>
                      <p className="text-sm text-gray-600">{alert.livestock}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <Badge className={getAlertColor(alert.status)}>
                      {alert.status.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">{alert.timestamp}</p>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Provincial Risk Analysis</CardTitle>
              <CardDescription>Theft incidents by province</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hotspots.map((hotspot) => (
                  <div key={hotspot.province} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{hotspot.province}</p>
                        <p className="text-sm text-gray-600">{hotspot.thefts} thefts</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getRiskColor(hotspot.risk)} mb-1`}>
                        {hotspot.risk.toUpperCase()} RISK
                      </Badge>
                      <p className={`text-sm ${hotspot.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                        {hotspot.trend}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Trend Analysis</CardTitle>
              <CardDescription>Theft patterns and predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Overall Trend</p>
                    <p className="text-sm text-gray-600">Compared to last month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">+15%</p>
                    <p className="text-sm text-gray-600">Increase</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Recovery Rate</p>
                    <p className="text-sm text-gray-600">Assets successfully recovered</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">78%</p>
                    <p className="text-sm text-gray-600">Success rate</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Average Response Time</p>
                    <p className="text-sm text-gray-600">Time to respond to alerts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">24 min</p>
                    <p className="text-sm text-gray-600">Average</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
