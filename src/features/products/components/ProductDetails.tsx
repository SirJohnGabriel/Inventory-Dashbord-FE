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
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p>
            This component is deprecated. Use ProductDetailsView or
            ProductDetailsEdit instead.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
