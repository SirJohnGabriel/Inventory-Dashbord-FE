import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Button,
  Textarea,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
} from '@/shared/components/ui';
import type { Product } from '../types';
import { useAppStore } from '@shared/store';
import { useProductEdit } from '../hooks/useProductEdit';

interface ProductDetailsEditProps {
  product: Product;
  onSaveComplete: (updatedProduct: Product) => void;
  onCancel: () => void;
}

export function ProductDetailsEdit({
  product,
  onSaveComplete,
  onCancel,
}: ProductDetailsEditProps) {
  const lookups = useAppStore((s) => s.lookups);
  const categories = lookups?.Categories || [];

  const edit = useProductEdit(product, (updatedProduct) => {
    onSaveComplete(updatedProduct);
  });

  React.useEffect(() => {
    edit.startEditing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = () => {
    edit.cancelEditing();
    onCancel();
  };

  return (
    <Card className="h-full w-full flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle className="text-md">Edit: {product.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 min-h-0 overflow-y-auto">
        {/*  removed overflow-x-hidden */}
        <div className="flex flex-col gap-2">
          <Label>Name</Label>
          <Input
            value={edit.formData.name}
            onChange={(e) => edit.updateField('name', e.target.value)}
            maxLength={250}
          />
          {edit.errors.name && (
            <p className="text-destructive text-sm mt-1">{edit.errors.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Description</Label>
          <Textarea
            value={edit.formData.description}
            onChange={(e) => edit.updateField('description', e.target.value)}
            maxLength={250}
          />
          {edit.errors.description && (
            <p className="text-destructive text-sm mt-1">
              {edit.errors.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Category</Label>
          <Select
            value={edit.formData.categoryId}
            onValueChange={(val) => edit.updateField('categoryId', val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.key} value={c.key}>
                  {c.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {edit.errors.categoryId && (
            <p className="text-destructive text-sm mt-1">
              {edit.errors.categoryId}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Price</Label>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>₱</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                placeholder="0.00"
                value={edit.formData.price}
                onChange={(e) => edit.updateField('price', e.target.value)}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>PHP</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            {/* <Input
              type="number"
              value={edit.formData.price}
              onChange={(e) => edit.updateField('price', e.target.value)}
              step="0.01"
              inputMode="decimal"
            /> */}
            {edit.errors.price && (
              <p className="text-destructive text-sm mt-1">
                {edit.errors.price}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Stock Quantity</Label>
            <Input
              type="number"
              value={edit.formData.stockQuantity}
              onChange={(e) =>
                edit.updateField('stockQuantity', e.target.value)
              }
              step="1"
              inputMode="numeric"
            />
            {edit.errors.stockQuantity && (
              <p className="text-destructive text-sm mt-1">
                {edit.errors.stockQuantity}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>SKU</Label>
          <Input
            value={edit.formData.sku}
            onChange={(e) => edit.updateField('sku', e.target.value)}
            maxLength={15}
          />
          {edit.errors.sku && (
            <p className="text-destructive text-sm mt-1">{edit.errors.sku}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={edit.saveChanges}
            disabled={edit.isSaving || !edit.hasChanges}
          >
            {edit.isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
