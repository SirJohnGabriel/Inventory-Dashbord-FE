import { useState, useCallback, useEffect } from 'react';
import type { Product } from '../types';
import { useAppStore } from '@shared/store';
import { lookupService } from '@shared/services';
import { logger } from '@shared/utils';

export function useProducts() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mode, setMode] = useState<'view' | 'edit' | 'add'>('view');
  const [reloadKey, setReloadKey] = useState(0);
  const { setLookups, setLookupsLoading } = useAppStore();

  useEffect(() => {
    const fetchLookupsData = async () => {
      try {
        setLookupsLoading(true);
        const response = await lookupService.fetchLookups();
        logger.info('response:', response);
        logger.info('response data:', response.data);
        setLookups(response);
      } catch (error) {
        logger.error('Failed to fetch lookups:', error);
      } finally {
        setLookupsLoading(false);
      }
    };
    fetchLookupsData();
  }, [setLookups, setLookupsLoading]);

  // Called when user selects a row - show view mode
  const handleSelectProduct = useCallback((product: Product | null) => {
    setSelectedProduct(product);
    setMode('view');
  }, []);

  // Called from ProductActionsCell when "Edit Product" is clicked - show edit mode
  const handleEditRequest = useCallback((product: Product) => {
    setSelectedProduct(product);
    setMode('edit');
  }, []);

  // Called after successful save - return to view mode and refresh table
  const handleSaveComplete = useCallback((updatedProduct: Product) => {
    setSelectedProduct(updatedProduct);
    setMode('view');
    setReloadKey((k) => k + 1);
  }, []);

  // Called when user cancels editing - return to view mode
  const handleCancelEdit = useCallback(() => {
    setMode('view');
  }, []);

  // Called when user clicks "Add New Product" button - show add mode
  const handleAddRequest = useCallback(() => {
    setSelectedProduct(null);
    setMode('add');
  }, []);

  // Called after successfully adding a new product - refresh table and clear selection
  const handleAddComplete = useCallback(() => {
    setSelectedProduct(null);
    setMode('view');
    setReloadKey((k) => k + 1);
  }, []);

  // Called when user cancels adding - return to view mode
  const handleCancelAdd = useCallback(() => {
    setMode('view');
  }, []);

  return {
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
  };
}
