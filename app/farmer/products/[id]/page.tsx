import ProductDetailPage from './productDetailPage';
import { generateStaticParams } from './generateStaticParams';

// Re-export generateStaticParams
export { generateStaticParams };

export default function Page() {
  return <ProductDetailPage />;
}
