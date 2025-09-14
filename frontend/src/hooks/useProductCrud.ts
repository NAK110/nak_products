// hooks/useProductCrud.ts
import { useState, useCallback } from 'react';
import productsService, {
    type Product,
    type CreateProductRequest,
    type UpdateProductRequest
} from '@/services/productsService';
import { AxiosError } from 'axios';

export const useProductCrud = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Create product
    const createProduct = useCallback(async (productData: CreateProductRequest): Promise<Product | null> => {
        try {
            const createdProduct = await productsService.create(productData);
            setProducts(prev => [...prev, createdProduct]);
            return createdProduct;
        } catch (err) {
            handleError(err, 'Failed to create product');
            return null;
        }
    }, []);

    // Update product
    const updateProduct = useCallback(async (id: number, productData: UpdateProductRequest): Promise<Product | null> => {
        try {
            const updatedProduct = await productsService.update(id, productData);
            setProducts(prev => prev.map(prod => prod.id === id ? updatedProduct : prod));
            return updatedProduct;
        } catch (err) {
            handleError(err, 'Failed to update product');
            return null;
        }
    }, []);

    // Delete product
    const deleteProduct = useCallback(async (id: number): Promise<boolean> => {
        try {
            await productsService.delete(id);
            setProducts(prev => prev.filter(prod => prod.id !== id));
            return true;
        } catch (err) {
            handleError(err, 'Failed to delete product');
            return false;
        }
    }, []);

    // Load all products
    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await productsService.getAll();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            handleError(err, 'Failed to load products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleError = (err: unknown, defaultMessage: string) => {
        console.error(err);
        if (err instanceof AxiosError) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 401) {
                setError('Unauthorized. Please login again.');
            } else if (err.response?.status === 403) {
                setError('You do not have permission to perform this action.');
            } else {
                setError(defaultMessage);
            }
        } else {
            setError(defaultMessage);
        }
    };

    const clearError = () => setError(null);

    return {
        products,
        setProducts,
        loading,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
        loadProducts,
        clearError
    };
};
