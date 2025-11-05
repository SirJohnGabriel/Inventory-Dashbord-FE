import { flexRender } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/shared/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/components/ui/DropdownMenu';
import { Input } from '@/shared/components/ui/Input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/Table';
import { Card } from '@/shared/components/ui';
import type { Product } from '../types';
import { useProductsTable } from '../hooks';
import type { VisibilityState } from '@tanstack/react-table';

interface ProductsTableProps {
  onSelectProduct: (product: Product | null) => void;
  onEditProduct?: (product: Product) => void;
  onAddProduct?: () => void;
  reloadKey?: number;
}

export function ProductsTable({
  onSelectProduct,
  onEditProduct,
  onAddProduct,
  reloadKey,
}: ProductsTableProps) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const handleColumnVisibilityChange = React.useCallback(
    (
      updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
    ) => {
      setColumnVisibility(updater);
      forceUpdate();
    },
    []
  );

  const { table, data, loading } = useProductsTable(
    onSelectProduct,
    columnVisibility,
    handleColumnVisibilityChange,
    onEditProduct,
    reloadKey
  );

  if (loading) {
    return <div className="p-8 text-center">Loading products...</div>;
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center py-4 px-6">
        <Input
          placeholder="Filter products by name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button variant="outline" className="ml-2" onClick={onAddProduct}>
          Add New Product
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const meta = column.columnDef.meta as
                  | { displayName?: string }
                  | undefined;
                const displayName = meta?.displayName || column.id;
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {displayName}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex-1 overflow-auto px-6">
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    if (!header.column.getIsVisible()) return null;
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => onSelectProduct(row.original)}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => {
                      if (!cell.column.getIsVisible()) return null;
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleLeafColumns().length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 px-6">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getRowModel().rows.length} of {data.length} products shown.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
