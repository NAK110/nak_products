// pages/ProductsPage.tsx - Fixed to use AuthContext
import React, { useState, useEffect } from "react";
import { Package, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateProductDialog } from "@/components/admin/Product/CreateProduct";
import { EditProductDialog } from "@/components/admin/Product/EditProduct";
import { DeleteProductDialog } from "@/components/admin/Product/DeleteProduct";
import { ProductsTable } from "@/components/admin/Product/ProductsTable";
import { ProductsGrid } from "@/components/ProductsGrid";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { useProductCrud } from "@/hooks/useProductCrud";
import { useAuth } from "@/contexts/AuthContext";
import categoriesService, { type Category } from "@/services/categoriesService";
import type {
  CreateProductRequest,
  UpdateProductRequest,
  Product,
} from "@/services/productsService";

const ProductsPage: React.FC = () => {
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    loadProducts,
    clearError,
  } = useProductCrud();

  // ✅ Use AuthContext instead of local state
  const { user: currentUser } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [files, setFiles] = useState<File[] | undefined>();

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form states
  const [newProduct, setNewProduct] = useState<CreateProductRequest>({
    product_name: "",
    description: "",
    price: 0,
    in_stock: 0,
    image_url: "",
    category_id: 0,
    image: undefined,
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingData, setEditingData] = useState<UpdateProductRequest>({
    product_name: "",
    description: "",
    price: 0,
    in_stock: 0,
    image_url: "",
    category_id: 0,
    image: undefined,
  });
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const isAdmin = currentUser?.role === "admin";
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await categoriesService.getAll();
        setCategories(categoriesData);
        await loadProducts();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [loadProducts]);

  // CRUD Handlers
  const handleCreateProduct = async () => {
    setIsCreating(true);
    const result = await createProduct({
      ...newProduct,
      product_name: newProduct.product_name.trim(),
      description: newProduct.description?.trim() || "",
      image: newProduct.image,
    });

    if (result) {
      resetCreateForm();
      setIsCreateDialogOpen(false);
    }
    setIsCreating(false);
  };

  const handleEditStart = (product: Product) => {
    setEditingProduct(product);
    setEditingData({
      product_name: product.product_name,
      description: product.description || "",
      price: product.price,
      in_stock: product.in_stock,
      image_url: product.image_url || "",
      category_id: product.category_id,
      image: undefined,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!editingProduct) return;

    setIsUpdating(true);
    const result = await updateProduct(editingProduct.id, {
      ...editingData,
      product_name: editingData.product_name.trim(),
      description: editingData.description?.trim() || "",
      image: editingData.image,
    });

    if (result) {
      handleEditCancel();
    }
    setIsUpdating(false);
  };

  const handleEditCancel = () => {
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    setFiles(undefined);
  };

  const handleDeleteStart = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;

    setIsDeleting(true);
    const success = await deleteProduct(deletingProduct.id);

    if (success) {
      setIsDeleteDialogOpen(false);
      setDeletingProduct(null);
    }
    setIsDeleting(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeletingProduct(null);
  };

  const handleProductView = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleFileDrop = (droppedFiles: File[]) => {
    setFiles(droppedFiles);

    if (isCreateDialogOpen && droppedFiles.length > 0) {
      setNewProduct((prev) => ({ ...prev, image: droppedFiles[0] }));
    }

    if (isEditDialogOpen && droppedFiles.length > 0) {
      setEditingData((prev) => ({ ...prev, image: droppedFiles[0] }));
    }
  };

  const resetCreateForm = () => {
    setNewProduct({
      product_name: "",
      description: "",
      price: 0,
      in_stock: 0,
      image_url: "",
      category_id: 0,
      image: undefined,
    });
    setFiles(undefined);
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.product_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.category_id === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            </div>
            <p className="text-gray-600 mt-2">
              {isAdmin
                ? "Manage your product inventory"
                : "Browse available products"}
            </p>
          </div>

          {/* Create Product Button - Admin Only */}
          {isAdmin && (
            <CreateProductDialog
              isOpen={isCreateDialogOpen}
              setIsOpen={setIsCreateDialogOpen}
              formData={newProduct}
              setFormData={setNewProduct}
              categories={categories}
              files={files}
              onFileDrop={handleFileDrop}
              onSubmit={handleCreateProduct}
              isSubmitting={isCreating}
              resetForm={resetCreateForm}
            />
          )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.category_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Results count */}
        <div className="flex items-center text-sm text-gray-600 whitespace-nowrap">
          {filteredProducts.length} of {products.length} products
          {selectedCategory !== "all" && (
            <span className="ml-1">
              in{" "}
              {
                categories.find((c) => c.id.toString() === selectedCategory)
                  ?.category_name
              }
            </span>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={clearError}>
            ✕
          </Button>
        </div>
      )}

      {/* Content - Role-based Views */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Package className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory !== "all"
              ? "Try adjusting your search or filters."
              : "No products have been added yet."}
          </p>
          {isAdmin && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Product
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* ADMIN VIEW: Always Table */}
          {isAdmin && (
            <ProductsTable
              products={filteredProducts}
              categories={categories}
              onEdit={handleEditStart}
              onDelete={handleDeleteStart}
            />
          )}

          {/* USER VIEW: Always Grid */}
          {!isAdmin && (
            <ProductsGrid
              products={filteredProducts}
              categories={categories}
              isAdmin={false}
              onView={handleProductView}
            />
          )}
        </>
      )}

      {/* Admin-only Dialogs */}
      {isAdmin && (
        <>
          <EditProductDialog
            isOpen={isEditDialogOpen}
            setIsOpen={setIsEditDialogOpen}
            product={editingProduct}
            formData={editingData}
            setFormData={setEditingData}
            categories={categories}
            files={files}
            onFileDrop={handleFileDrop}
            onSubmit={handleEditSave}
            onCancel={handleEditCancel}
            isSubmitting={isUpdating}
          />

          <DeleteProductDialog
            isOpen={isDeleteDialogOpen}
            product={deletingProduct}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            isDeleting={isDeleting}
          />
        </>
      )}

      {!isAdmin && (
        <ProductDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          product={selectedProduct}
          categories={categories}
        />
      )}
    </div>
  );
};

export default ProductsPage;