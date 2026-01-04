import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export function useProducts(userId) {
    const db = useSQLiteContext();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all products for user
    const fetchProducts = useCallback(async () => {
        try {
            const result = await db.getAllAsync(
                'SELECT id, item, base_price FROM products WHERE user_id = ?',
                [userId]
            );
            setProducts(result);
            return result;
        } catch(error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }, [db, userId]);

    // Load data (matches your original pattern)
    const loadData = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);

        try {
            await fetchProducts();
        } catch(error) {
            console.error("Error loading data:", error);
            Alert.alert("Error", "Failed to load products");
        } finally {
            setIsLoading(false);
        }
    }, [fetchProducts, userId]);

    // Add new product
    const addProduct = useCallback(async (item, base_price) => {
        try {
            // Validation
            if (!item || base_price === undefined) {
                Alert.alert("Error", "All fields are required");
                return;
            }

            const result = await db.runAsync(
                'INSERT INTO products(user_id, item, base_price) VALUES (?, ?, ?)',
                [userId, item, base_price]
            );
            
            await loadData(); // Refresh list
            Alert.alert("Success", "Product added successfully");
            return result.lastInsertRowid;
        } catch(error) {
            console.error("Error adding product:", error);
            Alert.alert("Error", error.message);
            throw error;
        }
    }, [db, userId, loadData]);

    // Update product
    const updateProduct = useCallback(async (id, item, base_price) => {
        try {
            // Validate ID
            if (isNaN(parseInt(id))) {
                Alert.alert("Error", "Invalid product ID");
                return;
            }

            // Check that at least one field is provided
            if (!item && base_price === undefined) {
                Alert.alert("Error", "Fill up at least one field");
                return;
            }

            let query;
            let params;

            if (!item && base_price !== undefined) {
                // Only update price
                query = 'UPDATE products SET base_price = ? WHERE id = ?';
                params = [base_price, id];
            } else if (item && base_price === undefined) {
                // Only update item
                query = 'UPDATE products SET item = ? WHERE id = ?';
                params = [item, id];
            } else {
                // Update both fields
                query = 'UPDATE products SET item = ?, base_price = ? WHERE id = ?';
                params = [item, base_price, id];
            }

            await db.runAsync(query, params);
            await loadData(); // Refresh list
            Alert.alert("Success", "Product updated successfully");
        } catch(error) {
            console.error("Error updating product:", error);
            Alert.alert("Error", error.message);
            throw error;
        }
    }, [db, loadData]);

    // Delete product
    const deleteProduct = useCallback(async (id) => {
        try {
            // Validate ID
            if (isNaN(parseInt(id))) {
                Alert.alert("Error", "Invalid product ID");
                return;
            }

            const result = await db.runAsync(
                'DELETE FROM products WHERE id = ?', 
                [id]
            );

            if (result.changes === 0) {
                Alert.alert("Error", "Product not found");
                return;
            }

            await loadData(); // Refresh list
            Alert.alert("Success", "Product deleted successfully");
        } catch(error) {
            console.error("Error deleting product:", error);
            Alert.alert("Error", error.message);
            throw error;
        }
    }, [db, loadData]);

    return { 
        products, 
        isLoading, 
        loadData, 
        addProduct, 
        updateProduct, 
        deleteProduct 
    };
}