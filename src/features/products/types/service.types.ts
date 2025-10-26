export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stockQuantity: number;
  sku: string;
  isDeleted: boolean;
  taxAmount?: number;
  priceWithTax?: number;
  convertedPrice?: number;
  currencyCode?: string;
}

export interface AddProductRequest {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stockQuantity: number;
  sku: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  stockQuantity?: number;
  sku?: string;
}
