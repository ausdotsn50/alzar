import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export function useProducts() { // Removed userId argument
    const db = useSQLiteContext();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all products (No filter needed)
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

    // Add new product (Removed user_id from INSERT)
    const addProduct = useCallback(async (item, base_price) => {
        try {
            if (!item || base_price === undefined) {
                Alert.alert("Error", "All fields are required");
                return;
            }

            // Note: If you didn't remove the user_id column from your DB schema yet,
            // use 'local' or some default string here instead of removing the column.
            const result = await db.runAsync(
                'INSERT INTO products(user_id, item, base_price) VALUES (?, ?, ?)',
                ['default_user', item, base_price] 
            );
            
            await loadData();
            Alert.alert("Success", "Product added successfully");
            return result.lastInsertRowid;
        } catch(error) {
            console.error("Error adding product:", error);
            Alert.alert("Error", error.message);
            throw error;
        }
    }, [db, loadData]);

    // Update product (Stays largely the same, just removed userId dependency)
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
            Alert.alert("Success", "Product updated successfully");
        } catch(error) {
            console.error("Error updating product:", error);
            throw error;
        }
    }, [db, loadData]);

    // Delete product (Stays the same)
    const deleteProduct = useCallback(async (id) => {
        try {
            const result = await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
            await loadData();
            if (result.changes > 0) Alert.alert("Success", "Product deleted");
        } catch(error) {
            console.error("Error deleting product:", error);
        }
    }, [db, loadData]);

    return { products, isLoading, loadData, addProduct, updateProduct, deleteProduct };
}