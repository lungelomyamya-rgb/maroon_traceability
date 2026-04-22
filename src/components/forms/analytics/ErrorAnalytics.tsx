// components/analytics/ErrorAnalytics.tsx
// Error analytics dashboard using basic HTML elements

import React, { useState } from 'react';
import { useErrorTracker, useErrorPatterns, useErrorTrends, useErrorRecovery, useErrorSeverity } from '@/hooks/analytics/useErrorTracker';

interface ErrorAnalyticsProps {
  className?: string;
  timeWindow?: number;
}

interface TopError {
  type: string;
  count: number;
  percentage: number;
}

interface ErrorDetail {
  id: string;
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  operation?: string;
  timestamp: number;
  adapterType?: string;
  recovered?: boolean;
}

interface ErrorPattern {
  pattern: string;
  count: number;
  description: string;
}

interface ErrorTrend {
  timestamp: number;
  count: number;
  severity: 'low' | 'medium' | 'high' | 'critical' | string;
}

export function ErrorAnalytics({ className, timeWindow = 3600000 }: ErrorAnalyticsProps) {
  const {
    analytics,
    recentErrors,
    errorRate,
    totalErrors,
    recoveryRate,
    avgRecoveryTime,
    hasErrors: _hasErrors,
    hasCriticalErrors,
  } = useErrorTracker();

  const { patterns, topPattern: _topPattern, hasPatterns } = useErrorPatterns();
  const { trends, isIncreasing, isDecreasing, peakTime } = useErrorTrends(timeWindow);
  const { recoveryStats, isHealthy, needsAttention: _needsAttention, trackRecovery } = useErrorRecovery();
  const { severityStats, totalErrors: totalSeverityErrors, hasCriticalErrors: _hasCriticalSeverity, criticalErrorRatio: _criticalErrorRatio, worstSeverity: _worstSeverity } = useErrorSeverity();

  const [selectedTab, setSelectedTab] = useState('overview');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
    case 'critical': return 'bg-red-500';
    case 'high': return 'bg-orange-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-blue-500';
    default: return 'bg-gray-500';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
    case 'critical': return 'text-red-700';
    case 'high': return 'text-orange-700';
    case 'medium': return 'text-yellow-700';
    case 'low': return 'text-blue-700';
    default: return 'text-gray-700';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) {
      return `${ms}ms`;
    }
    if (ms < 60000) {
      return `${(ms / 1000).toFixed(1)}s`;
    }
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Error Analytics Dashboard</h2>
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            hasCriticalErrors ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {hasCriticalErrors ? 'Critical Issues' : 'Normal'}
          </span>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Alert for critical issues */}
      {hasCriticalErrors && (
        <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
          <p className="text-red-800">
            <strong>Critical errors detected!</strong> {severityStats.critical} critical errors found. Immediate attention required.
          </p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {['overview', 'errors', 'patterns', 'trends'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Errors */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Total Errors</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  totalErrors > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {totalErrors}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(totalErrors)}</div>
              <p className="text-xs text-gray-500">Last {formatDuration(timeWindow)}</p>
            </div>

            {/* Error Rate */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Error Rate</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  errorRate > 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {errorRate.toFixed(1)}/min
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{errorRate.toFixed(1)}</div>
              <p className="text-xs text-gray-500">Errors per minute</p>
            </div>

            {/* Recovery Rate */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Recovery Rate</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  recoveryRate > 80 ? 'bg-green-100 text-green-800' :
                    recoveryRate > 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {recoveryRate.toFixed(1)}%
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{recoveryRate.toFixed(1)}%</div>
              <p className="text-xs text-gray-500">Auto-recovered</p>
            </div>

            {/* Avg Recovery Time */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Avg Recovery</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  avgRecoveryTime < 5000 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {avgRecoveryTime < 5000 ? 'Fast' : 'Slow'}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatDuration(avgRecoveryTime)}</div>
              <p className="text-xs text-gray-500">Average time</p>
            </div>
          </div>

          {/* Error Severity Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Severity Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(severityStats).map(([severity, count]) => (
                <div key={severity} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(severity)}`} />
                    <span className="text-sm font-medium capitalize">{severity}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">{count}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({totalSeverityErrors > 0 ? ((count / totalSeverityErrors) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Error Types */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Error Types</h3>
            <div className="space-y-3">
              {analytics.topErrors.slice(0, 5).map(({ type, count, percentage }: TopError) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{type}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold">{count}</span>
                    <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recovery Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Health Status</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isHealthy ? 'Healthy' : 'Needs Attention'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${recoveryRate}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Recoveries</span>
                <span className="font-bold">{recoveryStats.totalRecoveries}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Avg Recovery Time</span>
                <span className="font-bold">{formatDuration(recoveryStats.avgRecoveryTime)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Errors Tab */}
      {selectedTab === 'errors' && (
        <div className="space-y-4">
          {recentErrors.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <p className="text-gray-500">No recent errors found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentErrors.map((error: ErrorDetail) => (
                <div key={error.id} className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityTextColor(error.severity)}`}>
                          {error.severity.toUpperCase()}
                        </span>
                        <span className="text-sm font-medium">{error.type}</span>
                      </div>
                      <p className="text-sm text-gray-600">{error.message}</p>
                      {error.operation && (
                        <p className="text-xs text-gray-500">Operation: {error.operation}</p>
                      )}
                      {error.adapterType && (
                        <p className="text-xs text-gray-500">Adapter: {error.adapterType}</p>
                      )}
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div>{new Date(error.timestamp).toLocaleTimeString()}</div>
                      {error.recovered && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium ml-2">
                          Recovered
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Patterns Tab */}
      {selectedTab === 'patterns' && (
        <div className="space-y-4">
          {hasPatterns ? (
            <div className="space-y-3">
              {patterns.map(({ pattern, count, description }: ErrorPattern) => (
                <div key={pattern} className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">{pattern}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                      {count}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <p className="text-gray-500">No error patterns detected</p>
            </div>
          )}
        </div>
      )}

      {/* Trends Tab */}
      {selectedTab === 'trends' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Trends</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Trend Direction</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  isIncreasing ? 'bg-red-100 text-red-800' :
                    isDecreasing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {isIncreasing ? 'Increasing' : isDecreasing ? 'Decreasing' : 'Stable'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Peak Errors</span>
                <span className="text-sm font-bold">{peakTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Data Points</span>
                <span className="text-sm font-bold">{trends.length}</span>
              </div>
            </div>
          </div>

          {/* Trend Visualization */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Timeline</h3>
            <div className="space-y-2">
              {trends.slice(-10).reverse().map((trend: ErrorTrend, _index: number) => (
                <div key={trend.timestamp} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{formatTime(trend.timestamp)}</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(trend.severity)}`} />
                    <span className="font-medium">{trend.count} errors</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Refresh Data
        </button>
        <button
          onClick={() => trackRecovery('manual', 0)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Test Recovery
        </button>
      </div>
    </div>
  );
}
