import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/shared/components/ui';
import type { Product } from '../types';
import { ProductActionsCell } from './ProductActionsCell';
import { getCategoryName } from '../utils';

export const createColumns = (
  onDelete: (productId: string) => Promise<void>,
  onEdit?: (product: Product) => void
): ColumnDef<Product>[] => [
  {
    accessorKey: 'name',
    id: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">{row.getValue('name')}</div>
    ),
    size: 200,
    meta: {
      displayName: 'Name',
    },
  },
  {
    accessorKey: 'price',
    id: 'price',
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(price);

      return <div className="text-right font-medium">{formatted}</div>;
    },
    size: 120,
    meta: {
      displayName: 'Price',
    },
  },
  {
    accessorKey: 'stockQuantity',
    id: 'stockQuantity',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Quantity
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('stockQuantity')}</div>,
    size: 100,
    meta: {
      displayName: 'Stock Quantity',
    },
  },
  {
    accessorKey: 'categoryId',
    id: 'categoryId',
    header: 'Category',
    cell: ({ row }) => {
      const categoryId = row.getValue('categoryId') as string;
      const categoryName = getCategoryName(categoryId);
      return <div className="max-w-[150px] truncate">{categoryName}</div>;
    },
    size: 150,
    meta: {
      displayName: 'Category',
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <ProductActionsCell
          product={product}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      );
    },
    size: 60,
  },
];
