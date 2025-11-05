import {
  ProductsTable,
  ProductDetailsView,
  ProductDetailsEdit,
  ProductDetailsAdd,
} from './components';
import { useProducts } from './hooks';

export function Products() {
  const {
    selectedProduct,
    mode,
    reloadKey,
    handleSelectProduct,
    handleEditRequest,
    handleSaveComplete,
    handleCancelEdit,
    handleAddRequest,
    handleAddComplete,
    handleCancelAdd,
  } = useProducts();

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden px-8">
        <div className="lg:w-2/3 min-w-0 overflow-hidden">
          <ProductsTable
            onSelectProduct={handleSelectProduct}
            onEditProduct={handleEditRequest}
            onAddProduct={handleAddRequest}
            reloadKey={reloadKey}
          />
        </div>
        {mode === 'add' ? (
          <div className="lg:w-1/3 min-w-0 max-w-[33.333%] overflow-hidden">
            <ProductDetailsAdd
              onSaveComplete={handleAddComplete}
              onCancel={handleCancelAdd}
            />
          </div>
        ) : mode === 'edit' && selectedProduct ? (
          <div className="lg:w-1/3 min-w-0 max-w-[33.333%] overflow-hidden">
            <ProductDetailsEdit
              product={selectedProduct}
              onSaveComplete={handleSaveComplete}
              onCancel={handleCancelEdit}
            />
          </div>
        ) : (
          <div className="lg:w-1/3 min-w-0 max-w-[33.333%] overflow-hidden">
            <ProductDetailsView product={selectedProduct} />
          </div>
        )}
      </div>
    </div>
  );
}
// <div className="flex flex-col h-full px-8 bg-background overflow-hidden">
//   <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
//     <div className="lg:w-2/3 min-w-0 overflow-hidden">
//       <ProductsTable
//         onSelectProduct={setSelectedProduct}
//         selectedProduct={selectedProduct}
//       />
//     </div>
//     <div className="lg:w-1/3 min-w-0 overflow-auto">
//       <ProductDetails product={selectedProduct} />
//     </div>
//   </div>
