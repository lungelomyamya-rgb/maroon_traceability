// src/components/marketplace/searchAndFilter.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  X,
  SlidersHorizontal
} from 'lucide-react';
import { Product } from '@/constants/marketplaceData';

interface SearchAndFilterProps {
  products: Product[];
  onFilter: (filteredProducts: Product[]) => void;
}

export default function SearchAndFilter({ products, onFilter }: SearchAndFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const grades = ['all', 'A', 'B', 'C'];

  const applyFilters = () => {
    let filtered = products.filter(product => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.farmer.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      // Grade filter
      const matchesGrade = selectedGrade === 'all' || product.quality.grade === selectedGrade;

      // Price range filter
      let matchesPrice = true;
      if (priceRange === '0-50') {
        matchesPrice = product.price <= 50;
      } else if (priceRange === '50-100') {
        matchesPrice = product.price > 50 && product.price <= 100;
      } else if (priceRange === '100-200') {
        matchesPrice = product.price > 100 && product.price <= 200;
      } else if (priceRange === '200+') {
        matchesPrice = product.price > 200;
      }

      return matchesSearch && matchesCategory && matchesGrade && matchesPrice;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.farmer.rating - a.farmer.rating;
        case 'discount':
          return (b.discount || 0) - (a.discount || 0);
        default:
          return 0;
      }
    });

    onFilter(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedGrade('all');
    setPriceRange('all');
    setSortBy('name');
    onFilter(products);
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || 
    selectedGrade !== 'all' || priceRange !== 'all';

  // Apply filters whenever filter values change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, selectedGrade, priceRange, sortBy, products]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search products, farmers, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-11 text-sm sm:text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="h-11 px-4 sm:px-6 text-sm sm:text-base border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Filters</span>
            <span className="sm:hidden">Filter</span>
            {hasActiveFilters && (
              <Badge className="ml-2 bg-green-600 text-white text-xs">
                {[selectedCategory, selectedGrade, priceRange].filter(f => f !== 'all').length + (searchTerm ? 1 : 0)}
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-11 px-4 sm:px-6 text-sm sm:text-base hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Clear</span>
              <span className="sm:hidden">Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-t pt-4 sm:pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grade Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quality Grade
              </label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map(grade => (
                    <SelectItem key={grade} value={grade}>
                      {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price Range
              </label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-50">R0 - R50</SelectItem>
                  <SelectItem value="50-100">R50 - R100</SelectItem>
                  <SelectItem value="100-200">R100 - R200</SelectItem>
                  <SelectItem value="200+">R200+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-2 xl:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quick Actions
              </label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedGrade('all');
                    setPriceRange('all');
                    setSortBy('name');
                  }}
                  className="flex-1 h-10 text-xs sm:text-sm border-gray-300 hover:border-green-500 hover:bg-green-50"
                >
                  Reset All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedGrade('A');
                    setSortBy('rating');
                  }}
                  className="flex-1 h-10 text-xs sm:text-sm border-gray-300 hover:border-green-500 hover:bg-green-50"
                >
                  Best Quality
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 sm:mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">Active Filters</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 px-3 text-xs hover:bg-red-50 hover:text-red-600"
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 transition-colors">
                    Search: "{searchTerm}"
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-600" 
                      onClick={() => setSearchTerm('')}
                    />
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 transition-colors">
                    Category: {selectedCategory}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-600" 
                      onClick={() => setSelectedCategory('all')}
                    />
                  </Badge>
                )}
                {selectedGrade !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 transition-colors">
                    Grade: {selectedGrade}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-600" 
                      onClick={() => setSelectedGrade('all')}
                    />
                  </Badge>
                )}
                {priceRange !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 transition-colors">
                    Price: {priceRange === '0-50' ? 'R0-R50' :
                            priceRange === '50-100' ? 'R50-R100' :
                            priceRange === '100-200' ? 'R100-R200' : 'R200+'}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-600" 
                      onClick={() => setPriceRange('all')}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
