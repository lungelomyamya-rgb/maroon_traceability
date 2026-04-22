// src/core/providers/HybridProvider.tsx
// React context for hybrid mode management

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { HybridContextState, ModeSwitchRequest, ModeSwitchResult } from '../../types/hybrid';
import type { HybridSystemStatus } from '../../types/registry';

/**
 * Hybrid context state with actions
 */
interface HybridContextValue extends HybridContextState {
  /** Switch mode for a feature */
  switchMode: (request: ModeSwitchRequest) => Promise<ModeSwitchResult>;
  /** Get current mode for feature */
  getFeatureMode: (feature: string) => string;
  /** Reset to default modes */
  resetModes: () => void;
  /** Get system status */
  getSystemStatus: () => Promise<HybridSystemStatus>;
}

/**
 * Hybrid context actions
 */
type HybridAction =
  | { type: 'SET_MODE'; payload: { feature: string; mode: string } }
  | { type: 'SET_RUNTIME_SWITCHING'; payload: boolean }
  | { type: 'SET_HEALTH_MONITORING'; payload: boolean }
  | { type: 'RESET_MODES' }
  | { type: 'UPDATE_FEATURE_MODES'; payload: Record<string, string> };

/**
 * Initial state
 */
const initialState: HybridContextState = {
  mode: 'development',
  featureModes: {
    registration: 'real', // Always real as per requirements
    auth: 'hybrid', // Dual-mode as per requirements
    // Other features default to mock
    farmer: 'mock',
    inspector: 'mock',
    logistics: 'mock',
    packaging: 'mock',
    retailer: 'mock',
  } as Record<string, 'mock' | 'real' | 'hybrid'>,
  runtimeSwitching: true,
  healthMonitoring: true,
};

/**
 * Reducer for hybrid context
 */
function hybridReducer(state: HybridContextState, action: HybridAction): HybridContextState {
  switch (action.type) {
  case 'SET_MODE':
    return {
      ...state,
      featureModes: {
        ...state.featureModes,
        [action.payload.feature]: action.payload.mode,
      } as Record<string, 'mock' | 'real' | 'hybrid'>,
      lastModeSwitch: new Date(),
    };

  case 'SET_RUNTIME_SWITCHING':
    return {
      ...state,
      runtimeSwitching: action.payload,
    };

  case 'SET_HEALTH_MONITORING':
    return {
      ...state,
      healthMonitoring: action.payload,
    };

  case 'RESET_MODES':
    return {
      ...initialState,
      mode: state.mode, // Preserve global mode
    };

  case 'UPDATE_FEATURE_MODES':
    return {
      ...state,
      featureModes: {
        ...state.featureModes,
        ...action.payload,
      } as Record<string, 'mock' | 'real' | 'hybrid'>,
    };

  default:
    return state;
  }
}

/**
 * Hybrid context
 */
const HybridContext = createContext<HybridContextValue | null>(null);

/**
 * Props for HybridProvider
 */
interface HybridProviderProps {
  children: React.ReactNode;
  initialMode?: HybridContextState['mode'];
  initialFeatureModes?: Record<string, 'mock' | 'real' | 'hybrid'>;
  enableRuntimeSwitching?: boolean;
  enableHealthMonitoring?: boolean;
}

/**
 * Hybrid Provider Component
 */
