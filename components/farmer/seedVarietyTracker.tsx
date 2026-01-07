// src/components/farmer/seedVarietyTracker.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Package, Award, FileText, Calendar, AlertTriangle, CheckCircle, Plus } from 'lucide-react';

interface SeedVariety {
  id: string;
  productId: string;
  variety: string;
  brand: string;
  seedType: string;
  certification: string[];
  germinationRate: number;
  plantingDate: string;
  source: string;
  batchNumber: string;
  expiryDate: string;
  storageConditions: string;
  notes: string;
  expectedYield: string;
  diseaseResistance: string[];
  climateSuitability: string[];
  organic: boolean;
  gmoFree: boolean;
}

interface SeedVarietyTrackerProps {
  products: any[];
}

export function SeedVarietyTracker({ products }: SeedVarietyTrackerProps) {
  const [seeds, setSeeds] = useState<SeedVariety[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSeed, setNewSeed] = useState({
    variety: '',
    brand: '',
    seedType: '',
    certification: [] as string[],
    germinationRate: '',
    source: '',
    batchNumber: '',
    expiryDate: '',
    storageConditions: '',
    notes: '',
    expectedYield: '',
    diseaseResistance: [] as string[],
    climateSuitability: [] as string[],
    organic: false,
    gmoFree: true
  });

  const seedTypes = [
    'Heirloom',
    'Hybrid',
    'Open-Pollinated',
    'Organic',
    'GMO-Free',
    'Treated',
    'Untreated',
    'Pelleted'
  ];

  const certifications = [
    'Organic Certified',
    'Non-GMO Project Verified',
    'Heirloom Certified',
    'Quality Assurance',
    'Disease-Free Certified',
    'High Germination Rate',
    'Sustainably Grown'
  ];

  const diseaseResistanceOptions = [
    'Blight Resistance',
    'Powdery Mildew Resistance',
    'Fusarium Wilt Resistance',
    'Virus Resistance',
    'Pest Resistance',
    'Drought Tolerance',
    'Heat Tolerance'
  ];

  const climateOptions = [
    'Tropical',
    'Subtropical',
    'Temperate',
    'Arid',
    'Mediterranean',
    'Continental'
  ];

  useEffect(() => {
    // Mock data - replace with API call
    const mockSeeds: SeedVariety[] = [
      {
        id: 'seed1',
        productId: products[0]?.id || '',
        variety: 'Celebrity Tomato',
        brand: 'Burpee',
        seedType: 'Hybrid',
        certification: ['Disease-Free Certified', 'High Germination Rate'],
        germinationRate: 95,
        plantingDate: '2025-01-05',
        source: 'Burpee Seed Company',
        batchNumber: 'BT-CELEB-2024-001',
        expiryDate: '2026-12-31',
        storageConditions: 'Cool, dry place. Refrigerate after opening.',
        notes: 'Disease-resistant variety, excellent for fresh market',
        expectedYield: '8-10 kg per plant',
        diseaseResistance: ['Blight Resistance', 'Fusarium Wilt Resistance'],
        climateSuitability: ['Temperate', 'Subtropical'],
        organic: false,
        gmoFree: true
      },
      {
        id: 'seed2',
        productId: products[0]?.id || '',
        variety: 'Brandywine Heirloom',
        brand: 'Baker Creek',
        seedType: 'Heirloom',
        certification: ['Organic Certified', 'Non-GMO Project Verified', 'Heirloom Certified'],
        germinationRate: 85,
        plantingDate: '2025-01-10',
        source: 'Baker Creek Heirloom Seeds',
        batchNumber: 'BC-BRANDY-2024-002',
        expiryDate: '2026-06-30',
        storageConditions: 'Cool, dark, dry place',
        notes: 'Classic heirloom variety, exceptional flavor',
        expectedYield: '6-8 kg per plant',
        diseaseResistance: ['Heat Tolerance'],
        climateSuitability: ['Temperate', 'Mediterranean'],
        organic: true,
        gmoFree: true
      }
    ];

    setSeeds(mockSeeds);
    if (products.length > 0) {
      setSelectedProduct(products[0].id);
    }
  }, [products]);

  const handleAddSeed = () => {
    const seedData: SeedVariety = {
      id: `seed${Date.now()}`,
      productId: selectedProduct,
      variety: newSeed.variety,
      brand: newSeed.brand,
      seedType: newSeed.seedType,
      certification: newSeed.certification,
      germinationRate: parseFloat(newSeed.germinationRate),
      plantingDate: new Date().toISOString().split('T')[0],
      source: newSeed.source,
      batchNumber: newSeed.batchNumber,
      expiryDate: newSeed.expiryDate,
      storageConditions: newSeed.storageConditions,
      notes: newSeed.notes,
      expectedYield: newSeed.expectedYield,
      diseaseResistance: newSeed.diseaseResistance,
      climateSuitability: newSeed.climateSuitability,
      organic: newSeed.organic,
      gmoFree: newSeed.gmoFree
    };

    setSeeds([...seeds, seedData]);
    setNewSeed({
      variety: '',
      brand: '',
      seedType: '',
      certification: [],
      germinationRate: '',
      source: '',
      batchNumber: '',
      expiryDate: '',
      storageConditions: '',
      notes: '',
      expectedYield: '',
      diseaseResistance: [],
      climateSuitability: [],
      organic: false,
      gmoFree: true
    });
    setShowAddForm(false);
  };

  const toggleCertification = (cert: string) => {
    setNewSeed(prev => ({
      ...prev,
      certification: prev.certification.includes(cert)
        ? prev.certification.filter(c => c !== cert)
        : [...prev.certification, cert]
    }));
  };

  const toggleDiseaseResistance = (disease: string) => {
    setNewSeed(prev => ({
      ...prev,
      diseaseResistance: prev.diseaseResistance.includes(disease)
        ? prev.diseaseResistance.filter(d => d !== disease)
        : [...prev.diseaseResistance, disease]
    }));
  };

  const toggleClimate = (climate: string) => {
    setNewSeed(prev => ({
      ...prev,
      climateSuitability: prev.climateSuitability.includes(climate)
        ? prev.climateSuitability.filter(c => c !== climate)
        : [...prev.climateSuitability, climate]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Seed Variety & Certification Tracking</h2>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green hover:bg-green-hover text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Seed Variety
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Add New Seed Variety</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variety Name</label>
              <Input
                value={newSeed.variety}
                onChange={(e) => setNewSeed({...newSeed, variety: e.target.value})}
                placeholder="e.g., Celebrity Tomato"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand/Supplier</label>
              <Input
                value={newSeed.brand}
                onChange={(e) => setNewSeed({...newSeed, brand: e.target.value})}
                placeholder="Seed company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seed Type</label>
              <select
                value={newSeed.seedType}
                onChange={(e) => setNewSeed({...newSeed, seedType: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select type</option>
                {seedTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Germination Rate (%)</label>
              <Input
                type="number"
                value={newSeed.germinationRate}
                onChange={(e) => setNewSeed({...newSeed, germinationRate: e.target.value})}
                placeholder="e.g., 95"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <Input
                value={newSeed.source}
                onChange={(e) => setNewSeed({...newSeed, source: e.target.value})}
                placeholder="Seed supplier"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
              <Input
                value={newSeed.batchNumber}
                onChange={(e) => setNewSeed({...newSeed, batchNumber: e.target.value})}
                placeholder="Batch identifier"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <Input
                type="date"
                value={newSeed.expiryDate}
                onChange={(e) => setNewSeed({...newSeed, expiryDate: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Yield</label>
              <Input
                value={newSeed.expectedYield}
                onChange={(e) => setNewSeed({...newSeed, expectedYield: e.target.value})}
                placeholder="e.g., 8-10 kg per plant"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Storage Conditions</label>
              <Textarea
                value={newSeed.storageConditions}
                onChange={(e) => setNewSeed({...newSeed, storageConditions: e.target.value})}
                rows={2}
                placeholder="Storage requirements"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
              <div className="flex flex-wrap gap-2">
                {certifications.map(cert => (
                  <label key={cert} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={newSeed.certification.includes(cert)}
                      onChange={() => toggleCertification(cert)}
                    />
                    <span className="text-sm">{cert}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Disease Resistance</label>
              <div className="flex flex-wrap gap-2">
                {diseaseResistanceOptions.map(disease => (
                  <label key={disease} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={newSeed.diseaseResistance.includes(disease)}
                      onChange={() => toggleDiseaseResistance(disease)}
                    />
                    <span className="text-sm">{disease}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Climate Suitability</label>
              <div className="flex flex-wrap gap-2">
                {climateOptions.map(climate => (
                  <label key={climate} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={newSeed.climateSuitability.includes(climate)}
                      onChange={() => toggleClimate(climate)}
                    />
                    <span className="text-sm">{climate}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newSeed.organic}
                  onChange={(e) => setNewSeed({...newSeed, organic: e.target.checked})}
                />
                <span className="text-sm font-medium text-gray-700">Organic Certified</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newSeed.gmoFree}
                  onChange={(e) => setNewSeed({...newSeed, gmoFree: e.target.checked})}
                />
                <span className="text-sm font-medium text-gray-700">GMO-Free</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <Textarea
                value={newSeed.notes}
                onChange={(e) => setNewSeed({...newSeed, notes: e.target.value})}
                rows={3}
                placeholder="Additional notes about this seed variety"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSeed}>
              Save Seed Variety
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {seeds.map((seed) => (
          <Card key={seed.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{seed.variety}</h3>
                  <p className="text-sm text-gray-500">{seed.brand}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {seed.organic && (
                  <Badge variant="success">
                    <Award className="h-3 w-3 mr-1" />
                    Organic
                  </Badge>
                )}
                {seed.gmoFree && (
                  <Badge variant="info">
                    Non-GMO
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <Badge variant="outline">{seed.seedType}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Germination Rate:</span>
                <span className="font-medium">{seed.germinationRate}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expected Yield:</span>
                <span className="font-medium">{seed.expectedYield}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Planted: {seed.plantingDate}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Batch: {seed.batchNumber}</span>
              </div>
            </div>

            {seed.certification.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Certifications:</p>
                <div className="flex flex-wrap gap-1">
                  {seed.certification.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {seed.diseaseResistance.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Disease Resistance:</p>
                <div className="flex flex-wrap gap-1">
                  {seed.diseaseResistance.map((disease, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {disease}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Storage</p>
                  <p className="text-sm text-yellow-700">{seed.storageConditions}</p>
                </div>
              </div>
            </div>

            {seed.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{seed.notes}</p>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                View Certificate
              </Button>
              <Button variant="outline" size="sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                Verify Batch
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
