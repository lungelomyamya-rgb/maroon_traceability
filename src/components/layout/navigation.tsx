// src/components/layout/Navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoleSelector } from './roleSelector';
import { useUser } from '@/contexts/userContext';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/blockchain', label: 'Blockchain' },
];

const farmerNavItems = [
  { href: '/farmer/certify', label: 'Certify Product' },
];

export function Navigation() {
  const pathname = usePathname();
  const { userRole } = useUser();

  return (
    <nav className="bg-background/80 border-b border-border/50 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Shield className="h-8 w-8 text-primary group-hover:text-primary/80 transition-colors" />
                <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Maroon Blockchain
                </span>
                <div className="text-xs text-muted-foreground -mt-1">Supply Chain Trust</div>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            {[...navItems, ...(userRole === 'farmer' ? farmerNavItems : [])].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === item.href
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="ml-4 pl-4 border-l border-border/50">
              <RoleSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}