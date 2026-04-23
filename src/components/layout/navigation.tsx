// src/components/layout/navigation.tsx
'use client';

import { Menu, User } from 'lucide-react';
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


export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useUser();
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
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
  
  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'user':
        return <User className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const navigation = userRole
    ? RolePermissionsService.getNavigationItems(userRole).map((item: { href: string; label: string; icon?: string }) => ({
      ...item,
      name: item.label,
      icon: getIconComponent(item.icon),
      current: cleanPathname === item.href || (item.href === '/marketplace' && isPublicPage),
    }))
    : getDefaultNavigationItems();

  
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

            {/* Desktop Logout Button */}
            <div className="hidden lg:block">
              <Button
                variant="ghost"
                className="flex items-center space-x-2 transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={() => {
                  logout().then(() => {
                    // Check if user was using demo mode
                    const isDemoUser = currentUser && '_source' in currentUser && 
                                     (currentUser as any)._source?.type === 'mock' || 
                                     DEMO_USERS.some(u => u.id === currentUser?.id);
                    
                    if (isDemoUser) {
                      // For demo users, redirect to demo login page
                      router.push('/login');
                    } else {
                      // For real accounts, redirect to intro screen
                      router.push('/intro');
                    }
                  });
                }}
              >
                <span>Logout</span>
              </Button>
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

                    {/* Logout Section */}
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={() => {
                          logout().then(() => {
                            // Check if user was using demo mode
                            const isDemoUser = currentUser && '_source' in currentUser && 
                                             (currentUser as any)._source?.type === 'mock' || 
                                             DEMO_USERS.some(u => u.id === currentUser?.id);
                            
                            if (isDemoUser) {
                              // For demo users, redirect to demo login page
                              router.push('/login');
                            } else {
                              // For real accounts, redirect to intro screen
                              router.push('/intro');
                            }
                          });
                          setIsMobileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        <span>Logout</span>
                      </button>
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
