// src/app/proxy/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchWithProxy } from '@/lib/api';

interface ApiResponse {
  [key: string]: any;
}

export default function ProxyPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'YOUR_API_ENDPOINT';
        const result = await fetchWithProxy(apiUrl);
        setData(result);
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Proxy Data</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}