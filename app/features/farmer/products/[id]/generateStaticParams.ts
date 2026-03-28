// app/farmer/products/[id]/generateStaticParams.ts
export async function generateStaticParams() {
  // Generate static params for sample farmer products
  return [
    { id: 'product-001' },
    { id: 'product-002' },
    { id: 'product-003' },
    { id: 'product-004' },
    { id: 'product-005' }
  ];
}
