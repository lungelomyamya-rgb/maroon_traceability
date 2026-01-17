// src/components/layout/navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, ChevronDown, Calendar, Sprout, Droplets, Package, Shield as ShieldIcon, Truck, MapPin, Clock, FileText, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getRoleColors, textColors } from '@/lib/theme/colors';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/contexts/userContext';
import { DEMO_USERS } from '@/constants/users';
import { getAssetPath } from '@/lib/utils/assetPath';
import { rolePermissionsService } from '@/services/rolePermissionsService';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, switchUser } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Handle desktop dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      
      // Handle mobile dropdown
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setIsMobileDropdownOpen(false);
      }
    };

    // Add both mouse and touch event listeners for better mobile support
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Hide navigation on login page
  if (pathname === '/login') {
    return null;
  }

  // Page type detection
  const cleanPathname = pathname?.replace(/\/+$/, '') || '';
  const isPublicPage = cleanPathname === '/marketplace';
  const isTracePage = cleanPathname.startsWith('/public-access/trace/');
  const isPublicAccessPage = cleanPathname === '/public-access';
  const isFarmerPage = cleanPathname.startsWith('/farmer');
  const isLogisticsPage = cleanPathname.startsWith('/logistics');
  const isInspectorPage = cleanPathname.startsWith('/inspector');
  const isPackagingPage = cleanPathname.startsWith('/packaging');

  // Logistics-specific navigation items
  const getLogisticsNavigationItems = () => {
    const logisticsTabs = [
      { name: 'Overview', href: '/logistics', description: 'Logistics dashboard and metrics' },
      { name: 'Vehicles', href: '/logistics/vehicles', description: 'Manage vehicle fleet and maintenance' },
      { name: 'Drivers', href: '/logistics/drivers', description: 'Driver profiles and assignments' },
      { name: 'Scheduling', href: '/logistics/scheduling', description: 'Transport scheduling and routes' },
      { name: 'Documentation', href: '/logistics/documentation', description: 'Bills of lading and delivery docs' },
      { name: 'Events', href: '/logistics/events', description: 'Logistics events and activities' }
    ];

    return logisticsTabs.map(tab => ({
      ...tab,
      current: cleanPathname === tab.href || (tab.href === '/logistics' && cleanPathname === '/logistics')
    }));
  };
  const getFarmerNavigationItems = () => {
    const farmerTabs = [
      { name: 'Event Management', href: '/farmer/dashboard', description: 'Add planting, growth, harvest events' },
      { name: 'Growth Monitoring', href: '/farmer/growth', description: 'Track plant development stages' },
      { name: 'Fertiliser Logs', href: '/farmer/fertiliser', description: 'Record nutrient applications' },
      { name: 'Seed Varieties', href: '/farmer/seeds', description: 'Manage seed certifications' },
      { name: 'Compliance', href: '/farmer/compliance', description: 'Food safety and export compliance' }
    ];

    return farmerTabs.map(tab => ({
      ...tab,
      current: cleanPathname === tab.href || (tab.href === '/farmer/dashboard' && cleanPathname === '/farmer')
    }));
  };

  // Inspector-specific navigation items
  const getInspectorNavigationItems = () => {
    const inspectorTabs = [
      { name: 'Overview', href: '/inspector', description: 'Inspector dashboard and metrics' },
      { name: 'Inspections', href: '/inspector/inspections', description: 'Quality inspections and assessments' },
      { name: 'Verification', href: '/inspector/verification', description: 'Third-party verification requests' },
      { name: 'Reports', href: '/inspector/reports', description: 'Inspection reports and analytics' }
    ];

    return inspectorTabs.map(tab => ({
      ...tab,
      current: cleanPathname === tab.href || (tab.href === '/inspector' && cleanPathname === '/inspector')
    }));
  };

  // Packaging-specific navigation items (empty - no tabs for packaging)
  const getPackagingNavigationItems = () => {
    return [];
  };

  // Default navigation for other roles
  const getDefaultNavigationItems = () => {
    // Only show dashboard for public role
    if (currentUser?.role === 'public') {
      return [
        { name: 'Marketplace', href: '/marketplace', current: cleanPathname === '/marketplace' },
        { name: 'Products', href: '/products', current: cleanPathname === '/products' },
        { name: 'Public Access', href: '/public-access', current: isPublicAccessPage },
      ];
    }
    return [];
  };

  // Choose navigation based on user role using the permissions service
  const userRole = currentUser?.role as any;
  const navigation = userRole 
    ? rolePermissionsService.getNavigationItems(userRole).map(item => ({
        ...item,
        current: cleanPathname === item.href || (item.href === '/marketplace' && isPublicPage)
      }))
    : getDefaultNavigationItems();

  const roles = [
    { name: 'Public', href: '/marketplace' },
    { name: 'Farmer', href: '/farmer' },
    { name: 'Logistics', href: '/logistics' },
    { name: 'Packaging', href: '/packaging' },
    { name: 'Retailer', href: '/retailer' },
    { name: 'Inspector', href: '/inspector' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50" style={{ width: '100vw', boxSizing: 'border-box' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Title - Always visible */}
          <div className="flex-shrink-0 flex items-center">
            <img src={getAssetPath("/images/maroon-logo.png")} alt="MAROON" className="h-90 w-90 mr-3 nav-logo" />
            <div className="hidden sm:block">
              <Link href={currentUser?.role === 'public' ? '/marketplace' : `/${currentUser?.role || 'public'}`} className="text-xl font-bold text-gray-900">
                Maroon Blockchain
              </Link>
              {currentUser?.role === 'farmer' && (
                <div className="text-sm text-green-600 font-medium">Farmer Portal</div>
              )}
              {currentUser?.role === 'public' && (
                <div className="text-sm text-gray-600 font-medium">Public Portal</div>
              )}
              {currentUser?.role === 'logistics' && (
                <div className="text-sm text-blue-600 font-medium">Logistics Portal</div>
              )}
              {currentUser?.role === 'inspector' && (
                <div className="text-sm text-purple-600 font-medium">Inspector Portal</div>
              )}
              {currentUser?.role === 'packaging' && (
                <div className="text-sm text-orange-600 font-medium">Packaging Portal</div>
              )}
              {currentUser?.role === 'retailer' && (
                <div className="text-sm text-indigo-600 font-medium">Retailer Portal</div>
              )}
            </div>
            {/* Mobile Title - Logo only */}
            <div className="sm:hidden">
              <Link href={currentUser?.role === 'public' ? '/marketplace' : `/${currentUser?.role || 'marketplace'}`} className="text-lg font-bold text-gray-900">
                Maroon
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Main Navigation - Desktop */}
            <div className="hidden lg:flex lg:space-x-4">
              {navigation.map((item: any) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    item.current
                      ? 'border-green-600 text-green-700'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  title={item.description}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Role Selector */}
            <div className="hidden lg:block relative" ref={dropdownRef}>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{currentUser?.role ? `${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}` : 'Switch Role'}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <div className="py-1">
                    {roles.map((role: any) => (
                      <button
                        key={role.name}
                        onClick={() => {
                          if (role.name === 'Public') {
                            // Update user context first, then navigate
                            const publicUser = DEMO_USERS.find((u: any) => u.role === 'public');
                            if (publicUser) {
                              switchUser(publicUser.id);
                              // Small delay to ensure context updates before navigation
                              setTimeout(() => {
                                window.location.href = '/marketplace';
                              }, 100);
                            } else {
                              // Fallback if public user not found
                              window.location.href = '/marketplace';
                            }
                          } else {
                            // For other roles, go to login first
                            router.push('/login');
                          }
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                          (currentUser?.role === 'farmer' && role.name === 'Farmer') || 
                          (currentUser?.role === 'public' && role.name === 'Public') ||
                          (currentUser?.role === 'logistics' && role.name === 'Logistics') ||
                          (currentUser?.role === 'inspector' && role.name === 'Inspector') ||
                          (currentUser?.role === 'packaging' && role.name === 'Packaging') ||
                          (currentUser?.role === 'retailer' && role.name === 'Retailer')
                            ? 'bg-gray-100' : ''
                        }`}
                      >
                        <span className="capitalize">{role.name}</span>
                        {((currentUser?.role === 'farmer' && role.name === 'Farmer') || 
                          (currentUser?.role === 'public' && role.name === 'Public') ||
                          (currentUser?.role === 'logistics' && role.name === 'Logistics') ||
                          (currentUser?.role === 'inspector' && role.name === 'Inspector') ||
                          (currentUser?.role === 'packaging' && role.name === 'Packaging') ||
                          (currentUser?.role === 'retailer' && role.name === 'Retailer')) && (
                          <span className="text-xs text-gray-500 ml-2">(Current)</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Navigation - Hamburger Menu with Navigation Tabs */}
            <div className="lg:hidden" ref={mobileDropdownRef}>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2"
                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              
              {isMobileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <div className="py-1">
                    {/* Mobile Navigation Items - Same as Desktop */}
                    {navigation.map((item: any) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileDropdownOpen(false)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                          item.current
                            ? 'bg-gray-100'
                            : ''
                        }`}
                        title={item.description}
                      >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.name}
                      </Link>
                    ))}
                    
                    {/* Role Switching Section */}
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      {roles.map((role: any) => (
                        <button
                          key={role.name}
                          onClick={() => {
                            if (role.name === 'Public') {
                              // Update user context first, then navigate
                              const publicUser = DEMO_USERS.find((u: any) => u.role === 'public');
                              if (publicUser) {
                                switchUser(publicUser.id);
                                // Small delay to ensure context updates before navigation
                                setTimeout(() => {
                                  window.location.href = '/marketplace';
                                }, 100);
                              } else {
                                // Fallback if public user not found
                                window.location.href = '/marketplace';
                              }
                            } else {
                              // For other roles, go to login first
                              router.push('/login');
                            }
                            setIsDropdownOpen(false);
                            setIsMobileDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                            (currentUser?.role === 'farmer' && role.name === 'Farmer') || 
                            (currentUser?.role === 'public' && role.name === 'Public') ||
                            (currentUser?.role === 'logistics' && role.name === 'Logistics') ||
                            (currentUser?.role === 'inspector' && role.name === 'Inspector') ||
                            (currentUser?.role === 'packaging' && role.name === 'Packaging') ||
                            (currentUser?.role === 'retailer' && role.name === 'Retailer')
                              ? 'bg-gray-100' : ''
                          }`}
                        >
                          <span className="capitalize">{role.name}</span>
                          {((currentUser?.role === 'farmer' && role.name === 'Farmer') || 
                            (currentUser?.role === 'public' && role.name === 'Public') ||
                            (currentUser?.role === 'logistics' && role.name === 'Logistics') ||
                            (currentUser?.role === 'inspector' && role.name === 'Inspector') ||
                            (currentUser?.role === 'packaging' && role.name === 'Packaging') ||
                            (currentUser?.role === 'retailer' && role.name === 'Retailer')) && (
                            <span className="text-xs text-gray-500">(Current)</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
