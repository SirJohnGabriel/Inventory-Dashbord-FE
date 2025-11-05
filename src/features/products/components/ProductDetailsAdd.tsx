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
import { useAppStore } from '@shared/store';
import { useProductAdd } from '../hooks';

interface ProductDetailsAddProps {
  onSaveComplete: () => void;
  onCancel: () => void;
}

export function ProductDetailsAdd({
  onSaveComplete,
  onCancel,
}: ProductDetailsAddProps) {
  const lookups = useAppStore((s) => s.lookups);
  const categories = lookups?.Categories || [];

  const add = useProductAdd(() => {
    onSaveComplete();
  });

  const handleCancel = () => {
    add.cancelAdding();
    onCancel();
  };

  return (
    <Card className="h-full w-full flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle className="text-md">Add New Product</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col gap-2">
          <Label>Name</Label>
          <Input
            value={add.formData.name}
            onChange={(e) => add.updateField('name', e.target.value)}
            maxLength={250}
            placeholder="Product name"
          />
          {add.errors.name && (
            <p className="text-destructive text-sm mt-1">{add.errors.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Description</Label>
          <Textarea
            value={add.formData.description}
            onChange={(e) => add.updateField('description', e.target.value)}
            maxLength={250}
            placeholder="Product description"
          />
          {add.errors.description && (
            <p className="text-destructive text-sm mt-1">
              {add.errors.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Category</Label>
          <Select
            value={add.formData.categoryId}
            onValueChange={(val) => add.updateField('categoryId', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.key} value={c.key}>
                  {c.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {add.errors.categoryId && (
            <p className="text-destructive text-sm mt-1">
              {add.errors.categoryId}
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
                value={add.formData.price}
                onChange={(e) => add.updateField('price', e.target.value)}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>PHP</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            {add.errors.price && (
              <p className="text-destructive text-sm mt-1">
                {add.errors.price}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Stock Quantity</Label>
            <Input
              type="number"
              value={add.formData.stockQuantity}
              onChange={(e) => add.updateField('stockQuantity', e.target.value)}
              step="1"
              inputMode="numeric"
              placeholder="0"
            />
            {add.errors.stockQuantity && (
              <p className="text-destructive text-sm mt-1">
                {add.errors.stockQuantity}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>SKU</Label>
          <Input
            value={add.formData.sku}
            onChange={(e) => add.updateField('sku', e.target.value)}
            maxLength={15}
            placeholder="Product SKU"
          />
          {add.errors.sku && (
            <p className="text-destructive text-sm mt-1">{add.errors.sku}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={add.saveProduct} disabled={add.isSaving}>
            {add.isSaving ? 'Adding...' : 'Add Product'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
