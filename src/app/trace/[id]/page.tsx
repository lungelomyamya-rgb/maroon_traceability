// src/app/trace/[id]/page.tsx
import TraceClient from './traceClient';

// This function tells Next.js which dynamic routes to pre-render at build time
export async function generateStaticParams() {
  return [
    { id: 'sample-001' },
    { id: 'sample-002' },
    { id: 'sample-003' },
  ];
}

export default function PublicTracePage({ params }: { params: { id: string } }) {
  return <TraceClient id={params.id} />;
}