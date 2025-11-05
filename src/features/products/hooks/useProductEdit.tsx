import * as React from 'react';
import type { Product, UpdateProductRequest } from '../types';
import { productsService } from '../services/products.service';
import { logger } from '@/shared/utils';
import { toast } from 'sonner';
import { PencilSimple } from '@phosphor-icons/react';

export interface ProductFormData {
  name: string;
  description: string;
  categoryId: string;
  price: string;
  stockQuantity: string;
  sku: string;
}

export interface ValidationErrors {
  name?: string;
  description?: string;
  categoryId?: string;
  price?: string;
  stockQuantity?: string;
  sku?: string;
}

export function useProductEdit(
  product: Product | null,
  onProductUpdated: (updatedProduct: Product) => void
) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formData, setFormData] = React.useState<ProductFormData>({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    stockQuantity: '',
    sku: '',
  });
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [originalData, setOriginalData] =
    React.useState<ProductFormData | null>(null);

  // Reset editing mode when product changes
  React.useEffect(() => {
    setIsEditing(false);
    setErrors({});
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      price: '',
      stockQuantity: '',
      sku: '',
    });
    setOriginalData(null);
  }, [product?.id]);

  // Initialize form data when edit mode is entered
  React.useEffect(() => {
    if (product && isEditing) {
      const initialData = {
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        price: product.price.toString(),
        stockQuantity: product.stockQuantity.toString(),
        sku: product.sku,
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [product, isEditing]);

  const startEditing = React.useCallback(() => {
    setIsEditing(true);
    setErrors({});
  }, []);

  const cancelEditing = React.useCallback(() => {
    setIsEditing(false);
    setErrors({});
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      price: '',
      stockQuantity: '',
      sku: '',
    });
    setOriginalData(null);
  }, []);

  const validateForm = React.useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    // Name validation (max 250 characters, required)
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 250) {
      newErrors.name = 'Name must be 250 characters or less';
    }

    // Description validation (max 250 characters, required)
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 250) {
      newErrors.description = 'Description must be 250 characters or less';
    }

    // Category validation (required)
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    // Price validation (required, positive number with max 2 decimal places)
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum) || priceNum < 0) {
        newErrors.price = 'Price must be a positive number';
      } else {
        // Check decimal places
        const decimalPart = formData.price.split('.')[1];
        if (decimalPart && decimalPart.length > 2) {
          newErrors.price = 'Price can have at most 2 decimal places';
        }
      }
    }

    // Stock quantity validation (required, whole number, non-negative)
    if (!formData.stockQuantity.trim()) {
      newErrors.stockQuantity = 'Stock quantity is required';
    } else {
      const stockNum = parseInt(formData.stockQuantity, 10);
      if (
        isNaN(stockNum) ||
        stockNum < 0 ||
        !Number.isInteger(Number(formData.stockQuantity))
      ) {
        newErrors.stockQuantity = 'Stock quantity must be a whole number';
      }
    }

    // SKU validation (max 15 characters, required)
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    } else if (formData.sku.length > 100) {
      newErrors.sku = 'SKU must be 100 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const hasChanges = React.useMemo(() => {
    if (!originalData) return false;

    return (
      formData.name !== originalData.name ||
      formData.description !== originalData.description ||
      formData.categoryId !== originalData.categoryId ||
      formData.price !== originalData.price ||
      formData.stockQuantity !== originalData.stockQuantity ||
      formData.sku !== originalData.sku
    );
  }, [formData, originalData]);

  const getChangedFields =
    React.useCallback((): UpdateProductRequest | null => {
      if (!originalData || !product) return null;

      const changes: UpdateProductRequest = {};
      let hasChanges = false;

      // Check each field for changes
      if (formData.name !== originalData.name) {
        changes.name = formData.name;
        hasChanges = true;
      }

      if (formData.description !== originalData.description) {
        changes.description = formData.description;
        hasChanges = true;
      }

      if (formData.categoryId !== originalData.categoryId) {
        changes.categoryId = formData.categoryId;
        hasChanges = true;
      }

      if (formData.price !== originalData.price) {
        changes.price = parseFloat(formData.price);
        hasChanges = true;
      }

      if (formData.stockQuantity !== originalData.stockQuantity) {
        changes.stockQuantity = parseInt(formData.stockQuantity, 10);
        hasChanges = true;
      }

      if (formData.sku !== originalData.sku) {
        changes.sku = formData.sku;
        hasChanges = true;
      }

      return hasChanges ? changes : null;
    }, [formData, originalData, product]);

  const saveChanges = React.useCallback(async () => {
    if (!product) return;

    // Validate form
    if (!validateForm()) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    // Get only changed fields
    const changes = getChangedFields();

    // This should not happen since button is disabled when no changes
    if (!changes) {
      return;
    }

    try {
      setIsSaving(true);
      const response = await productsService.updateProduct(product.id, changes);

      // Update the product in the parent component
      onProductUpdated(response.data as unknown as Product);

      toast.success('Product updated successfully', {
        icon: (
          <PencilSimple size={20} weight="duotone" className="text-primary" />
        ),
      });

      cancelEditing();
    } catch (error) {
      logger.error('Failed to update product:', error);
      toast.error('Failed to update product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [
    product,
    validateForm,
    getChangedFields,
    cancelEditing,
    onProductUpdated,
  ]);

  const updateField = React.useCallback(
    <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  return {
    isEditing,
    isSaving,
    formData,
    errors,
    hasChanges,
    startEditing,
    cancelEditing,
    saveChanges,
    updateField,
  };
}
