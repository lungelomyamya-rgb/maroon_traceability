// src/components/user/UserCard.tsx
// Type-safe user card component using UIUser interface

import React from 'react';
import { UIUser } from '@/types/types';

// Type definitions for the component
interface UserCardProps {
  user: UIUser;
  showEmail?: boolean;
  showRole?: boolean;
  showStatus?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'detailed';
  className?: string;
}

// Color constants for user avatars and status
const _USER_AVATAR_COLORS: Record<string, string> = {
  admin: '#ef4444',
  government: '#3b82f6',
  farmer: '#22c55e',
  inspector: '#f59e0b',
  logistics: '#8b5cf6',
  packaging: '#06b6d4',
  retailer: '#ec4899',
  public: '#6b7280',
  saps: '#dc2626',
};

const _USER_STATUS_COLORS = {
  active: '#22c55e',
  inactive: '#ef4444',
  unknown: '#6b7280',
};

/**
 * Type-safe UserCard component
 * Uses UIUser interface for guaranteed type safety
 * Demonstrates how UI components can be completely type-safe
 */
export const UserCard: React.FC<UserCardProps> = ({
  user,
  showEmail = true,
  showRole = true,
  showStatus = true,
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  // Size configurations with proper typing
  const sizeClasses = {
    xs: 'w-16 h-16 text-xs',
    sm: 'w-20 h-20 text-sm',
    md: 'w-24 h-24 text-base',
    lg: 'w-32 h-32 text-lg',
    xl: 'w-40 h-40 text-xl',
  } as const;

  const avatarSizeClasses = {
    xs: 'h-8 w-8',
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20',
  } as const;

  const statusSizeClasses = {
    xs: 'h-2 w-2',
    sm: 'h-2.5 w-2.5',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
    xl: 'h-5 w-5',
  } as const;

  // Get user initials for avatar fallback
  const _getInitials = (name: string, email: string): string => {
    const nameOrEmail = name || email;
    if (!nameOrEmail) {
      return '?';
    }

    const parts = nameOrEmail.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return parts
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  };

  const initials = user.initials;
  const avatarColor = user.roleColor;
  const statusColor = user.statusColor;

  return (
    <div className={`user-card ${sizeClasses[size]} ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        {/* Avatar with status indicator */}
        <div className="relative">
          <div
            className={`${avatarSizeClasses[size]} rounded-full flex items-center justify-center text-white font-semibold`}
            style={{ backgroundColor: avatarColor }}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.name}'s avatar`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          {showStatus && (
            <div
              className={`absolute -bottom-1 -right-1 ${statusSizeClasses[size]} rounded-full border-2 border-white`}
              style={{ backgroundColor: statusColor }}
              title={user.status === 'active' ? 'Active' : user.status === 'inactive' ? 'Inactive' : 'Unknown'}
            />
          )}
        </div>

        {/* User information */}
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-gray-900 truncate">
            {user.displayName}
          </h3>

          {showEmail && (
            <p className="text-sm text-gray-600 truncate">
              {user.email}
            </p>
          )}

          {showRole && (
            <div className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
              {user.roleDisplay}
            </div>
          )}
        </div>

        {/* Additional information for detailed variant */}
        {variant === 'detailed' && (
          <div className="w-full space-y-2 text-xs text-gray-500">
            {user.permissions && (
              <div className="flex flex-wrap gap-1 justify-center">
                {user.permissions.canView && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">View</span>
                )}
                {user.permissions.canCreate && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Create</span>
                )}
                {user.permissions.canEdit && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Edit</span>
                )}
                {user.permissions.canVerify && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">Verify</span>
                )}
              </div>
            )}

            <div className="text-center">
              Status: {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
