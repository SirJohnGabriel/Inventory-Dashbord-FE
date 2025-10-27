import { ProductsTable, ProductDetails } from './components';
import { useProducts } from './hooks';

export function Products() {
  const { selectedProduct, setSelectedProduct } = useProducts();

  return (
    <div className="flex flex-col h-full px-8 bg-background overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        <div className="lg:w-2/3 min-w-0 overflow-hidden">
          <ProductsTable
            onSelectProduct={setSelectedProduct}
            selectedProduct={selectedProduct}
          />
        </div>
        <div className="lg:w-1/3 min-w-0 overflow-auto">
          <ProductDetails product={selectedProduct} />
        </div>
      </div>
    </div>
  );
}
