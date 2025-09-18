// services/productsService.ts - Fixed with proper TypeScript types
import api from "@/lib/api";
import { AxiosError } from "axios";

export interface Product {
  id: number;
  product_name: string;
  description?: string;
  price: number;
  in_stock: number;
  image_url?: string | null;
  image_path?: string;
  category_id: number;
  created_at?: string;
  updated_at?: string;
  // Relation from controller's with('category')
  category?: {
    id: number;
    category_name: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface CreateProductRequest {
  product_name: string;
  description?: string;
  price: number;
  in_stock: number;
  image_url?: string;
  image?: File;
  category_id: number;
}

export interface UpdateProductRequest {
  product_name: string;
  description?: string;
  price: number;
  in_stock: number;
  image_url?: string;
  image?: File;
  category_id: number;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
}

export interface CreateProductResponse {
  success: boolean;
  message: string;
  product: Product;
}

export interface UpdateProductResponse {
  success: boolean;
  message: string;
  product: Product;
}

export interface DeleteProductResponse {
  success: boolean;
  message: string;
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

const fixImageUrl = (imageUrl: string | null | undefined): string | undefined => {
  if (!imageUrl) return undefined;

  // Check if URL starts with /storage/https:// (malformed)
  if (imageUrl.startsWith('/storage/https://') || imageUrl.startsWith('/storage/http://')) {
    // Extract the actual URL by removing the /storage/ prefix
    return imageUrl.replace('/storage/', '');
  }

  // Check if it's a proper external URL (starts with http/https)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl; // Return as-is
  }

  // Check if it's a proper local storage URL (starts with /storage/)
  if (imageUrl.startsWith('/storage/')) {
    const baseUrl = import.meta.env.VITE_API_URL;
    return `${baseUrl}${imageUrl}`;
  }

  return imageUrl; // Fallback - return as-is
};

// Helper function to process product data
const processProductData = (product: Product): Product => {
  return {
    ...product,
    // Fix the malformed image_url
    image_url: fixImageUrl(product.image_url),
    // Convert price to number if it's a string
    price: typeof product.price === 'string' ? parseFloat(product.price as string) : product.price,
  };
};

// Products API service
export const productsService = {
  // GET /products - Returns { success: true, data: Product[] }
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await api.get<ProductsResponse>('/products');
      // Process each product to fix image URLs
      const processedProducts = response.data.data.map(processProductData);
      return processedProducts;
    } catch (error) {
      console.error('Error fetching products:', error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          throw new Error("You do not have permission to view products");
        }
        throw new Error(error.response?.data?.message || "Failed to fetch products");
      }

      throw new Error("Failed to fetch products");
    }
  },

  // GET /products/{id} - Returns Product directly with category
  getById: async (id: number): Promise<Product> => {
    try {
      const response = await api.get<Product>(`/products/${id}`);
      return processProductData(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new Error('Product not found');
        }
        if (error.response?.status === 403) {
          throw new Error('You do not have permission to view this product');
        }
        throw new Error(error.response?.data?.message || `Failed to fetch product with ID ${id}`);
      }

      throw new Error(`Failed to fetch product with ID ${id}`);
    }
  },

  // POST /products - Returns { success: true, message: string, product: Product }
  create: async (productData: CreateProductRequest): Promise<Product> => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('product_name', productData.product_name);
      formData.append('price', productData.price.toString());
      formData.append('in_stock', productData.in_stock.toString());
      formData.append('category_id', productData.category_id.toString());

      if (productData.description) {
        formData.append('description', productData.description);
      }

      if (productData.image) {
        formData.append('image', productData.image);
      }

      const response = await api.post<CreateProductResponse>('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return processProductData(response.data.product);
    } catch (error) {
      console.error('Error creating product:', error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          throw new ValidationError("Validation failed", error.response.data.errors || {});
        }
        if (error.response?.status === 403) {
          throw new Error('You do not have permission to create products');
        }
        throw new Error(error.response?.data?.message || "Failed to create product");
      }

      throw new Error("Failed to create product");
    }
  },

  // PUT /products/{id} - Returns { success: true, message: string, product: Product }
  update: async (id: number, productData: UpdateProductRequest): Promise<Product> => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('product_name', productData.product_name);
      formData.append('price', productData.price.toString());
      formData.append('in_stock', productData.in_stock.toString());
      formData.append('category_id', productData.category_id.toString());
      formData.append('_method', 'PUT');

      if (productData.description) {
        formData.append('description', productData.description);
      }

      if (productData.image) {
        formData.append('image', productData.image);
      }

      const response = await api.post<UpdateProductResponse>(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return processProductData(response.data.product);
    } catch (error) {
      console.error('Error updating product:', error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          throw new ValidationError("Validation failed", error.response.data.errors || {});
        }
        if (error.response?.status === 403) {
          throw new Error('You do not have permission to update products');
        }
        if (error.response?.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error(error.response?.data?.message || `Failed to update product with ID ${id}`);
      }

      throw new Error(`Failed to update product with ID ${id}`);
    }
  },

  // DELETE /products/{id} - Returns { success: true, message: string }
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete<DeleteProductResponse>(`/products/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          throw new Error('You do not have permission to delete products');
        }
        if (error.response?.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error(error.response?.data?.message || `Failed to delete product with ID ${id}`);
      }

      throw new Error(`Failed to delete product with ID ${id}`);
    }
  },

  // Additional utility methods for better UX
  getByCategory: async (categoryId: number): Promise<Product[]> => {
    try {
      const allProducts = await productsService.getAll();
      return allProducts.filter(product => product.category_id === categoryId);
    } catch (error) {
      console.error('Error filtering products by category:', error);
      throw error; // Re-throw the error from getAll()
    }
  },

  searchByName: async (searchTerm: string): Promise<Product[]> => {
    try {
      const allProducts = await productsService.getAll();
      const term = searchTerm.toLowerCase().trim();

      if (!term) return allProducts;

      return allProducts.filter(product =>
        product.product_name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Error searching products:', error);
      throw error; // Re-throw the error from getAll()
    }
  },

  // Get products with low stock (helper method)
  getLowStockProducts: async (threshold: number = 5): Promise<Product[]> => {
    try {
      const allProducts = await productsService.getAll();
      return allProducts.filter(product => product.in_stock <= threshold);
    } catch (error) {
      console.error('Error getting low stock products:', error);
      throw error;
    }
  },

  // Check if product name is unique (helper method)
  isUniqueName: async (productName: string, excludeId?: number): Promise<boolean> => {
    try {
      const allProducts = await productsService.getAll();
      const normalizedName = productName.toLowerCase().trim();

      return !allProducts.some(product =>
        product.product_name.toLowerCase().trim() === normalizedName &&
        product.id !== excludeId
      );
    } catch (error) {
      console.error('Error checking product name uniqueness:', error);
      return true;
    }
  },
};

export default productsService;
