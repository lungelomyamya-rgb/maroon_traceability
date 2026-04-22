// src/app/public-access/trace/[id]/page.tsx
import PublicTraceClient from './client';
import { generateStaticParams } from './generateStaticParams';

export { generateStaticParams };

export default function PublicTracePage() {
  return <PublicTraceClient />;
}
