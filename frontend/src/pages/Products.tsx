import React, { useState, useEffect } from "react";
import { Package, Plus, Edit, Trash2, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import productsService, {
  type Product,
  type CreateProductRequest,
  type UpdateProductRequest,
} from "@/services/productsService";
import categoriesService, { type Category } from "@/services/categoriesService";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { AxiosError } from "axios";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[] | undefined>();
  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);

    // For create dialog - use files, not files array
    if (isCreateDialogOpen && files.length > 0) {
      setNewProduct((prev) => ({
        ...prev,
        image: files[0],
      }));
    }

    // For edit dialog - use files, not files array
    if (isEditDialogOpen && files.length > 0) {
      setEditingData((prev) => ({
        ...prev,
        image: files[0],
      }));
    }
  };

  // Create dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<CreateProductRequest>({
    product_name: "",
    description: "",
    price: 0,
    in_stock: 0,
    image_url: "",
    category_id: 0,
    image: undefined,
  });
  const [isCreating, setIsCreating] = useState(false);

  // Edit dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load products and categories on component mount
  const loadProducts = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsService.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      handleError(err, "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = React.useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const data = await categoriesService.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

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

  const handleCreateProduct = async () => {
    if (!newProduct.product_name.trim() || newProduct.category_id === 0) return;

    setIsCreating(true);
    try {
      const productData: CreateProductRequest = {
        ...newProduct,
        product_name: newProduct.product_name.trim(),
        description: newProduct.description?.trim() || "",
        image: newProduct.image,
      };

      const createdProduct = await productsService.create(productData);
      setProducts((prev) => [...prev, createdProduct]);
      resetCreateForm();
      setIsCreateDialogOpen(false);
      setFiles(undefined); // Clear files
    } catch (err) {
      handleError(err, "Failed to create product");
    } finally {
      setIsCreating(false);
    }
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

  const handleEditCancel = () => {
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    setEditingData({
      product_name: "",
      description: "",
      price: 0,
      in_stock: 0,
      image_url: "",
      category_id: 0,
      image: undefined, // Add this
    });
    setFiles(undefined); // Clear files
  };

  const handleEditSave = async () => {
    if (
      !editingProduct ||
      !editingData.product_name.trim() ||
      editingData.category_id === 0
    )
      return;

    setIsUpdating(true);
    try {
      const updatedProduct = await productsService.update(editingProduct.id, {
        ...editingData,
        product_name: editingData.product_name.trim(),
        description: editingData.description?.trim() || "",
        image: editingData.image, // Add this - was missing!
      });

      setProducts((prev) =>
        prev.map((prod) =>
          prod.id === editingProduct.id ? updatedProduct : prod
        )
      );
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      setFiles(undefined); // Clear files
    } catch (err) {
      handleError(err, "Failed to update product");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteStart = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeletingProduct(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;

    setIsDeleting(true);
    try {
      await productsService.delete(deletingProduct.id);
      setProducts((prev) =>
        prev.filter((prod) => prod.id !== deletingProduct.id)
      );
      setIsDeleteDialogOpen(false);
      setDeletingProduct(null);
    } catch (err) {
      handleError(err, "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleError = (err: unknown, defaultMessage: string) => {
    console.error(err);
    if (err instanceof AxiosError) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You do not have permission to perform this action.");
      } else {
        setError(defaultMessage);
      }
    } else {
      setError(defaultMessage);
    }
  };

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
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            </div>
            <p className="text-gray-600 mt-2">Manage your product inventory</p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
                <DialogDescription>
                  Enter the details for your new product.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={newProduct.product_name}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        product_name: e.target.value,
                      }))
                    }
                    placeholder="Enter product name"
                    disabled={isCreating}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Enter product description"
                    disabled={isCreating}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          price: parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="0.00"
                      disabled={isCreating}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={newProduct.in_stock}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          in_stock: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                      disabled={isCreating}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={
                      newProduct.category_id === 0
                        ? undefined
                        : newProduct.category_id.toString()
                    } // Fix this line
                    onValueChange={(value) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        category_id: parseInt(value),
                      }))
                    }
                    disabled={isCreating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">Image URL (optional)</Label>
                  <Dropzone
                    accept={{ "image/*": [] }}
                    maxFiles={1}
                    multiple={false}
                    maxSize={1024 * 1024 * 2}
                    minSize={1024}
                    onDrop={handleDrop}
                    onError={console.error}
                    src={files}
                  >
                    <DropzoneEmptyState />
                    <DropzoneContent />
                  </Dropzone>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetCreateForm();
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProduct}
                  disabled={
                    isCreating ||
                    !newProduct.product_name.trim() ||
                    newProduct.category_id === 0
                  }
                >
                  {isCreating ? "Creating..." : "Create Product"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="h-auto p-1 text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {loading && categoriesLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : products?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products yet
            </h3>
            <p className="text-gray-500 mb-4">
              Get started by creating your first product.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => {
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.product_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (
                                parent &&
                                !parent.querySelector(".fallback-icon")
                              ) {
                                const fallback = document.createElement("div");
                                fallback.className =
                                  "fallback-icon w-6 h-6 text-gray-400";
                                fallback.innerHTML =
                                  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>';
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {product.product_name}
                        </div>
                        {product.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getCategoryName(product.category_id)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.in_stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.in_stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditStart(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteStart(product)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editProductName">Product Name</Label>
              <Input
                id="editProductName"
                value={editingData.product_name}
                onChange={(e) =>
                  setEditingData((prev) => ({
                    ...prev,
                    product_name: e.target.value,
                  }))
                }
                placeholder="Enter product name"
                disabled={isUpdating}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={editingData.description}
                onChange={(e) =>
                  setEditingData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter product description"
                disabled={isUpdating}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editPrice">Price</Label>
                <Input
                  id="editPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editingData.price}
                  onChange={(e) =>
                    setEditingData((prev) => ({
                      ...prev,
                      price: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0.00"
                  disabled={isUpdating}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="editStock">Stock</Label>
                <Input
                  id="editStock"
                  type="number"
                  min="0"
                  value={editingData.in_stock}
                  onChange={(e) =>
                    setEditingData((prev) => ({
                      ...prev,
                      in_stock: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                  disabled={isUpdating}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="editCategory">Category</Label>
              <Select
                value={editingData.category_id.toString()}
                onValueChange={(value) =>
                  setEditingData((prev) => ({
                    ...prev,
                    category_id: parseInt(value),
                  }))
                }
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editImageUrl">Product Image (optional)</Label>

              {/* Compact current image preview - same height as regular input */}
              {editingProduct?.image_url && (
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md border">
                  <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={editingProduct.image_url}
                      alt="Current"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 truncate">
                      Current image
                    </p>
                    {files && files.length > 0 && (
                      <p className="text-xs text-amber-600">Will be replaced</p>
                    )}
                  </div>
                </div>
              )}

              {/* Regular dropzone - same as create dialog */}
              <Dropzone
                accept={{ "image/*": [] }}
                maxFiles={1}
                multiple={false}
                maxSize={1024 * 1024 * 2}
                minSize={1024}
                onDrop={handleDrop}
                onError={console.error}
                src={files}
              >
                <DropzoneEmptyState />
                <DropzoneContent />
              </Dropzone>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleEditCancel}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              disabled={
                isUpdating ||
                !editingData.product_name.trim() ||
                editingData.category_id === 0
              }
            >
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              product "{deletingProduct?.product_name}" from your inventory.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