export const HybridProvider: React.FC<HybridProviderProps> = ({
  children,
  initialMode = 'development',
  initialFeatureModes,
  enableRuntimeSwitching = true,
  enableHealthMonitoring = true,
}) => {
  const [state, dispatch] = useReducer(hybridReducer, {
    ...initialState,
    mode: initialMode,
    featureModes: {
      ...initialState.featureModes,
      ...initialFeatureModes,
    },
    runtimeSwitching: enableRuntimeSwitching,
    healthMonitoring: enableHealthMonitoring,
  });

  /**
   * Switch mode for a feature
   */
  const switchMode = useCallback(async (request: ModeSwitchRequest): Promise<ModeSwitchResult> => {
    const { feature, newMode, reason, force = false } = request;
    const previousMode = state.featureModes[feature] || 'mock';

    // Check if runtime switching is enabled
    if (!state.runtimeSwitching && !force) {
      return {
        success: false,
        previousMode,
        newMode,
        affectedAdapters: [],
        timestamp: new Date(),
        error: 'Runtime switching is disabled',
      };
    }

    // Validate mode transition
    const validModes = ['mock', 'real', 'hybrid'];
    if (!validModes.includes(newMode)) {
      return {
        success: false,
        previousMode,
        newMode,
        affectedAdapters: [],
        timestamp: new Date(),
        error: `Invalid mode: ${newMode}`,
      };
    }

    try {
      // Perform mode switch logic here
      // This would involve adapter registry, health checks, etc.

      const warnings: string[] = [];

      // Check if adapters are healthy before switching
      if (!force) {
        // Add health check logic here
        warnings.push('Mode switch performed without health validation');
      }

      // Update state
      dispatch({
        type: 'SET_MODE',
        payload: { feature, mode: newMode },
      });

      // Get affected adapters (simplified)
      const affectedAdapters = [`${feature}-${newMode}`];

      const result: ModeSwitchResult = {
        success: true,
        previousMode,
        newMode,
        affectedAdapters,
        timestamp: new Date(),
        warnings,
      };

      console.log('Mode switch completed:', {
        feature,
        from: previousMode,
        to: newMode,
        reason,
        result,
      });

      return result;
    } catch (error) {
      return {
        success: false,
        previousMode,
        newMode,
        affectedAdapters: [],
        timestamp: new Date(),
        error: (error as Error).message,
      };
    }
  }, [state.runtimeSwitching, state.featureModes]);

  /**
   * Get current mode for feature
   */
  const getFeatureMode = useCallback((feature: string): string => {
    return state.featureModes[feature] || 'mock';
  }, [state.featureModes]);

  /**
   * Reset to default modes
   */
  const resetModes = useCallback(() => {
    dispatch({ type: 'RESET_MODES' });
  }, []);

  /**
   * Get system status
   */
  const getSystemStatus = useCallback(async (): Promise<HybridSystemStatus> => {
    // This would integrate with health monitor and adapter registry
    // For now, return a simplified status
    return {
      systemHealth: 'healthy',
      activeFeatures: Object.keys(state.featureModes),
      totalAdapters: Object.keys(state.featureModes).length,
      healthyAdapters: Object.keys(state.featureModes).length,
      currentMode: state.mode,
      lastHealthCheck: new Date(),
      metrics: {
        totalOperations: 0,
        averageResponseTime: 0,
        errorRate: 0,
        uptime: 100,
      },
    };
  }, [state.mode, state.featureModes]);

  /**
   * Load configuration from environment on mount
   */
  useEffect(() => {
    const loadEnvironmentConfig = () => {
      try {
        // Load from environment variables or config
        const envModes = process.env.NEXT_PUBLIC_HYBRID_FEATURE_MODES;
        if (envModes) {
          const modes = JSON.parse(envModes) as Record<string, 'mock' | 'real' | 'hybrid'>;
          dispatch({
            type: 'UPDATE_FEATURE_MODES',
            payload: modes,
          });
        }
      } catch (error) {
        console.warn('Failed to load hybrid configuration from environment:', error);
      }
    };

    loadEnvironmentConfig();
  }, []);

  /**
   * Persist mode changes to localStorage
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hybrid-feature-modes', JSON.stringify(state.featureModes));
        localStorage.setItem('hybrid-last-switch', state.lastModeSwitch?.toISOString() || '');
      } catch (error) {
        console.warn('Failed to persist hybrid configuration:', error);
      }
    }
  }, [state.featureModes, state.lastModeSwitch]);

  /**
   * Load configuration from localStorage on mount
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedModes = localStorage.getItem('hybrid-feature-modes');
        const lastSwitch = localStorage.getItem('hybrid-last-switch');

        if (savedModes) {
          const modes = JSON.parse(savedModes) as Record<string, 'mock' | 'real' | 'hybrid'>;
          dispatch({
            type: 'UPDATE_FEATURE_MODES',
            payload: modes,
          });
        }

        if (lastSwitch) {
          // This would be handled by the reducer when modes are updated
        }
      } catch (error) {
        console.warn('Failed to load hybrid configuration from storage:', error);
      }
    }
  }, []);

  const contextValue: HybridContextValue = {
    ...state,
    switchMode,
    getFeatureMode,
    resetModes,
    getSystemStatus,
  };

  return (
    <HybridContext.Provider value={contextValue}>
      {children}
    </HybridContext.Provider>
  );
};

/**
 * Hook to use hybrid context
 */
export const useHybrid = (): HybridContextValue => {
  const context = useContext(HybridContext);
  if (!context) {
    throw new Error('useHybrid must be used within a HybridProvider');
  }
  return context;
};

/**
 * Hook to get feature mode
 */
export const useFeatureMode = (feature: string): string => {
  const { getFeatureMode } = useHybrid();
  return getFeatureMode(feature);
};

/**
 * Hook to switch feature mode
 */
export const useModeSwitch = () => {
  const { switchMode } = useHybrid();

  return {
    switchMode,
    switchToMock: (feature: string, reason?: string) =>
      switchMode({ feature, newMode: 'mock', reason }),
    switchToReal: (feature: string, reason?: string) =>
      switchMode({ feature, newMode: 'real', reason }),
    switchToHybrid: (feature: string, reason?: string) =>
      switchMode({ feature, newMode: 'hybrid', reason }),
  };
};

/**
 * Hook to get system status
 */
export const useSystemStatus = () => {
  const { getSystemStatus } = useHybrid();

  return {
    getSystemStatus,
  };
};

export default HybridProvider;
