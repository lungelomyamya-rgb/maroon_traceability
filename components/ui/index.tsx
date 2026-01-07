// src/components/ui/index.ts
import React from 'react';

export { Button } from './button';
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from './card';
export { Badge } from './badge';
export { Input } from './input';
export { Textarea } from './textarea';
export { Skeleton } from './skeleton';
export { DocumentUpload } from './document-upload';
export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
export { Label } from './label';
export { Toaster } from './toaster';
export { DataTable, Table } from './table';

// Error boundaries
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 border border-red-300 rounded-md bg-red-50">
      <h3 className="text-red-800 font-medium">Error Boundary</h3>
      <p className="text-red-600 text-sm mt-1">Something went wrong.</p>
      {children}
    </div>
  );
}

export function AsyncErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 border border-yellow-300 rounded-md bg-yellow-50">
      <h3 className="text-yellow-800 font-medium">Async Error Boundary</h3>
      <p className="text-yellow-600 text-sm mt-1">Async operation failed.</p>
      {children}
    </div>
  );
}
