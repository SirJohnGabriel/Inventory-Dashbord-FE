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
  onSelectProduct: (product: Product | null) => void,
  columnVisibility: VisibilityState,
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>,
  onEditProduct?: (product: Product) => void,
  reloadKey?: number
) {
  const [data, setData] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const handleDeleteProduct = React.useCallback(
    async (productId: string) => {
      try {
        await productsService.removeProductById(productId);

        // Clear selected product by calling parent handler
        onSelectProduct(null);

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
    [onSelectProduct]
  );

  // Use useMemo for columns to ensure they update with state changes
  const columns = React.useMemo(
    () => createColumns(handleDeleteProduct, onEditProduct),
    [handleDeleteProduct, onEditProduct]
  );

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
    // include reloadKey so parent can trigger a refetch after updates
  }, [reloadKey]);

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
