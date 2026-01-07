// src/components/farmer/fertiliserLog.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Droplets, Leaf, Calendar, AlertTriangle, TrendingUp, Plus } from 'lucide-react';

interface FertiliserApplication {
  id: string;
  productId: string;
  date: string;
  fertiliserType: string;
  brand: string;
  npkRatio: string;
  applicationMethod: string;
  quantity: number;
  unit: string;
  weather: string;
  soilMoisture: string;
  notes: string;
  nextApplication: string;
  safetyPrecautions: string[];
  organic: boolean;
}

interface FertiliserLogProps {
  products: any[];
}

export function FertiliserLog({ products }: FertiliserLogProps) {
  const [applications, setApplications] = useState<FertiliserApplication[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApplication, setNewApplication] = useState({
    fertiliserType: '',
    brand: '',
    npkRatio: '',
    applicationMethod: 'broadcast',
    quantity: '',
    unit: 'kg',
    weather: '',
    soilMoisture: '',
    notes: '',
    nextApplication: '',
    organic: false
  });

  const fertiliserTypes = [
    'Nitrogen (N)',
    'Phosphorus (P)', 
    'Potassium (K)',
    'NPK Compound',
    'Organic Compost',
    'Manure',
    'Liquid Fertiliser',
    'Slow Release',
    'Micronutrients'
  ];

  const applicationMethods = [
    'broadcast',
    'banded',
    'foliar spray',
    'drip irrigation',
    'spot treatment',
    'incorporation'
  ];

  useEffect(() => {
    // Mock data - replace with API call
    const mockApplications: FertiliserApplication[] = [
      {
        id: 'fert1',
        productId: products[0]?.id || '',
        date: '2025-01-10',
        fertiliserType: 'Organic Compost',
        brand: 'EcoGrow Organic',
        npkRatio: '2-1-2',
        applicationMethod: 'broadcast',
        quantity: 500,
        unit: 'kg',
        weather: 'Clear, 22°C',
        soilMoisture: 'Moderate',
        notes: 'Applied before planting stage, soil well prepared',
        nextApplication: '2025-02-15',
        safetyPrecautions: ['Wore gloves', 'Used protective mask', 'Washed hands after'],
        organic: true
      },
      {
        id: 'fert2',
        productId: products[0]?.id || '',
        date: '2025-02-01',
        fertiliserType: 'NPK Compound',
        brand: 'GrowMaster',
        npkRatio: '20-20-20',
        applicationMethod: 'banded',
        quantity: 50,
        unit: 'kg',
        weather: 'Partly cloudy, 18°C',
        soilMoisture: 'Good',
        notes: 'Applied during vegetative stage for boost growth',
        nextApplication: '2025-03-01',
        safetyPrecautions: ['Wore PPE', 'Applied in morning', 'Avoided wind drift'],
        organic: false
      }
    ];

    setApplications(mockApplications);
    if (products.length > 0) {
      setSelectedProduct(products[0].id);
    }
  }, [products]);

  const handleAddApplication = () => {
    const applicationData: FertiliserApplication = {
      id: `fert${Date.now()}`,
      productId: selectedProduct,
      date: new Date().toISOString().split('T')[0],
      fertiliserType: newApplication.fertiliserType,
      brand: newApplication.brand,
      npkRatio: newApplication.npkRatio,
      applicationMethod: newApplication.applicationMethod,
      quantity: parseFloat(newApplication.quantity),
      unit: newApplication.unit,
      weather: newApplication.weather,
      soilMoisture: newApplication.soilMoisture,
      notes: newApplication.notes,
      nextApplication: newApplication.nextApplication,
      safetyPrecautions: ['Wore PPE'],
      organic: newApplication.organic
    };

    setApplications([...applications, applicationData]);
    setNewApplication({
      fertiliserType: '',
      brand: '',
      npkRatio: '',
      applicationMethod: 'broadcast',
      quantity: '',
      unit: 'kg',
      weather: '',
      soilMoisture: '',
      notes: '',
      nextApplication: '',
      organic: false
    });
    setShowAddForm(false);
  };

  const getNPKColor = (npk: string) => {
    const [n, p, k] = npk.split('-').map(Number);
    if (n > 20) return 'success' as const;
    if (p > 20) return 'info' as const;
    if (k > 20) return 'warning' as const;
    return 'secondary' as const;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Fertiliser Application Log</h2>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green hover:bg-green-hover text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Log Application
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Record Fertiliser Application</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fertiliser Type</label>
              <select
                value={newApplication.fertiliserType}
                onChange={(e) => setNewApplication({...newApplication, fertiliserType: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select type</option>
                {fertiliserTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <Input
                value={newApplication.brand}
                onChange={(e) => setNewApplication({...newApplication, brand: e.target.value})}
                placeholder="Brand name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NPK Ratio</label>
              <Input
                value={newApplication.npkRatio}
                onChange={(e) => setNewApplication({...newApplication, npkRatio: e.target.value})}
                placeholder="e.g., 20-20-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Method</label>
              <select
                value={newApplication.applicationMethod}
                onChange={(e) => setNewApplication({...newApplication, applicationMethod: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {applicationMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={newApplication.quantity}
                  onChange={(e) => setNewApplication({...newApplication, quantity: e.target.value})}
                  placeholder="Amount"
                />
                <select
                  value={newApplication.unit}
                  onChange={(e) => setNewApplication({...newApplication, unit: e.target.value})}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="L">L</option>
                  <option value="mL">mL</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Application</label>
              <Input
                type="date"
                value={newApplication.nextApplication}
                onChange={(e) => setNewApplication({...newApplication, nextApplication: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weather Conditions</label>
              <Input
                value={newApplication.weather}
                onChange={(e) => setNewApplication({...newApplication, weather: e.target.value})}
                placeholder="e.g., Clear, 22°C"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soil Moisture</label>
              <select
                value={newApplication.soilMoisture}
                onChange={(e) => setNewApplication({...newApplication, soilMoisture: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select moisture level</option>
                <option value="Dry">Dry</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="Good">Good</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newApplication.organic}
                  onChange={(e) => setNewApplication({...newApplication, organic: e.target.checked})}
                />
                <span className="text-sm font-medium text-gray-700">Organic Fertiliser</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <Textarea
                value={newApplication.notes}
                onChange={(e) => setNewApplication({...newApplication, notes: e.target.value})}
                rows={3}
                placeholder="Application notes and observations"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddApplication}>
              Save Application
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {applications.map((application) => (
          <Card key={application.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Droplets className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{application.fertiliserType}</h3>
                  <p className="text-sm text-gray-500">{application.brand}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {application.organic && (
                  <Badge className="bg-green-100 text-green-800">
                    <Leaf className="h-3 w-3 mr-1" />
                    Organic
                  </Badge>
                )}
                <Badge variant={getNPKColor(application.npkRatio)}>
                  NPK: {application.npkRatio}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Date:</span>
                <span className="ml-2 font-medium">{application.date}</span>
              </div>
              <div>
                <span className="text-gray-600">Quantity:</span>
                <span className="ml-2 font-medium">{application.quantity} {application.unit}</span>
              </div>
              <div>
                <span className="text-gray-600">Method:</span>
                <span className="ml-2 font-medium capitalize">{application.applicationMethod}</span>
              </div>
              <div>
                <span className="text-gray-600">Next:</span>
                <span className="ml-2 font-medium">{application.nextApplication}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Weather: {application.weather}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Droplets className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Soil Moisture: {application.soilMoisture}</span>
              </div>
            </div>

            {application.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{application.notes}</p>
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Safety Precautions</p>
                  <ul className="text-sm text-blue-700 mt-1">
                    {application.safetyPrecautions.map((precaution, index) => (
                      <li key={index}>• {precaution}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                View Impact
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-1" />
                Schedule Next
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
