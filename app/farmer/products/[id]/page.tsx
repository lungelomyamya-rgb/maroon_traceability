import { generateStaticParams } from './generateStaticParams';
import ProductDetailPage from './productDetailPage';

// Re-export generateStaticParams
export { generateStaticParams };

export default function Page() {
  return <ProductDetailPage />;
}
