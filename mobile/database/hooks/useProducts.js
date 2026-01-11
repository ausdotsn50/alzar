import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export function useProducts() {
    const db = useSQLiteContext();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all products
    const fetchProducts = useCallback(async () => {
        try {
            const result = await db.getAllAsync(
                'SELECT id, item, base_price FROM products ORDER BY item ASC'
            );
            setProducts(result);
            return result;
        } catch(error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }, [db]);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            await fetchProducts();
        } catch(error) {
            console.error("Error loading data:", error);
            Alert.alert("Error", "Failed to load products");
        } finally {
            setIsLoading(false);
        }
    }, [fetchProducts]);

    // Add new product
    const addProduct = useCallback(async (item, base_price) => {
        try {
            if (!item || base_price === undefined) {
                Alert.alert("Error", "All fields are required");
                return;
            }

            const result = await db.runAsync(
                'INSERT INTO products(item, base_price) VALUES (?, ?)',
                [item, base_price] 
            );
            
            await loadData();
            return result.lastInsertRowId;
        } catch(error) {
            console.error("Error adding product:", error);
            Alert.alert("Error", error.message);
            throw error;
        }
    }, [db, loadData]);

    // Update product 
    const updateProduct = useCallback(async (id, item, base_price) => {
        try {
            if (isNaN(parseInt(id))) return;
            if (!item && base_price === undefined) {
                Alert.alert("Error", "Fill up at least one field");
                return;
            }

            let query, params;
            if (!item && base_price !== undefined) {
                query = 'UPDATE products SET base_price = ? WHERE id = ?';
                params = [base_price, id];
            } else if (item && base_price === undefined) {
                query = 'UPDATE products SET item = ? WHERE id = ?';
                params = [item, id];
            } else {
                query = 'UPDATE products SET item = ?, base_price = ? WHERE id = ?';
                params = [item, base_price, id];
            }

            await db.runAsync(query, params);
            await loadData();
        } catch(error) {
            console.error("Error updating product:", error);
            throw error;
        }
    }, [db, loadData]);

    // Delete product
    const deleteProduct = useCallback(async (id) => {
        try {
            await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
            await new Promise(resolve => setTimeout(resolve, 500));
            await loadData();
        } catch(error) {
            console.error("Error deleting product:", error);
            Alert.alert("Error", error.message);
        } finally {
            Alert.alert("Success", "Product deleted");
        }
    }, [db, loadData]);

    return { products, isLoading, loadData, addProduct, updateProduct, deleteProduct };
}