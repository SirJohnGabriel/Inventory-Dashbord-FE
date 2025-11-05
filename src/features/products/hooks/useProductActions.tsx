import * as React from 'react';
import { logger } from '@/shared/utils';
import { toast } from 'sonner';
import { TrashIcon } from '@phosphor-icons/react';

export function useProductActions() {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const handleDelete = React.useCallback(
    async (
      productId: string,
      onDelete: (productId: string) => Promise<void>
    ) => {
      try {
        setShowDeleteDialog(false);
        await onDelete(productId);
        toast.success('Product deleted successfully.', {
          icon: (
            <TrashIcon size={20} weight="duotone" className="text-primary" />
          ),
        });
      } catch (error) {
        toast.error('Failed to delete product. Please try again.');
        logger.error('Failed to delete product:', error);
      }
    },
    []
  );

  const handleCopySKU = React.useCallback((sku: string) => {
    navigator.clipboard.writeText(sku);
  }, []);

  const openDeleteDialog = React.useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const closeDeleteDialog = React.useCallback((open: boolean) => {
    setShowDeleteDialog(open);
  }, []);

  return {
    showDeleteDialog,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    handleCopySKU,
  };
}
