// src/services/api/baseClient.ts
// Base HTTP client with error handling and interceptors

export interface HttpClientConfig {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
  interceptors?: Array<(config: HttpClientConfig) => RequestConfig | ResponseConfig>;
}

export interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

export interface ResponseConfig {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  data?: unknown;
}

export interface HttpClientError extends Error {
  status?: number;
  statusText?: string;
  config?: RequestConfig;
}

export class BaseHttpClient {
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig = {}) {
    this.config = {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    };
  }

  async request<T = unknown>(config: RequestConfig): Promise<T> {
    const url = `${this.config.baseUrl || ''}${config.url}`;
    const timeout = config.timeout || this.config.timeout;
    const headers = { ...this.config.headers, ...config.headers };

    try {
      const response = await fetch(url, {
        method: config.method || 'GET',
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: timeout ? AbortSignal.timeout(timeout) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`) as HttpClientError;
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      throw error as HttpClientError;
    }
  }

  async get<T = unknown>(url: string, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({ url, method: 'GET', ...config });
  }

  async post<T = unknown>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({ url, method: 'POST', body: data, ...config });
  }

  async put<T = unknown>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({ url, method: 'PUT', body: data, ...config });
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({ url, method: 'PATCH', body: data, ...config });
  }

  async delete<T = unknown>(url: string, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({ url, method: 'DELETE', ...config });
  }
}

// Singleton instance
export const httpClient = new BaseHttpClient();
