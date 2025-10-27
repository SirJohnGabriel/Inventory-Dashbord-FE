import { useState } from 'react';
import type { Product } from '../types';

export function useProducts() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return {
    selectedProduct,
    setSelectedProduct,
  };
}
