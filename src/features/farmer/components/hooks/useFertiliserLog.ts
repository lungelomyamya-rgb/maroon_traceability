// src/components/farmer/fertiliserLog/hooks/useFertiliserLog.ts
'use client';

import { useState, useEffect, useMemo } from 'react';

export interface FertiliserApplication {
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

export interface NewFertiliserApplication {
  fertiliserType: string;
  brand: string;
  npkRatio: string;
  applicationMethod: string;
  quantity: string;
  unit: string;
  weather: string;
  soilMoisture: string;
  notes: string;
  nextApplication: string;
  safetyPrecautions: string[];
  organic: boolean;
}

export interface FertiliserLogState {
  applications: FertiliserApplication[];
  selectedProduct: string;
  showAddForm: boolean;
  newApplication: NewFertiliserApplication;
  searchTerm: string;
  typeFilter: string;
  methodFilter: string;
  organicFilter: string;
  loading: boolean;
}

export interface FertiliserLogActions {
  setSelectedProduct: (productId: string) => void;
  setShowAddForm: (show: boolean) => void;
  setNewApplication: (app: Partial<NewFertiliserApplication>) => void;
  resetNewApplication: () => void;
  handleAddApplication: () => void;
  handleDeleteApplication: (id: string) => void;
  handleEditApplication: (id: string, app: Partial<FertiliserApplication>) => void;
  setSearchTerm: (term: string) => void;
  setTypeFilter: (type: string) => void;
  setMethodFilter: (method: string) => void;
  setOrganicFilter: (organic: string) => void;
  toggleSafetyPrecaution: (precaution: string) => void;
  getNPKColor: (npk: string) => 'success' | 'info' | 'warning' | 'secondary';
}

export interface FertiliserLogComputed {
  filteredApplications: FertiliserApplication[];
  statistics: {
    totalApplications: number;
    organicApplications: number;
    totalQuantity: number;
    averageQuantity: number;
    applicationsThisMonth: number;
    upcomingApplications: number;
    fertilizerTypeDistribution: Record<string, number>;
    methodDistribution: Record<string, number>;
    npkDistribution: Record<string, number>;
  };
  fertiliserTypes: string[];
  applicationMethods: string[];
  brands: string[];
  topProducts: Array<{ productId: string; count: number }>;
}

export function useFertiliserLog(products: any[]) {
  // State
  const [applications, setApplications] = useState<FertiliserApplication[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApplication, setNewApplication] = useState<NewFertiliserApplication>({
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
    safetyPrecautions: [],
    organic: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [organicFilter, setOrganicFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Constants
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

  // Mock data initialization
  useEffect(() => {
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
        quantity: 250,
        unit: 'kg',
        weather: 'Partly cloudy, 18°C',
        soilMoisture: 'High',
        notes: 'Applied during vegetative growth stage',
        nextApplication: '2025-02-20',
        safetyPrecautions: ['Wore protective equipment', 'Applied in early morning'],
        organic: false
      },
      {
        id: 'fert3',
        productId: products[1]?.id || '',
        date: '2025-02-15',
        fertiliserType: 'Liquid Fertilizer',
        brand: 'AquaFeed',
        npkRatio: '10-5-15',
        applicationMethod: 'foliar spray',
        quantity: 100,
        unit: 'L',
        weather: 'Sunny, 25°C',
        soilMoisture: 'Low',
        notes: 'Foliar spray for leaf application',
        nextApplication: '2025-03-01',
        safetyPrecautions: ['Used protective mask', 'Avoided windy conditions'],
        organic: false
      },
      {
        id: 'fert4',
        productId: products[2]?.id || '',
        date: '2025-03-01',
        fertiliserType: 'Micronutrients',
        brand: 'MicroBoost',
        npkRatio: '5-3-8',
        applicationMethod: 'drip irrigation',
        quantity: 50,
        unit: 'kg',
        weather: 'Cloudy, 20°C',
        soilMoisture: 'Moderate',
        notes: 'Applied through irrigation system',
        nextApplication: '2025-03-15',
        safetyPrecautions: ['Checked system compatibility', 'Monitored pH levels'],
        organic: true
      },
      {
        id: 'fert5',
        productId: products[0]?.id || '',
        date: '2025-03-15',
        fertiliserType: 'Manure',
        brand: 'FarmFresh',
        npkRatio: '1-1-1',
        applicationMethod: 'incorporation',
        quantity: 750,
        unit: 'kg',
        weather: 'Overcast, 16°C',
        soilMoisture: 'High',
        notes: 'Incorporated into soil before planting',
        nextApplication: '2025-04-01',
        safetyPrecautions: ['Wore protective clothing', 'Used proper tools'],
        organic: true
      }
    ];

    setApplications(mockApplications);
  }, [products]);

  // Actions
  const resetNewApplication = () => {
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
      safetyPrecautions: [],
      organic: false
    });
  };

