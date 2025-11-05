import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { productsService } from '../services/products.service';
import type { AddProductRequest } from '../types';
import { logger } from '@/shared/utils';

interface FormData {
  name: string;
  description: string;
  categoryId: string;
  price: string;
  stockQuantity: string;
  sku: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  categoryId?: string;
  price?: string;
  stockQuantity?: string;
  sku?: string;
}

const initialFormData: FormData = {
  name: '',
  description: '',
  categoryId: '',
  price: '',
  stockQuantity: '',
  sku: '',
};

export function useProductAdd(onProductAdded: () => void) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for the field being edited
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required.';
    } else if (formData.name.length > 250) {
      newErrors.name = 'Product name must not exceed 250 characters.';
    }

    // Description validation (optional, only validate length if provided)
    if (formData.description.length > 250) {
      newErrors.description =
        'Product description must not exceed 250 characters.';
    }

    // Category validation
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category ID is required.';
    }

    // SKU validation
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required.';
    } else if (formData.sku.length > 100) {
      newErrors.sku = 'SKU must not exceed 100 characters.';
    }

    // Price validation
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum) || priceNum < 0) {
        newErrors.price = 'Price must be a non-negative value.';
      } else if (!/^\d+(\.\d{1,2})?$/.test(formData.price)) {
        newErrors.price = 'Price must have at most 2 decimal places';
      }
    }

    // Stock quantity validation
    if (!formData.stockQuantity.trim()) {
      newErrors.stockQuantity = 'Stock quantity is required';
    } else {
      const stockNum = parseInt(formData.stockQuantity, 10);
      if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
        newErrors.stockQuantity =
          'Stock quantity must be a non-negative value.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const saveProduct = useCallback(async () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setIsSaving(true);
    try {
      const payload: AddProductRequest = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        categoryId: formData.categoryId,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10),
        sku: formData.sku.trim(),
      };

      logger.info('Adding product with payload:', payload);
      const response = await productsService.addProduct(payload);
      logger.info('Add product response:', response);

      toast.success('Product added successfully');
      onProductAdded();
    } catch (error) {
      logger.error('Failed to add product:', error);
      toast.error('Failed to add product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [formData, validateForm, onProductAdded]);

  const cancelAdding = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSaving,
    updateField,
    saveProduct,
    cancelAdding,
  };
}
