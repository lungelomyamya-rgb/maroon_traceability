// Error Monitoring Dashboard Component

import React, { useState, useEffect } from 'react';
import { useErrorTracker, ErrorTrackingMetrics } from './errorTracker';

interface ErrorDashboardProps {
  className?: string;
  refreshInterval?: number;
  showResolved?: boolean;
}

export function ErrorDashboard({
  className = '',
  refreshInterval = 30000,
  showResolved: _showResolved = false,
}: ErrorDashboardProps) {
  const { getMetrics, clearErrors } = useErrorTracker();
  const [metrics, setMetrics] = useState<ErrorTrackingMetrics | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedError, setSelectedError] = useState<string | null>(null);

  useEffect(() => {
    const refreshMetrics = () => {
      setIsRefreshing(true);
      try {
        const currentMetrics = getMetrics();
        setMetrics(currentMetrics);
      } finally {
        setIsRefreshing(false);
      }
    };

    // Initial load
    refreshMetrics();

    // Set up periodic refresh
    const interval = setInterval(refreshMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [getMetrics, refreshInterval]);

  const handleClearErrors = () => {
    clearErrors();
    setMetrics(getMetrics());
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
    case 'critical':
      return 'text-red-600 bg-red-50';
    case 'high':
      return 'text-orange-600 bg-orange-50';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50';
    case 'low':
      return 'text-blue-600 bg-blue-50';
    default:
      return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
    case 'javascript':
      return 'text-purple-600 bg-purple-50';
    case 'network':
      return 'text-indigo-600 bg-indigo-50';
    case 'react':
      return 'text-pink-600 bg-pink-50';
    case 'unhandled':
      return 'text-red-600 bg-red-50';
    case 'promise':
      return 'text-orange-600 bg-orange-50';
    case 'performance':
      return 'text-cyan-600 bg-cyan-50';
    default:
      return 'text-gray-600 bg-gray-50';
    }
  };

  if (!metrics) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading error metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-white rounded-lg shadow ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Error Monitoring Dashboard</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMetrics(getMetrics())}
            disabled={isRefreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={handleClearErrors}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{metrics.totalErrors}</div>
          <div className="text-sm text-gray-600">Total Errors</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(metrics.errorRate * 100)}%
          </div>
          <div className="text-sm text-gray-600">Error Rate</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(metrics.averageResolutionTime / 1000)}s
          </div>
          <div className="text-sm text-gray-600">Avg Resolution Time</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {metrics.topErrors.length}
          </div>
          <div className="text-sm text-gray-600">Top Issues</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Errors by Type */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Errors by Type</h3>
          <div className="space-y-2">
            {Object.entries(metrics.errorsByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(type)}`}>
                  {type}
                </span>
                <span className="text-sm text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Errors by Severity */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Errors by Severity</h3>
          <div className="space-y-2">
            {Object.entries(metrics.errorsBySeverity).map(([severity, count]) => (
              <div key={severity} className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(severity)}`}>
                  {severity}
                </span>
                <span className="text-sm text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Errors Table */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Errors</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occurrences
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  First Seen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.topErrors.map((error) => (
                <tr key={error.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedError(error.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {error.message.length > 50
                        ? `${error.message.substring(0, 50)}...`
                        : error.message}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(error.type)}`}>
                      {error.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(error.severity)}`}>
                      {error.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {error.occurrences}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(error.firstSeen).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      error.resolved
                        ? 'text-green-600 bg-green-50'
                        : 'text-red-600 bg-red-50'
                    }`}>
                      {error.resolved ? 'Resolved' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Error Detail Modal */}
      {selectedError && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Error Details</h3>
                <button
                  onClick={() => setSelectedError(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {(() => {
                const error = metrics.topErrors.find((e) => e.id === selectedError);
                if (!error) {
                  return null;
                }

                return (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Message</h4>
                      <p className="text-sm text-gray-600">{error.message}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Type</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(error.type)}`}>
                          {error.type}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Severity</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(error.severity)}`}>
                          {error.severity}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Occurrences</h4>
                        <p className="text-sm text-gray-600">{error.occurrences}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Status</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          error.resolved
                            ? 'text-green-600 bg-green-50'
                            : 'text-red-600 bg-red-50'
                        }`}>
                          {error.resolved ? 'Resolved' : 'Active'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Context</h4>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <pre className="text-gray-600 whitespace-pre-wrap">
                          {JSON.stringify(error.context, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {error.stack && (
                      <div>
                        <h4 className="font-medium text-gray-900">Stack Trace</h4>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <pre className="text-gray-600 whitespace-pre-wrap">
                            {error.stack}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Error Monitoring Hook
export function useErrorMonitoring(config?: { refreshInterval?: number }) {
  const { getMetrics, captureError, captureReactError, captureNetworkError } = useErrorTracker();
  const [metrics, setMetrics] = useState<ErrorTrackingMetrics | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateMetrics = () => setMetrics(getMetrics());

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    updateMetrics();

    const interval = setInterval(updateMetrics, config?.refreshInterval || 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [getMetrics, config?.refreshInterval]);

  return {
    metrics,
    isOnline,
    captureError,
    captureReactError,
    captureNetworkError,
    refresh: () => setMetrics(getMetrics()),
  };
}
