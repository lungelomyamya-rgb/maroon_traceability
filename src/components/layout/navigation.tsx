// src/components/layout/navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { ChevronDown, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/types/user';
import { DEMO_USERS } from '@/constants/users';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useUser();

  // Hide navigation completely on login page
  if (pathname === '/login') {
    console.log('Navigation hidden: login page detected');
    return null;
  }

  // Show navigation for all authenticated users
  if (!user) {
    console.log('Navigation hidden: no user logged in');
    return null;
  }

  const handleLogout = () => {
    setUser(null);
    router.push('/viewer');
  };

  const switchUser = (role: UserRole) => {
    if (role === 'viewer') {
      // For viewer role, set a basic viewer user and navigate directly
      setUser({
        id: 'viewer',
        name: 'Viewer',
        email: 'viewer@example.com',
        role: 'viewer',
        permissions: {
          canCreate: false,
          canVerify: false,
        }
      });
      router.push('/viewer');
    } else {
      // For other roles, redirect to login first
      router.push(`/login?role=${role}`);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: `/${user?.role}`, current: pathname === `/${user?.role}` },
    { name: 'Reports', href: '/reports', current: pathname === '/reports' },
    { name: 'Settings', href: '/settings', current: pathname === '/settings' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Maroon Traceability
              </Link>
            </div>
            <div className="hidden sm:ml-1 sm:flex sm:space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    item.current
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <span>{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50">
                <div className="px-2 py-1.5 text-sm font-medium text-gray-700">
                  Switch Role
                </div>
                {/* Viewer role option */}
                <DropdownMenuItem
                  onClick={() => switchUser('viewer')}
                  className={user.role === 'viewer' ? 'bg-gray-100' : ''}
                >
                  <div className="flex items-center space-x-2">
                    <span className="capitalize">Viewer</span>
                    {user.role === 'viewer' && (
                      <span className="text-xs text-gray-500">(Current)</span>
                    )}
                  </div>
                </DropdownMenuItem>
                {DEMO_USERS.map((demoUser) => (
                  <DropdownMenuItem
                    key={demoUser.role}
                    onClick={() => switchUser(demoUser.role)}
                    className={user.role === demoUser.role ? 'bg-gray-100' : ''}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="capitalize">{demoUser.role}</span>
                      {user.role === demoUser.role && (
                        <span className="text-xs text-gray-500">(Current)</span>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}