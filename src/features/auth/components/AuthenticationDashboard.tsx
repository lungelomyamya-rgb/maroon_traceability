// src/features/auth/components/AuthenticationDashboard.tsx
// Main authentication dashboard with mode management

import React, { useState } from 'react';
import { useHybridAuth } from '../hooks/useHybridAuth';

/**
 * Authentication dashboard component
 * Central hub for managing authentication settings and status
 */
export const AuthenticationDashboard: React.FC = () => {
  const auth = useHybridAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'settings' | 'logs'>('overview');

  // Mock users data
  const mockUsers = [
    { id: '1', email: 'farmer@example.com', name: 'John Farmer', role: 'farmer', status: 'active' },
    { id: '2', email: 'inspector@example.com', name: 'Jane Inspector', role: 'inspector', status: 'active' },
    { id: '3', email: 'retailer@example.com', name: 'Bob Retailer', role: 'retailer', status: 'active' },
    { id: '4', email: 'logistics@example.com', name: 'Mike Logistics', role: 'logistics', status: 'active' },
    { id: '5', email: 'packaging@example.com', name: 'Sarah Packaging', role: 'packaging', status: 'active' },
    { id: '6', email: 'admin@example.com', name: 'Admin User', role: 'admin', status: 'active' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-7xl">
        <div className="bg-white shadow-lg rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Authentication Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage hybrid authentication system settings and monitor real-time status
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Dashboard tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mock Users
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Settings
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'logs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Logs
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>

                {/* Current Mode */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">Current Mode</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {auth.mode.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600">
                      {auth.mode === 'mock' ? '(Simulated)' : '(Real)'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {auth.mode === 'mock'
                      ? 'Using mock authentication with demo users for development and testing'
                      : 'Using real Supabase authentication for production use'
                    }
                  </p>
                </div>

                {/* Health Status */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-900 mb-2">System Health</h3>
                  {auth.healthStatus ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Overall Status:</span>
                        <span className={`text-sm font-bold ${
                          auth.healthStatus.status === 'healthy' ? 'text-green-600' :
                            auth.healthStatus.status === 'degraded' ? 'text-yellow-600' :
                              'text-red-600'
                        }`}>
                          {auth.healthStatus.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div>Mode switches: {auth.mode} (current)</div>
                        <div>Fallback status: {auth.fallbackEnabled ? 'Enabled' : 'Disabled'}</div>
                        <div>Health checks: {auth.healthStatus?.status || 'Unknown'}</div>
                      </div>

                      <div className="text-xs bg-gray-100 p-2 rounded">
                        <pre className="text-xs text-gray-700">
                          {JSON.stringify(auth.healthStatus.details, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800">Health status not available</p>
                    </div>
                  )}
                </div>

                {/* Current User */}
                {auth.user && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-purple-900 mb-2">Current User</h3>
                    <div className="space-y-1">
                      <div><span className="text-sm font-medium">Email:</span> {auth.user.email}</div>
                      <div><span className="text-sm font-medium">Name:</span> {auth.user.name}</div>
                      <div><span className="text-sm font-medium">Role:</span> {auth.user.role}</div>
                      <div><span className="text-sm font-medium">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          auth.user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {auth.user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div><span className="text-sm font-medium">Mode:</span>
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          auth.mode === 'mock' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {auth.mode}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Mock Users Management</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="bg-white p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">Role: {user.role}</div>
                      <div className="text-xs text-gray-500">
                        Last login: {new Date().toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Settings</h2>

                <div className="space-y-4">
                  {/* Mode Selection */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication Mode</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="authMode"
                          value="mock"
                          checked={auth.mode === 'mock'}
                          onChange={() => auth.switchMode('mock')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Mock Mode</span>
                        <span className="text-xs text-gray-500 ml-2">Demo users for development</span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="authMode"
                          value="real"
                          checked={auth.mode === 'real'}
                          onChange={() => auth.switchMode('real')}
                          className="h-4 w-4 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Real Mode</span>
                        <span className="text-xs text-gray-500 ml-2">Production Supabase</span>
                      </label>
                    </div>
                  </div>

                  {/* Fallback Toggle */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Fallback Settings</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Enable Fallback:</span>
                      <button
                        onClick={auth.toggleFallback}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          auth.fallbackEnabled
                            ? 'bg-blue-600'
                            : 'bg-gray-200'
                        }`}
                      >
                        <span className="sr-only">Toggle fallback</span>
                        <span
                          className={`inline-block h-4 w-4 rounded-full transition-transform ${
                            auth.fallbackEnabled ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'
                          }`}
                        >
                        </span>
                      </button>
                      <span className="ml-3 text-sm text-gray-600">
                        {auth.fallbackEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">System Logs</h2>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <div className="text-xs text-gray-600 mb-2">Recent authentication events:</div>
                    {auth.lastError ? (
                      <div className="bg-red-50 border border-red-200 p-2 rounded">
                        <div className="text-sm text-red-800">
                          <strong>Error:</strong> {auth.lastError}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-green-600">
                        ✓ No recent errors
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
