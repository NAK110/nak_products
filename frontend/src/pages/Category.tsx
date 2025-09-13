import React, { useState, useEffect } from "react";
import { Grid3X3, Plus, Edit, Trash2, X } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import categoriesService, { type Category } from "@/services/categoriesService";
import { AxiosError } from "axios";

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Edit dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Load categories on component mount
  const loadCategories = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriesService.getAll();
      // Ensure data is always an array
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      handleError(err, "Failed to load categories");
      // Reset categories to empty array on error
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    setIsCreating(true);
    try {
      const newCategory = await categoriesService.create({
        category_name: newCategoryName.trim(),
      });

      setCategories((prev) => [...prev, newCategory]);
      setNewCategoryName("");
      setIsCreateDialogOpen(false);
    } catch (err) {
      handleError(err, "Failed to create category");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditStart = (category: Category) => {
    setEditingCategory(category);
    setEditingName(category.category_name);
    setIsEditDialogOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditDialogOpen(false);
    setEditingCategory(null);
    setEditingName("");
  };

  const handleEditSave = async () => {
    if (!editingCategory || !editingName.trim()) return;

    setIsUpdating(true);
    try {
      const updatedCategory = await categoriesService.update(
        editingCategory.id, {category_name: editingName.trim()}
      );

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? updatedCategory : cat
        )
      );
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      setEditingName("");
    } catch (err) {
      handleError(err, "Failed to update category");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteStart = (category: Category) => {
    setDeletingCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeletingCategory(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;

    setIsDeleting(true);
    try {
      await categoriesService.delete(deletingCategory.id);
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== deletingCategory.id)
      );
      setIsDeleteDialogOpen(false);
      setDeletingCategory(null);
    } catch (err) {
      handleError(err, "Failed to delete category");
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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <Grid3X3 className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            </div>
            <p className="text-gray-600 mt-2">
              Create your product category here
            </p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Enter a name for your new category.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    disabled={isCreating}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newCategoryName.trim()) {
                        handleCreateCategory();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateCategory}
                  disabled={isCreating || !newCategoryName.trim()}
                >
                  {isCreating ? "Creating..." : "Create Category"}
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
        {loading && categories?.length === 0 ? (
          <div className="flex justify-center py-8">
            <p className="text-gray-500">Loading categories...</p>
          </div>
        ) : categories?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Grid3X3 className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No categories yet
            </h3>
            <p className="text-gray-500 mb-4">
              Get started by creating your first category.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Category Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.id}</TableCell>
                  <TableCell>{category.category_name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditStart(category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteStart(category)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category name. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editCategoryName">Category Name</Label>
              <Input
                id="editCategoryName"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="Enter category name"
                disabled={isUpdating}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && editingName.trim()) {
                    handleEditSave();
                  }
                }}
              />
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
              disabled={isUpdating || !editingName.trim()}
            >
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              category "{deletingCategory?.category_name}" and may affect
              associated products.
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
              {isDeleting ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