  const handleAddApplication = () => {
    if (!newApplication.fertiliserType || !newApplication.brand || !newApplication.quantity) {
      return;
    }

    try {
      setLoading(true);

      const applicationData: FertiliserApplication = {
        id: `fert-${Date.now()}`,
        productId: selectedProduct || products[0]?.id || '',
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
        safetyPrecautions: [...(newApplication.safetyPrecautions || [])],
        organic: newApplication.organic
      };

      setApplications(prev => [...prev, applicationData]);
      resetNewApplication();
      setShowAddForm(false);

    } catch (error) {
      console.error('Failed to add fertilizer application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplication = (id: string) => {
    if (window.confirm('Are you sure you want to delete this fertilizer application?')) {
      setApplications(prev => prev.filter(app => app.id !== id));
    }
  };

  const handleEditApplication = (id: string, updates: Partial<FertiliserApplication>) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, ...updates } : app
    ));
  };

  const toggleSafetyPrecaution = (precaution: string) => {
    setNewApplication(prev => ({
      ...prev,
      safetyPrecautions: prev.safetyPrecautions.includes(precaution)
        ? prev.safetyPrecautions.filter((p: string) => p !== precaution)
        : [...prev.safetyPrecautions, precaution]
    }));
  };

  const getNPKColor = (npk: string): 'success' | 'info' | 'warning' | 'secondary' => {
    const [n, p, k] = npk.split('-').map(Number);
    if (n > 20) return 'success';
    if (p > 20) return 'info';
    if (k > 20) return 'warning';
    return 'secondary';
  };

  // Computed values
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        app.fertiliserType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.notes.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType = typeFilter === 'all' || app.fertiliserType === typeFilter;

      // Method filter
      const matchesMethod = methodFilter === 'all' || app.applicationMethod === methodFilter;

      // Organic filter
      const matchesOrganic = organicFilter === 'all' || 
        (organicFilter === 'organic' && app.organic) ||
        (organicFilter === 'conventional' && !app.organic);

      return matchesSearch && matchesType && matchesMethod && matchesOrganic;
    });
  }, [applications, searchTerm, typeFilter, methodFilter, organicFilter]);

  const statistics = useMemo(() => {
    const totalApplications = applications.length;
    const organicApplications = applications.filter(app => app.organic).length;
    const totalQuantity = applications.reduce((sum, app) => sum + app.quantity, 0);
    const averageQuantity = totalApplications > 0 ? totalQuantity / totalApplications : 0;
    
    // Applications this month
    const currentMonth = new Date().toISOString().slice(0, 7);
    const applicationsThisMonth = applications.filter(app => app.date.startsWith(currentMonth)).length;
    
    // Upcoming applications (next application date is in the future)
    const today = new Date().toISOString().slice(0, 10);
    const upcomingApplications = applications.filter(app => app.nextApplication > today).length;

    // Fertilizer type distribution
    const fertilizerTypeDistribution = fertiliserTypes.reduce((acc, type) => {
      acc[type] = applications.filter(app => app.fertiliserType === type).length;
      return acc;
    }, {} as Record<string, number>);

    // Method distribution
    const methodDistribution = applicationMethods.reduce((acc, method) => {
      acc[method] = applications.filter(app => app.applicationMethod === method).length;
      return acc;
    }, {} as Record<string, number>);

    // NPK distribution
    const npkDistribution = applications.reduce((acc, app) => {
      const npk = app.npkRatio || 'unknown';
      acc[npk] = (acc[npk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top products
    const topProducts = applications.reduce((acc, app) => {
      acc[app.productId] = (acc[app.productId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
    totalApplications,
    organicApplications,
    totalQuantity,
    averageQuantity,
    applicationsThisMonth,
    upcomingApplications,
    fertilizerTypeDistribution,
    methodDistribution,
    npkDistribution
  };
}, [applications, fertiliserTypes, applicationMethods]);

  const brands = useMemo(() => {
    return Array.from(new Set(applications.map(s => s.brand))).filter(Boolean);
  }, [applications]);

  const topProducts = useMemo(() => {
    const productCounts = applications.reduce((acc, app) => {
      acc[app.productId] = (acc[app.productId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(productCounts)
      .map(([productId, count]) => ({ productId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [applications]);

  return {
    // State
    applications,
    selectedProduct,
    showAddForm,
    newApplication,
    searchTerm,
    typeFilter,
    methodFilter,
    organicFilter,
    loading,
    
    // Constants
    fertiliserTypes,
    applicationMethods,
    brands,
    
    // Computed
    filteredApplications,
    statistics,
    topProducts,
    
    // Actions
    setSelectedProduct,
    setShowAddForm,
    setNewApplication,
    resetNewApplication,
    handleAddApplication,
    handleDeleteApplication,
    handleEditApplication,
    setSearchTerm,
    setTypeFilter,
    setMethodFilter,
    setOrganicFilter,
    toggleSafetyPrecaution,
    getNPKColor
  };
}
