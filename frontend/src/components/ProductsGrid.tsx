// components/ProductsGrid.tsx
import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/services/productsService";
import type { Category } from "@/services/categoriesService";

interface ProductsGridProps {
  products: Product[];
  categories: Category[];
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onView?: (product: Product) => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  categories,
  isAdmin = false,
  onEdit,
  onDelete,
  onView,
}) => {
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

  const handleView = (product: Product) => {
    if (onView) {
      onView(product);
    } else {
      // Default behavior - could navigate to product detail page
      console.log("View product:", product.id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group hover:shadow-lg transition-shadow"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold line-clamp-2">
                {product.product_name}
              </CardTitle>

              {/* Admin Actions */}
              {isAdmin && onEdit && onDelete && (
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onEdit(product)}
                    title="Edit product"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    onClick={() => onDelete(product)}
                    title="Delete product"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <Badge variant="secondary" className="w-fit">
              {getCategoryName(product.category_id)}
            </Badge>
          </CardHeader>

          <CardContent>
            {/* Product Image */}
            <div className="w-full h-64 mb-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => handleView(product)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "";
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector(".fallback-icon")) {
                      parent.innerHTML =
                        '<div class="fallback-icon w-16 h-16 text-gray-400 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>';
                    }
                  }}
                />
              ) : (
                <div className="w-16 h-16 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </div>

              <div className="flex items-center space-x-2">
                {/* Admin sees stock info and actions */}
                {isAdmin ? (
                  <>
                    <div className="text-right">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          product.in_stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        Stock: {product.in_stock}
                      </span>
                    </div>
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(product)}
                      >
                        Edit
                      </Button>
                    )}
                  </>
                ) : (
                  // Users see view details button
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(product)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                )}
              </div>
            </div>

            {/* Stock status for users */}
            {!isAdmin && (
              <div className="mt-3 text-center">
                <span
                  className={`text-sm font-medium ${
                    product.in_stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.in_stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
