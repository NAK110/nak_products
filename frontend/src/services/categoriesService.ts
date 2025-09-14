// services/categoriesService.ts - Fixed with proper TypeScript types
import api from "@/lib/api";
import { AxiosError } from "axios";

export interface Category {
    id: number;
    category_name: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateCategoryRequest {
    category_name: string;
}

export interface UpdateCategoryRequest {
    category_name: string;
}

// Response interfaces matching your Laravel controller
export interface CategoriesResponse {
    success: boolean;
    data: Category[];
}

export interface CreateCategoryResponse {
    success: boolean;
    message: string;
    category: Category;
}

export interface UpdateCategoryResponse {
    success: boolean;
    message: string;
    category: Category;
}

export interface DeleteCategoryResponse {
    success: boolean;
    message: string;
}

// Error interface for better error handling
export interface CategoryError {
    message: string;
    errors?: {
        category_name?: string[];
    };
}

// Custom error class for validation errors
export class ValidationError extends Error {
    public validationErrors: Record<string, string[]>;

    constructor(message: string, validationErrors: Record<string, string[]>) {
        super(message);
        this.name = 'ValidationError';
        this.validationErrors = validationErrors;
    }
}

// Categories API service
export const categoriesService = {
    // GET /categories - Returns { success: true, data: Category[] }
    getAll: async (): Promise<Category[]> => {
        try {
            const response = await api.get<CategoriesResponse>('/categories');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching categories:', error);

            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    throw new Error("You do not have permission to view categories");
                }
                throw new Error(error.response?.data?.message || "Failed to fetch categories");
            }

            throw new Error("Failed to fetch categories");
        }
    },

    // GET /categories/{id} - Returns Category directly with products
    getById: async (id: number): Promise<Category> => {
        try {
            const response = await api.get<Category>(`/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category:', error);

            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    throw new Error("Category not found");
                }
                if (error.response?.status === 403) {
                    throw new Error("You do not have permission to view this category");
                }
                throw new Error(error.response?.data?.message || `Failed to fetch category with ID ${id}`);
            }

            throw new Error(`Failed to fetch category with ID ${id}`);
        }
    },

    // POST /categories - Returns { success: true, message: string, category: Category }
    create: async (categoryData: CreateCategoryRequest): Promise<Category> => {
        try {
            const response = await api.post<CreateCategoryResponse>('/categories', categoryData);
            return response.data.category;
        } catch (error) {
            console.error('Error creating category:', error);

            if (error instanceof AxiosError) {
                if (error.response?.status === 422) {
                    throw new ValidationError("Validation failed", error.response.data.errors || {});
                }
                if (error.response?.status === 403) {
                    throw new Error("You do not have permission to create categories");
                }
                throw new Error(error.response?.data?.message || "Failed to create category");
            }

            throw new Error("Failed to create category");
        }
    },

    // PUT /categories/{id} - Updated to include ID and use PUT method
    update: async (id: number, categoryData: UpdateCategoryRequest): Promise<Category> => {
        try {
            const response = await api.put<UpdateCategoryResponse>(`/categories/${id}`, categoryData);
            return response.data.category;
        } catch (error) {
            console.error('Error updating category:', error);

            if (error instanceof AxiosError) {
                if (error.response?.status === 422) {
                    throw new ValidationError("Validation failed", error.response.data.errors || {});
                }
                if (error.response?.status === 403) {
                    throw new Error("You do not have permission to update categories");
                }
                if (error.response?.status === 404) {
                    throw new Error("Category not found");
                }
                throw new Error(error.response?.data?.message || `Failed to update category with ID ${id}`);
            }

            throw new Error(`Failed to update category with ID ${id}`);
        }
    },

    // DELETE /categories/{id} - Returns { success: true, message: string }
    delete: async (id: number): Promise<void> => {
        try {
            await api.delete<DeleteCategoryResponse>(`/categories/${id}`);
        } catch (error) {
            console.error('Error deleting category:', error);

            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    throw new Error("You do not have permission to delete categories");
                }
                if (error.response?.status === 404) {
                    throw new Error("Category not found");
                }
                if (error.response?.status === 409) {
                    throw new Error("Cannot delete category. It may have associated products.");
                }
                throw new Error(error.response?.data?.message || `Failed to delete category with ID ${id}`);
            }

            throw new Error(`Failed to delete category with ID ${id}`);
        }
    },

    // Helper method to check if category name is unique (client-side)
    isUniqueName: async (categoryName: string, excludeId?: number): Promise<boolean> => {
        try {
            const categories = await categoriesService.getAll();
            const normalizedName = categoryName.toLowerCase().trim();

            return !categories.some(category =>
                category.category_name.toLowerCase().trim() === normalizedName &&
                category.id !== excludeId
            );
        } catch (error) {
            console.error('Error checking category name uniqueness:', error);
            return true; // Assume it's unique if we can't check
        }
    },

    // Search categories by name (client-side search)
    search: async (searchTerm: string): Promise<Category[]> => {
        try {
            const allCategories = await categoriesService.getAll();
            const term = searchTerm.toLowerCase().trim();

            if (!term) return allCategories;

            return allCategories.filter(category =>
                category.category_name.toLowerCase().includes(term)
            );
        } catch (error) {
            console.error('Error searching categories:', error);
            throw error; 
        }
    },
};

export default categoriesService;
