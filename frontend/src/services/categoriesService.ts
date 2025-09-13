import api from "@/lib/api";

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

// Categories API service
export const categoriesService = {
    // GET /categories - Returns { success: true, data: Category[] }
    getAll: async (): Promise<Category[]> => {
        try {
            const response = await api.get<CategoriesResponse>('/categories');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // GET /categories/{id} - Returns Category directly with products
    getById: async (id: number): Promise<Category> => {
        try {
            const response = await api.get<Category>(`/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },

    // POST /categories - Returns { success: true, message: string, category: Category }
    // Note: This requires admin authentication (handled automatically by session cookies)
    create: async (categoryData: CreateCategoryRequest): Promise<Category> => {
        try {
            const response = await api.post<CreateCategoryResponse>('/categories', categoryData);
            return response.data.category;
        } catch (error) {
            console.error('Error creating category:', error);

            // Enhanced error handling for validation errors
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                if (axiosError.response?.status === 422) {
                    // Laravel validation error
                    const validationError = new Error('Validation failed');
                    (validationError as any).validationErrors = axiosError.response.data.errors;
                    throw validationError;
                }
                if (axiosError.response?.status === 403) {
                    // Authorization error (not admin)
                    throw new Error('You do not have permission to create categories');
                }
            }

            throw error;
        }
    },

    // PUT /categories/{id} - Updated to include ID and use PUT method
    // Note: This requires admin authentication (handled automatically by session cookies)
    update: async (id: number, categoryData: UpdateCategoryRequest): Promise<Category> => {
        try {
            const response = await api.put<UpdateCategoryResponse>(`/categories/${id}`, categoryData);
            return response.data.category;
        } catch (error) {
            console.error('Error updating category:', error);

            // Enhanced error handling
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                if (axiosError.response?.status === 422) {
                    // Laravel validation error
                    const validationError = new Error('Validation failed');
                    (validationError as any).validationErrors = axiosError.response.data.errors;
                    throw validationError;
                }
                if (axiosError.response?.status === 403) {
                    // Authorization error (not admin)
                    throw new Error('You do not have permission to update categories');
                }
                if (axiosError.response?.status === 404) {
                    // Category not found
                    throw new Error('Category not found');
                }
            }

            throw error;
        }
    },

    // DELETE /categories/{id} - Returns { success: true, message: string }
    // Note: This requires admin authentication (handled automatically by session cookies)
    delete: async (id: number): Promise<void> => {
        try {
            await api.delete<DeleteCategoryResponse>(`/categories/${id}`);
        } catch (error) {
            console.error('Error deleting category:', error);

            // Enhanced error handling
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                if (axiosError.response?.status === 403) {
                    // Authorization error (not admin)
                    throw new Error('You do not have permission to delete categories');
                }
                if (axiosError.response?.status === 404) {
                    // Category not found
                    throw new Error('Category not found');
                }
            }

            throw error;
        }
    },
};

export default categoriesService;