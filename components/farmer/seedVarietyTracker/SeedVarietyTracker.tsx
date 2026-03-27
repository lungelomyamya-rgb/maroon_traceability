// src/components/farmer/seedVarietyTracker/SeedVarietyTracker.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useSeedVarietyTracker } from './hooks/useSeedVarietyTracker';
import { VarietyOverview } from './VarietyOverview';
import { VarietyList } from './VarietyList';
import { VarietyDetails } from './VarietyDetails';

interface SeedVarietyTrackerProps {
  products: any[];
}

export function SeedVarietyTracker({ products }: SeedVarietyTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const {
    seeds,
    selectedProduct,
    newSeed,
    searchTerm,
    filterType,
    filterCertification,
    selectedSeed,
    seedTypes,
    certifications,
    filteredSeeds,
    statistics,
    brands,
    topVarieties,
    setSelectedProduct,
    setShowAddForm: setHookShowAddForm,
    setNewSeed,
    resetNewSeed,
    handleAddSeed,
    toggleCertification,
    toggleDiseaseResistance,
    toggleClimate,
    setSearchTerm,
    setFilterType,
    setFilterCertification,
    setSelectedSeed,
    deleteSeed,
    updateSeed
  } = useSeedVarietyTracker(products);

  const handleShowAddForm = () => {
    setShowAddForm(true);
    setHookShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    setHookShowAddForm(false);
    resetNewSeed();
  };

  const handleAddSeedSubmit = () => {
    handleAddSeed();
    handleCloseAddForm();
  };

  const handleViewSeed = (seed: any) => {
    setSelectedSeed(seed);
  };

  const handleCloseDetails = () => {
    setSelectedSeed(null);
  };

  const handleUpdateSeed = (id: string, updates: any) => {
    updateSeed(id, updates);
  };

  const handleDeleteSeed = (id: string) => {
    deleteSeed(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Seed Variety Tracker</h2>
            <p className="text-gray-600">Track and manage your seed varieties with detailed information</p>
          </div>
          <Button onClick={handleShowAddForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Seed
          </Button>
        </div>
      </Card>

      {/* Overview Section */}
      <VarietyOverview
        statistics={statistics}
        topVarieties={topVarieties}
        onAddNewSeed={handleShowAddForm}
      />

      {/* List Section */}
      <VarietyList
        filteredSeeds={filteredSeeds}
        searchTerm={searchTerm}
        filterType={filterType}
        filterCertification={filterCertification}
        seedTypes={seedTypes}
        certifications={certifications}
        onSearchTerm={setSearchTerm}
        onFilterType={setFilterType}
        onFilterCertification={setFilterCertification}
        onViewSeed={handleViewSeed}
        onEditSeed={handleViewSeed}
        onDeleteSeed={(seed) => handleDeleteSeed(seed.id)}
        onAddNewSeed={handleShowAddForm}
      />

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add New Seed Variety</h3>
                <Button variant="outline" onClick={handleCloseAddForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Variety *</label>
                    <Input
                      value={newSeed.variety}
                      onChange={(e) => setNewSeed({ ...newSeed, variety: e.target.value })}
                      placeholder="e.g., Moringa Oleifera"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                    <Input
                      value={newSeed.brand}
                      onChange={(e) => setNewSeed({ ...newSeed, brand: e.target.value })}
                      placeholder="e.g., GreenHarvest Seeds"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seed Type *</label>
                    <select
                      value={newSeed.seedType}
                      onChange={(e) => setNewSeed({ ...newSeed, seedType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select type</option>
                      {seedTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Germination Rate (%) *</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newSeed.germinationRate}
                      onChange={(e) => setNewSeed({ ...newSeed, germinationRate: e.target.value })}
                      placeholder="e.g., 95"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                    <Input
                      value={newSeed.source}
                      onChange={(e) => setNewSeed({ ...newSeed, source: e.target.value })}
                      placeholder="e.g., Local Seed Bank"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                    <Input
                      value={newSeed.batchNumber}
                      onChange={(e) => setNewSeed({ ...newSeed, batchNumber: e.target.value })}
                      placeholder="e.g., MH-2024-001"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Yield</label>
                    <Input
                      value={newSeed.expectedYield}
                      onChange={(e) => setNewSeed({ ...newSeed, expectedYield: e.target.value })}
                      placeholder="e.g., 2-3 kg per plant"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <Input
                      type="date"
                      value={newSeed.expiryDate}
                      onChange={(e) => setNewSeed({ ...newSeed, expiryDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Storage Conditions</label>
                    <Textarea
                      value={newSeed.storageConditions}
                      onChange={(e) => setNewSeed({ ...newSeed, storageConditions: e.target.value })}
                      placeholder="e.g., Cool, dry place away from direct sunlight"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <Textarea
                      value={newSeed.notes}
                      onChange={(e) => setNewSeed({ ...newSeed, notes: e.target.value })}
                      placeholder="Additional notes about this seed variety"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={handleCloseAddForm}>
                  Cancel
                </Button>
                <Button onClick={handleAddSeedSubmit}>
                  Add Seed
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <VarietyDetails
        selectedSeed={selectedSeed}
        onClose={handleCloseDetails}
        onUpdate={handleUpdateSeed}
        onDelete={handleDeleteSeed}
      />
    </div>
  );
}
