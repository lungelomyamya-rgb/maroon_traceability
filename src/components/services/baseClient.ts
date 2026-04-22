// src/features/shared/services/baseClient.ts
// Base HTTP client for API requests

export interface AdapterResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  interceptors?: {
    request?: Array<(requestConfig: Request) => Request>;
    response?: Array<(response: Response) => Response | Promise<Response>>;
  };
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
}

export class BaseHttpClient {
  private config: HttpClientConfig;

  constructor(httpConfig: HttpClientConfig = {}) {
    this.config = {
      timeout: 10000,
      headers: {},
      ...httpConfig,
    };
  }

  private async request<T>(
    url: string,
    requestConfig: RequestConfig = {},
  ): Promise<AdapterResult<T>> {
    const timeout = requestConfig.timeout || this.config.timeout;
    const headers = { ...this.config.headers, ...requestConfig.headers };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const requestHeaders = headers;

      const response = await fetch(url, {
        ...requestConfig,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async get<T>(url: string, options?: RequestConfig): Promise<AdapterResult<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  async post<T>(url: string, data?: unknown, requestConfig?: RequestConfig): Promise<AdapterResult<T>> {
    return this.request<T>(url, {
      ...requestConfig,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...requestConfig?.headers,
      },
    });
  }

  async put<T>(url: string, data?: unknown, requestConfig?: RequestConfig): Promise<AdapterResult<T>> {
    return this.request<T>(url, {
      ...requestConfig,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...requestConfig?.headers,
      },
    });
  }

  async patch<T>(url: string, data?: unknown, requestConfig?: RequestConfig): Promise<AdapterResult<T>> {
    return this.request<T>(url, {
      ...requestConfig,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...requestConfig?.headers,
      },
    });
  }

  async delete<T>(url: string, options?: RequestConfig): Promise<AdapterResult<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'DELETE',
    });
  }
}
