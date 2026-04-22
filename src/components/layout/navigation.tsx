// src/components/layout/navigation.tsx
'use client';

import { ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { RolePermissionsService } from '@/components/services/rolePermissionsService';
import { Button } from '@/components/ui/button';
import { DEMO_USERS } from '@/constants/users';
import { useUser } from '@/contexts/userContext';
import { getAssetPath } from '@/lib/utils/assetPath';
import { UserRole, BaseUser } from '@/types';


interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
  description?: string;
  icon?: React.ReactNode;
}

interface Role {
  name: string;
  href: string;
}

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

  // Default navigation for other roles
  const getDefaultNavigationItems = () => {
    // Only show dashboard for public role
    if (currentUser?.role === 'public') {
      return [
        { name: 'Marketplace', href: '/marketplace', current: cleanPathname === '/marketplace' },
        { name: 'Products', href: '/products', current: cleanPathname === '/products' },
        { name: 'Public Access', href: '/public-access', current: cleanPathname === '/public-access' },
      ];
    }
    return [];
  };

  // Choose navigation based on user role using the permissions service
  const userRole = currentUser?.role === 'public' ? 'viewer' as UserRole :
    currentUser?.role === 'government' ? 'admin' as UserRole :
                   currentUser?.role as UserRole | null;
  const navigation = userRole
    ? RolePermissionsService.getNavigationItems(userRole).map((item: { href: string; label: string; icon?: React.ReactNode }) => ({
      ...item,
      name: item.label,
      current: cleanPathname === item.href || (item.href === '/marketplace' && isPublicPage),
    }))
    : getDefaultNavigationItems();

  const roles = [
    { name: 'Public', href: '/marketplace' },
    { name: 'Farmer', href: '/farmer' },
    { name: 'Logistics', href: '/logistics' },
    { name: 'Packaging', href: '/packaging' },
    { name: 'Retailer', href: '/retailer' },
    { name: 'Inspector', href: '/inspector' },
    { name: 'SAPS', href: '/saps' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50" style={{ width: '100vw', boxSizing: 'border-box' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Title - Always visible */}
          <div className="flex-shrink-0 flex items-center">
            <img src={getAssetPath('images/maroonLogo.png')} alt="MAROON" className="h-6 w-6 sm:h-8 sm:w-8 mr-3 nav-logo transition-all duration-200 hover:scale-105" />
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
              {currentUser?.role === 'saps' && (
                <div className="text-sm text-blue-800 font-medium">SAPS Portal</div>
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
              {navigation.map((item: NavigationItem) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    item.current
                      ? 'border-green-600 text-green-700 bg-green-50'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50'
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
                className="flex items-center space-x-2 transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{currentUser?.role ? `${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}` : 'Switch Role'}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 transition-all duration-200 animate-fade-in">
                  <div className="py-1">
                    {roles.map((role: Role) => (
                      <button
                        key={role.name}
                        onClick={() => {
                          if (role.name === 'Public') {
                            // Update user context first, then navigate
                            const publicUser = DEMO_USERS.find((u: BaseUser) => u.role === 'public');
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
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                          (currentUser?.role === 'farmer' && role.name === 'Farmer') ||
                          (currentUser?.role === 'public' && role.name === 'Public') ||
                          (currentUser?.role === 'logistics' && role.name === 'Logistics') ||
                          (currentUser?.role === 'inspector' && role.name === 'Inspector') ||
                          (currentUser?.role === 'packaging' && role.name === 'Packaging') ||
                          (currentUser?.role === 'retailer' && role.name === 'Retailer') ||
                          (currentUser?.role === 'saps' && role.name === 'SAPS')
                            ? 'bg-gray-100' : ''
                        }`}
                      >
                        <span className="capitalize">{role.name}</span>
                        {((currentUser?.role === 'farmer' && role.name === 'Farmer') ||
                          (currentUser?.role === 'public' && role.name === 'Public') ||
                          (currentUser?.role === 'logistics' && role.name === 'Logistics') ||
                          (currentUser?.role === 'inspector' && role.name === 'Inspector') ||
                          (currentUser?.role === 'packaging' && role.name === 'Packaging') ||
                          (currentUser?.role === 'retailer' && role.name === 'Retailer') ||
                          (currentUser?.role === 'saps' && role.name === 'SAPS')) && (
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
                className="flex items-center space-x-2 p-2 sm:p-3 transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>

              {isMobileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-md shadow-lg z-50 border border-gray-200 transition-all duration-200 animate-fade-in">
                  <div className="py-1">
                    {/* Mobile Navigation Items - Same as Desktop */}
                    {navigation.map((item: NavigationItem) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileDropdownOpen(false)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
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
                      {roles.map((role: Role) => (
                        <button
                          key={role.name}
                          onClick={() => {
                            if (role.name === 'Public') {
                              // Update user context first, then navigate
                              const publicUser = DEMO_USERS.find((u: BaseUser) => u.role === 'public');
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
                            (currentUser?.role === 'retailer' && role.name === 'Retailer') ||
                            (currentUser?.role === 'saps' && role.name === 'SAPS')
                              ? 'bg-gray-100' : ''
                          }`}
                        >
                          <span className="capitalize">{role.name}</span>
                          {((currentUser?.role === 'farmer' && role.name === 'Farmer') ||
                            (currentUser?.role === 'public' && role.name === 'Public') ||
                            (currentUser?.role === 'logistics' && role.name === 'Logistics') ||
                            (currentUser?.role === 'inspector' && role.name === 'Inspector') ||
                            (currentUser?.role === 'packaging' && role.name === 'Packaging') ||
                            (currentUser?.role === 'retailer' && role.name === 'Retailer') ||
                            (currentUser?.role === 'saps' && role.name === 'SAPS')) && (
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
