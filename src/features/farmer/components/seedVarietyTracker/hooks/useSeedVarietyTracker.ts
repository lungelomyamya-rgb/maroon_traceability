// src/components/farmer/seedVarietyTracker/hooks/useSeedVarietyTracker.ts
'use client';

import { useState, useEffect, useMemo } from 'react';

export interface SeedVariety {
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

export interface NewSeedVariety {
  variety: string;
  brand: string;
  seedType: string;
  certification: string[];
  germinationRate: string;
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

export interface SeedVarietyTrackerState {
  seeds: SeedVariety[];
  selectedProduct: string;
  showAddForm: boolean;
  newSeed: NewSeedVariety;
  searchTerm: string;
  filterType: string;
  filterCertification: string;
  selectedSeed: SeedVariety | null;
  loading: boolean;
}

export interface SeedVarietyTrackerActions {
  setSelectedProduct: (productId: string) => void;
  setShowAddForm: (show: boolean) => void;
  setNewSeed: (seed: Partial<NewSeedVariety>) => void;
  resetNewSeed: () => void;
  handleAddSeed: () => void;
  toggleCertification: (cert: string) => void;
  toggleDiseaseResistance: (disease: string) => void;
  toggleClimate: (climate: string) => void;
  setSearchTerm: (term: string) => void;
  setFilterType: (type: string) => void;
  setFilterCertification: (cert: string) => void;
  setSelectedSeed: (seed: SeedVariety | null) => void;
  deleteSeed: (id: string) => void;
  updateSeed: (id: string, updates: Partial<SeedVariety>) => void;
}

export interface SeedVarietyTrackerComputed {
  filteredSeeds: SeedVariety[];
  statistics: {
    totalSeeds: number;
    totalVarieties: number;
    totalBrands: number;
    organicSeeds: number;
    gmoFreeSeeds: number;
    averageGerminationRate: number;
    highGerminationSeeds: number;
    certifiedSeeds: number;
  };
  seedTypes: string[];
  certifications: string[];
  brands: string[];
  topVarieties: Array<{ variety: string; count: number }>;
}

export function useSeedVarietyTracker(products: any[]) {
  // Constants
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

  // State
  const [seeds, setSeeds] = useState<SeedVariety[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSeed, setNewSeed] = useState<NewSeedVariety>({
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCertification, setFilterCertification] = useState('all');
  const [selectedSeed, setSelectedSeed] = useState<SeedVariety | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize with mock data
  useEffect(() => {
    const mockSeeds: SeedVariety[] = [
      {
        id: 'seed1',
        productId: 'PRD-001',
        variety: 'Moringa Oleifera',
        brand: 'GreenHarvest Seeds',
        seedType: 'Organic',
        certification: ['Organic Certified', 'Non-GMO Project Verified', 'High Germination Rate'],
        germinationRate: 95,
        plantingDate: '2024-03-15',
        source: 'Local Seed Bank',
        batchNumber: 'MH-2024-001',
        expiryDate: '2025-12-31',
        storageConditions: 'Cool, dry place away from direct sunlight',
        notes: 'Excellent germination rate, strong seedlings observed',
        expectedYield: '2-3 kg per plant',
        diseaseResistance: ['Blight Resistance', 'Pest Resistance'],
        climateSuitability: ['Tropical', 'Subtropical'],
        organic: true,
        gmoFree: true
      },
      {
        id: 'seed2',
        productId: 'PRD-002',
        variety: 'Moringa PKM1',
        brand: 'AgriTech Solutions',
        seedType: 'Hybrid',
        certification: ['Quality Assurance', 'High Germination Rate'],
        germinationRate: 88,
        plantingDate: '2024-03-20',
        source: 'Commercial Supplier',
        batchNumber: 'PKM-2024-042',
        expiryDate: '2025-10-15',
        storageConditions: 'Refrigerated storage recommended',
        notes: 'High-yield variety, requires regular watering',
        expectedYield: '3-4 kg per plant',
        diseaseResistance: ['Drought Tolerance', 'Heat Tolerance'],
        climateSuitability: ['Tropical', 'Arid'],
        organic: false,
        gmoFree: true
      },
      {
        id: 'seed3',
        productId: 'PRD-003',
        variety: 'Moringa Stenopetala',
        brand: 'Heirloom Gardens',
        seedType: 'Heirloom',
        certification: ['Heirloom Certified', 'Organic Certified'],
        germinationRate: 82,
        plantingDate: '2024-03-25',
        source: 'Seed Exchange Program',
        batchNumber: 'ST-2024-017',
        expiryDate: '2025-08-30',
        storageConditions: 'Dry, well-ventilated area',
        notes: 'Traditional variety, excellent flavor profile',
        expectedYield: '1.5-2 kg per plant',
        diseaseResistance: ['Fusarium Wilt Resistance', 'Virus Resistance'],
        climateSuitability: ['Temperate', 'Mediterranean'],
        organic: true,
        gmoFree: true
      }
    ];

    setSeeds(mockSeeds);
  }, []);

  // Actions
  const resetNewSeed = () => {
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
  };

  const handleAddSeed = () => {
    if (!newSeed.variety || !newSeed.brand || !newSeed.seedType || !newSeed.germinationRate) {
      return;
    }

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
    resetNewSeed();
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

  const deleteSeed = (id: string) => {
    if (window.confirm('Are you sure you want to delete this seed variety?')) {
      setSeeds(prev => prev.filter(seed => seed.id !== id));
    }
  };

  const updateSeed = (id: string, updates: Partial<SeedVariety>) => {
    setSeeds(prev => prev.map(seed => 
      seed.id === id ? { ...seed, ...updates } : seed
    ));
  };

  // Computed values
  const filteredSeeds = useMemo(() => {
    return seeds.filter(seed => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        seed.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seed.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seed.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType = filterType === 'all' || seed.seedType === filterType;

      // Certification filter
      const matchesCertification = filterCertification === 'all' || 
        seed.certification.includes(filterCertification);

      return matchesSearch && matchesType && matchesCertification;
    });
  }, [seeds, searchTerm, filterType, filterCertification]);

  const statistics = useMemo(() => {
    const totalSeeds = seeds.length;
    const totalVarieties = new Set(seeds.map(s => s.variety)).size;
    const totalBrands = new Set(seeds.map(s => s.brand)).size;
    const organicSeeds = seeds.filter(s => s.organic).length;
    const gmoFreeSeeds = seeds.filter(s => s.gmoFree).length;
    const averageGerminationRate = totalSeeds > 0 
      ? seeds.reduce((sum, s) => sum + s.germinationRate, 0) / totalSeeds 
      : 0;
    const highGerminationSeeds = seeds.filter(s => s.germinationRate >= 90).length;
    const certifiedSeeds = seeds.filter(s => s.certification.length > 0).length;

    return {
      totalSeeds,
      totalVarieties,
      totalBrands,
      organicSeeds,
      gmoFreeSeeds,
      averageGerminationRate,
      highGerminationSeeds,
      certifiedSeeds
    };
  }, [seeds]);

  const brands = useMemo(() => {
    return Array.from(new Set(seeds.map(s => s.brand)));
  }, [seeds]);

  const topVarieties = useMemo(() => {
    const varietyCounts = seeds.reduce((acc, seed) => {
      acc[seed.variety] = (acc[seed.variety] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(varietyCounts)
      .map(([variety, count]) => ({ variety, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [seeds]);

  return {
    // State
    seeds,
    selectedProduct,
    showAddForm,
    newSeed,
    searchTerm,
    filterType,
    filterCertification,
    selectedSeed,
    loading,
    
    // Constants
    seedTypes,
    certifications,
    diseaseResistanceOptions,
    climateOptions,
    
    // Computed
    filteredSeeds,
    statistics,
    brands,
    topVarieties,
    
    // Actions
    setSelectedProduct,
    setShowAddForm,
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
  };
}
