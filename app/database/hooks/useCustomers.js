import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export function useCustomers(userId) {
    const db = useSQLiteContext();
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all customers for user
    const fetchCustomers = useCallback(async () => {
        try {
            const result = await db.getAllAsync(
                'SELECT id, name, address FROM customers WHERE user_id = ?',
                [userId]
            );
            setCustomers(result);
            return result;
        } catch(error) {
            console.error("Error fetching customers:", error);
            throw error;
        }
    }, [db, userId]);

    // Load data (matches your original pattern)
    const loadData = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);

        try {
            await fetchCustomers();
        } catch(error) {
            console.error("Error loading data:", error);
            Alert.alert("Error", "Failed to load customers");
        } finally {
            setIsLoading(false);
        }
    }, [fetchCustomers, userId]);

    // Add new customer
    const addCustomer = useCallback(async (name, address) => {
        try {
            // Validation
            if (!name || !address) {
                Alert.alert("Error", "All fields are required");
                return;
            }

            const result = await db.runAsync(
                'INSERT INTO customers(user_id, name, address) VALUES (?, ?, ?)',
                [userId, name, address]
            );
            
            await loadData(); // Refresh list
            Alert.alert("Success", "Customer added successfully");
            return result.lastInsertRowid;
        } catch(error) {
            console.error("Error adding customer:", error);
            Alert.alert("Error", error.message);
            throw error;
        }
    }, [db, userId, loadData]);

    // Update customer
    const updateCustomer = useCallback(async (id, name, address) => {
        try {
            // Validate ID
            if (isNaN(parseInt(id))) {
                Alert.alert("Error", "Invalid customer ID");
                return;
            }

            // Check that at least one field is provided
            if (!name && !address) {
                Alert.alert("Error", "Fill up at least one field");
                return;
            }

            let query = 'UPDATE customers SET ';
            const params = [];

            if (name) {
                query += 'name = ?';
                params.push(name);
            }
            if (address) {
                query += (params.length > 0 ? ', ' : '') + 'address = ?';
                params.push(address);
            }
            
            query += ' WHERE id = ?';
            params.push(id);

            await db.runAsync(query, params);
            await loadData(); // Refresh list
            Alert.alert("Success", "Customer updated successfully");
        } catch(error) {
            console.error("Error updating customer:", error);
            Alert.alert("Error", error.message);
            throw error;
        }
    }, [db, loadData]);

    // Delete customer
    const deleteCustomer = useCallback(async (id) => {
        try {
            // Validate ID
            if (isNaN(parseInt(id))) {
                Alert.alert("Error", "Invalid customer ID");
                return;
            }

            const result = await db.runAsync(
                'DELETE FROM customers WHERE id = ?',
                [id]
            );

            if (result.changes === 0) {
                Alert.alert("Error", "Customer not found");
                return;
            }

            await loadData(); // Refresh list
            Alert.alert("Success", "Customer deleted successfully");
        } catch(error) {
            console.error("Error deleting customer:", error);
            Alert.alert("Error", error.message);
            throw error;
        }
    }, [db, loadData]);

    return { 
        customers, 
        isLoading, 
        loadData, 
        addCustomer,
        updateCustomer,
        deleteCustomer 
    };
}