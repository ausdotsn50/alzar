import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export function useCustomers() { // Removed userId argument
    const db = useSQLiteContext();
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all customers
    const fetchCustomers = useCallback(async () => {
        try {
            const result = await db.getAllAsync(
                'SELECT id, name, address FROM customers ORDER BY name ASC'
            );
            setCustomers(result);
            return result;
        } catch(error) {
            console.error("Error fetching customers:", error);
            throw error;
        }
    }, [db]);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            await fetchCustomers();
        } catch(error) {
            console.error("Error loading data:", error);
            Alert.alert("Error", "Failed to load customers");
        } finally {
            setIsLoading(false);
        }
    }, [fetchCustomers]);

    // Add new customer
    const addCustomer = useCallback(async (name, address) => {
        try {
            if (!name || !address) {
                Alert.alert("Error", "All fields are required");
                return;
            }

            const result = await db.runAsync(
                'INSERT INTO customers(name, address) VALUES (?, ?)',
                [name, address]
            );
            
            await loadData();
            Alert.alert("Success", "Customer added successfully");
        } catch(error) {
            console.error("Error adding customer:", error);
            Alert.alert("Error", error.message);
            throw error;
        }
    }, [db, loadData]);

    // Update customer
    const updateCustomer = useCallback(async (id, name, address) => {
        try {
            if (isNaN(parseInt(id))) return;
            if (!name && !address) {
                Alert.alert("Error", "Fill up at least one field");
                return;
            }

            let query, params;
            if (!name && address) {
                query = 'UPDATE customers SET address = ? WHERE id = ?';
                params = [address, id];
            } else if (name && !address) {
                query = 'UPDATE customers SET name = ? WHERE id = ?';
                params = [name, id];
            } else {
                query = 'UPDATE customers SET name = ?, address = ? WHERE id = ?';
                params = [name, address, id];
            }

            await db.runAsync(query, params);
            await loadData();
            Alert.alert("Success", "Customer updated successfully");
        } catch(error) {
            console.error("Error updating customer:", error);
            throw error;
        }
    }, [db, loadData]);

    // Delete customer
    const deleteCustomer = useCallback(async (id) => {
        try {
            // Note: [ON DELETE CASCADE] in orders table effect - deleting a customer will also delete their orders.
            const result = await db.runAsync('DELETE FROM customers WHERE id = ?', [id]);
            await loadData();
            if (result.changes > 0) Alert.alert("Success", "Customer deleted");
        } catch(error) {
            console.error("Error deleting customer:", error);
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