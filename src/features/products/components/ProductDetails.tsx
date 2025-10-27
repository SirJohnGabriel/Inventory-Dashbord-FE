import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui';
import type { Product } from '../types';

interface ProductDetailsProps {
  product: Product | null;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  if (!product) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Select a product to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Description
          </label>
          <p className="mt-1 text-sm">{product.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              SKU
            </label>
            <p className="mt-1 text-sm font-mono">{product.sku}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Category ID
            </label>
            <p className="mt-1 text-sm font-mono break-all">
              {product.categoryId}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Price
            </label>
            <p className="mt-1 text-sm font-semibold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'PHP',
              }).format(product.price)}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Stock Quantity
            </label>
            <p
              className={`mt-1 text-sm font-semibold ${
                product.stockQuantity === 0
                  ? 'text-red-600 dark:text-red-400'
                  : product.stockQuantity < 10
                    ? 'text-orange-600 dark:text-orange-400'
                    : product.stockQuantity < 25
                      ? 'text-yellow-600 dark:text-yellow-500'
                      : 'text-green-600 dark:text-green-400'
              }`}
            >
              {product.stockQuantity}
            </p>
          </div>
        </div>

        {(product.taxAmount !== undefined ||
          product.priceWithTax !== undefined) && (
          <div className="grid grid-cols-2 gap-4">
            {product.taxAmount !== undefined && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Tax Amount
                </label>
                <p className="mt-1 text-sm">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'PHP',
                  }).format(product.taxAmount)}
                </p>
              </div>
            )}

            {product.priceWithTax !== undefined && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Price with Tax
                </label>
                <p className="mt-1 text-sm font-semibold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'PHP',
                  }).format(product.priceWithTax)}
                </p>
              </div>
            )}
          </div>
        )}

        {product.convertedPrice && product.currencyCode && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Converted Price ({product.currencyCode})
            </label>
            <p className="mt-1 text-sm">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: product.currencyCode,
              }).format(product.convertedPrice)}
            </p>
          </div>
        )}

        <div className="border-t">
          {/* <label className="text-sm font-medium text-muted-foreground">
            Product ID
          </label>
          <p className="mt-1 text-xs font-mono break-all text-muted-foreground">
            {product.id}
          </p> */}
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Status
          </label>
          <p className="mt-1">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                product.isDeleted
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}
            >
              {product.isDeleted ? 'Deleted' : 'Active'}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
