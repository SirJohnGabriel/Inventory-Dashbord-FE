export interface Product {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    price: number;
    stockQuantity: number;
    sku: string;
    isDeleted: boolean;
    taxAmount: number | null;
    priceWithTax: number | null;
    convertedPrice: number | null;
    currencyCode: string | null;
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