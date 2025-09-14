// components/admin/ProductForm.tsx - Fixed version
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import type {
  CreateProductRequest,
  UpdateProductRequest,
  Product,
} from "@/services/productsService";
import type { Category } from "@/services/categoriesService";

interface ProductFormProps<
  T extends CreateProductRequest | UpdateProductRequest
> {
  mode: "create" | "edit";
  product?: Product;
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  categories: Category[];
  files: File[] | undefined;
  onFileDrop: (files: File[]) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  validationErrors?: Record<string, string>;
  onFileError?: (error: string) => void;
}

export const ProductForm = <
  T extends CreateProductRequest | UpdateProductRequest
>({
  mode,
  product,
  formData,
  setFormData,
  categories,
  files,
  onFileDrop,
  onSubmit,
  onCancel,
  isSubmitting,
  validationErrors = {},
  onFileError,
}: ProductFormProps<T>) => {
  const isValid = formData.product_name.trim() && formData.category_id !== 0;

  // Helper function to get error message for a field
  const getFieldError = (fieldName: string) => {
    return validationErrors[fieldName];
  };

  // Helper function to check if a field has an error
  const hasFieldError = (fieldName: string) => {
    return Boolean(validationErrors[fieldName]);
  };

  // Handle dropzone errors
  const handleDropzoneError = (err: Error) => {
    if (onFileError) {
      onFileError(err.message);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="productName">Product Name</Label>
        <Input
          id="productName"
          value={formData.product_name}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              product_name: e.target.value,
            }))
          }
          placeholder="Enter product name"
          disabled={isSubmitting}
          className={
            hasFieldError("product_name")
              ? "border-red-500 focus:border-red-500"
              : ""
          }
        />
        {hasFieldError("product_name") && (
          <p className="text-sm text-red-500">
            {getFieldError("product_name")}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          placeholder="Enter product description"
          disabled={isSubmitting}
          rows={3}
          className={
            hasFieldError("description")
              ? "border-red-500 focus:border-red-500"
              : ""
          }
        />
        {hasFieldError("description") && (
          <p className="text-sm text-red-500">{getFieldError("description")}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="text"
            inputMode="decimal"
            value={formData.price === 0 ? "" : formData.price.toString()}
            onChange={(e) => {
              const value = e.target.value;
              // Allow empty string, numbers, and decimal point
              if (value === "" || /^\d*\.?\d*$/.test(value)) {
                const numValue = value === "" ? 0 : parseFloat(value);
                if (!isNaN(numValue) && numValue >= 0) {
                  setFormData((prev) => ({
                    ...prev,
                    price: numValue,
                  }));
                }
              }
            }}
            onBlur={(e) => {
              // Format to 2 decimal places on blur if there's a value
              const value = parseFloat(e.target.value);
              if (!isNaN(value) && value > 0) {
                setFormData((prev) => ({
                  ...prev,
                  price: parseFloat(value.toFixed(2)),
                }));
              }
            }}
            placeholder="0.00"
            disabled={isSubmitting}
            className={
              hasFieldError("price")
                ? "border-red-500 focus:border-red-500"
                : ""
            }
          />
          {hasFieldError("price") && (
            <p className="text-sm text-red-500">{getFieldError("price")}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="text"
            inputMode="numeric"
            value={formData.in_stock === 0 ? "" : formData.in_stock.toString()}
            onChange={(e) => {
              const value = e.target.value;
              // Allow empty string and positive integers only
              if (value === "" || /^\d+$/.test(value)) {
                const numValue = value === "" ? 0 : parseInt(value, 10);
                if (!isNaN(numValue) && numValue >= 0) {
                  setFormData((prev) => ({
                    ...prev,
                    in_stock: numValue,
                  }));
                }
              }
            }}
            placeholder="0"
            disabled={isSubmitting}
            className={
              hasFieldError("in_stock")
                ? "border-red-500 focus:border-red-500"
                : ""
            }
          />
          {hasFieldError("in_stock") && (
            <p className="text-sm text-red-500">{getFieldError("in_stock")}</p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={
            formData.category_id === 0
              ? undefined
              : formData.category_id.toString()
          }
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              category_id: parseInt(value),
            }))
          }
          disabled={isSubmitting}
        >
          <SelectTrigger
            className={
              hasFieldError("category_id")
                ? "border-red-500 focus:border-red-500"
                : ""
            }
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.category_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFieldError("category_id") && (
          <p className="text-sm text-red-500">{getFieldError("category_id")}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label>Product Image {mode === "edit" && "(optional)"}</Label>

        {/* Show current image for edit mode */}
        {mode === "edit" && product?.image_url && (
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md border">
            <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={product.image_url}
                alt="Current"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 truncate">Current image</p>
              {files && files.length > 0 && (
                <p className="text-xs text-amber-600">Will be replaced</p>
              )}
            </div>
          </div>
        )}

        <Dropzone
          accept={{ "image/*": [] }}
          maxFiles={1}
          multiple={false}
          maxSize={1024 * 1024 * 2}
          minSize={1024}
          onDrop={onFileDrop}
          onError={handleDropzoneError}
          src={files}
          className={hasFieldError("image") ? "border-red-500" : ""}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
        {hasFieldError("image") && (
          <p className="text-sm text-red-500">{getFieldError("image")}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting || !isValid}>
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Updating..."
            : mode === "create"
            ? "Create Product"
            : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
