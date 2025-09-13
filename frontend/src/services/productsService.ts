import api from "@/lib/api";

export interface Product {
  id: number;
  product_name: string;
  description?: string;
  price: number;
  in_stock: number;
  image_url?: string;
  image_path?: string; // Add this since it's in the API response
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

// Response interfaces matching your Laravel controller
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

// Helper function to fix malformed image URLs [16]
const fixImageUrl = (imageUrl: string | null | undefined): string | null => {
  if (!imageUrl) return null;

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
    // Prepend your API base URL for proper absolute URL
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${baseUrl}${imageUrl}`;
  }

  return imageUrl; // Fallback - return as-is
};

// Helper function to process product data [7]
const processProductData = (product: Product): Product => {
  return {
    ...product,
    // Fix the malformed image_url
    image_url: fixImageUrl(product.image_url),
    // Convert price to number if it's a string
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
  };
};

// Products API service
export const productsService = {
  // GET /products - Returns { success: true, data: Product[] }
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await api.get<ProductsResponse>('/products');

      // Process each product to fix image URLs [16]
      const processedProducts = response.data.data.map(processProductData);

      return processedProducts;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // GET /products/{id} - Returns Product directly with category
  getById: async (id: number): Promise<Product> => {
    try {
      const response = await api.get<Product>(`/products/${id}`);

      // Process the single product data
      return processProductData(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);

      // Enhanced error handling
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 404) {
          throw new Error('Product not found');
        }
      }

      throw error;
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

      // Process the created product data
      return processProductData(response.data.product);
    } catch (error) {
      console.error('Error creating product:', error);

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
          throw new Error('You do not have permission to create products');
        }
      }

      throw error;
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
      formData.append('_method', 'PUT'); // Laravel method spoofing

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

      // Process the updated product data
      return processProductData(response.data.product);
    } catch (error) {
      console.error('Error updating product:', error);

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
          throw new Error('You do not have permission to update products');
        }
        if (axiosError.response?.status === 404) {
          // Product not found
          throw new Error('Product not found');
        }
      }

      throw error;
    }
  },

  // DELETE /products/{id} - Returns { success: true, message: string }
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete<DeleteProductResponse>(`/products/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);

      // Enhanced error handling
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 403) {
          // Authorization error (not admin)
          throw new Error('You do not have permission to delete products');
        }
        if (axiosError.response?.status === 404) {
          // Product not found
          throw new Error('Product not found');
        }
      }

      throw error;
    }
  },

  // Additional utility methods for better UX
  getByCategory: async (categoryId: number): Promise<Product[]> => {
    try {
      const allProducts = await productsService.getAll();
      return allProducts.filter(product => product.category_id === categoryId);
    } catch (error) {
      console.error('Error filtering products by category:', error);
      throw error;
    }
  },

  searchByName: async (searchTerm: string): Promise<Product[]> => {
    try {
      const allProducts = await productsService.getAll();
      return allProducts.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },
};

export default productsService;
