import { useState } from 'react';
import { ProductsTable, ProductDetails } from './components';
import type { Product } from './types';

export function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="flex flex-col h-full px-8 bg-background overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        <div className="lg:w-2/3 min-w-0 overflow-hidden">
          <ProductsTable onSelectProduct={setSelectedProduct} />
        </div>
        <div className="lg:w-1/3 min-w-0 overflow-auto">
          <ProductDetails product={selectedProduct} />
        </div>
      </div>
    </div>
  );
}
