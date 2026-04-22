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

export default async function PublicTracePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TraceClient id={id} />;
}