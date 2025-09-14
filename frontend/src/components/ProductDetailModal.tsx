// components/ProductDetailModal.tsx - Fixed duplicate close buttons
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/services/productsService";
import type { Category } from "@/services/categoriesService";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  categories,
}) => {
  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.category_name || "Unknown Category";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* Removed the custom close button - shadcn Dialog has its own */}
          <DialogTitle className="text-2xl font-bold">
            {product.product_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image */}
          {product.image_url && (
            <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={product.image_url}
                alt={product.product_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Product Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-sm">
                {getCategoryName(product.category_id)}
              </Badge>
              <div className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Availability */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Availability:</span>
              <span
                className={`font-semibold ${
                  product.in_stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.in_stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button className="flex-1" disabled={product.in_stock === 0}>
                {product.in_stock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button variant="outline">Add to Wishlist</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
