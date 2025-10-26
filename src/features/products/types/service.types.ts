export interface Products {
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