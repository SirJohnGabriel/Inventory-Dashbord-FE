import * as React from 'react';
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { productsService } from '../services/products.service';
import type { Product } from '../types';
import { createColumns } from '../components/Columns';
import { logger } from '@/shared/utils';
import { toast } from 'sonner';

export function useProductsTable(
  selectedProduct: Product | null,
  onSelectProduct: (product: Product | null) => void
) {
  const [data, setData] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const handleDeleteProduct = React.useCallback(
    async (productId: string) => {
      try {
        await productsService.removeProductById(productId);

        // Clear selected product if it's the one being deleted
        if (selectedProduct?.id === productId) {
          onSelectProduct(null);
        }

        // Immediately update the state after successful deletion
        setData((prevData) => {
          const newData = prevData.filter(
            (product) => product.id !== productId
          );
          console.log('Previous data count:', prevData.length);
          console.log('New data count:', newData.length);
          return newData;
        });
      } catch (error) {
        logger.error('Failed to delete product:', error);
        throw error; // Re-throw to let the caller handle it
      }
    },
    [selectedProduct, onSelectProduct]
  );

  // Create columns directly without useMemo to ensure fresh reference
  const columns = createColumns(handleDeleteProduct);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await productsService.fetchProducts();
        setData((response as unknown as Product[]) || []);
      } catch (error) {
        logger.error('Failed to fetch products:', error);
        toast.error('Failed to load products. Please try again.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    autoResetPageIndex: false, // Prevent page reset on data change
  });

  return {
    table,
    data,
    loading,
    columns,
  };
}
