import React, { useState } from "react";
import { Plus, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProductForm } from "./ProductForm";
import type { CreateProductRequest } from "@/services/productsService";
import type { Category } from "@/services/categoriesService";

interface CreateProductDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formData: CreateProductRequest;
  setFormData: React.Dispatch<React.SetStateAction<CreateProductRequest>>;
  categories: Category[];
  files: File[] | undefined;
  onFileDrop: (files: File[]) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  resetForm: () => void;
  error?: string | null;
  clearError?: () => void;
  validationErrors?: Record<string, string>;
}

export const CreateProductDialog: React.FC<CreateProductDialogProps> = ({
  isOpen,
  setIsOpen,
  formData,
  setFormData,
  categories,
  files,
  onFileDrop,
  onSubmit,
  isSubmitting,
  resetForm,
  error,
  clearError,
  validationErrors,
}) => {
  // Local state for file upload errors
  const [fileError, setFileError] = useState<string | null>(null);

  const handleCancel = () => {
    setIsOpen(false);
    resetForm();
    setFileError(null); // Clear file error
    if (clearError) {
      clearError();
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
      setFileError(null); // Clear file error
      if (clearError) {
        clearError();
      }
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
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>
            Enter the details for your new product.
          </DialogDescription>
        </DialogHeader>

        {/* General Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {fileError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{fileError}</AlertDescription>
          </Alert>
        )}

        <ProductForm
          mode="create"
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
