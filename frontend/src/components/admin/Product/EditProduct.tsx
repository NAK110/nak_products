import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProductForm } from "./ProductForm";
import type { Product, UpdateProductRequest } from "@/services/productsService";
import type { Category } from "@/services/categoriesService";

interface EditProductDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product: Product | null;
  formData: UpdateProductRequest;
  setFormData: React.Dispatch<React.SetStateAction<UpdateProductRequest>>;
  categories: Category[];
  files: File[] | undefined;
  onFileDrop: (files: File[]) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error?: string | null;
  clearError?: () => void;
  validationErrors?: Record<string, string>;
}

export const EditProductDialog: React.FC<EditProductDialogProps> = ({
  isOpen,
  setIsOpen,
  product,
  formData,
  setFormData,
  categories,
  files,
  onFileDrop,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
  clearError,
  validationErrors,
}) => {
  // Local state for file upload errors
  const [fileError, setFileError] = useState<string | null>(null);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setFileError(null); // Clear file error
      if (clearError) {
        clearError();
      }
    }
  };

  const handleCancel = () => {
    setFileError(null); // Clear file error
    onCancel();
    if (clearError) {
      clearError();
    }
  };

  const handleFileError = (errorMessage: string) => {
    setFileError(errorMessage);
  };

  // Clear file error when files change successfully
  const handleFileDrop = (files: File[]) => {
    setFileError(null); // Clear any previous file error
    onFileDrop(files);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {/* General Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* File Error Alert */}
        {fileError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{fileError}</AlertDescription>
          </Alert>
        )}

        <ProductForm
          mode="edit"
          product={product || undefined}
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          files={files}
          onFileDrop={handleFileDrop}
          onSubmit={onSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          validationErrors={validationErrors}
          onFileError={handleFileError}
        />
      </DialogContent>
    </Dialog>
  );
};