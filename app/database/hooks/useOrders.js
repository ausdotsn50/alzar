import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export function useOrders(userId) {
    const db = useSQLiteContext();
    const [orders, setOrders] = useState([]);
    const [summary, setSummary] = useState({
        revenue: 0,
        delivers: 0,
        walkins: 0,
        topRevContri: null
    });
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all orders
    const fetchOrders = useCallback(async () => {
        try {
            const result = await db.getAllAsync(`
                SELECT orders.id, name, address, item, type,
                    total_price, created_at FROM orders
                    JOIN customers ON orders.customer_id = customers.id
                    JOIN products ON orders.product_id = products.id
                    WHERE orders.user_id = ?
                    ORDER BY created_at DESC
                    LIMIT 50
            `, [userId]);
            
            setOrders(result);
            return result;
        } catch(error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    }, [db, userId]);

    // Fetch summary for today
    const fetchSummary = useCallback(async () => {
        try {
            const today = new Date().toISOString().split('T')[0];

            const revResult = await db.getFirstAsync(`
                SELECT COALESCE(SUM(total_price), 0) AS rev
                FROM orders
                WHERE user_id = ? AND DATE(created_at) = ?
            `, [userId, today]);

            const deliverResult = await db.getFirstAsync(`
                SELECT COUNT(*) AS count FROM orders 
                WHERE type = 'deliver' AND user_id = ? AND DATE(created_at) = ?
            `, [userId, today]);

            const walkinResult = await db.getFirstAsync(`
                SELECT COUNT(*) AS count FROM orders 
                WHERE type = 'walk in' AND user_id = ? AND DATE(created_at) = ?
            `, [userId, today]);

            const trcResult = await db.getFirstAsync(`
                SELECT name, address, quantity, item, total_price AS rev
                FROM orders
                    JOIN customers ON orders.customer_id = customers.id
                    JOIN products ON orders.product_id = products.id
                WHERE orders.user_id = ? AND DATE(created_at) = ?
                ORDER BY rev DESC
                LIMIT 1
            `, [userId, today]);

            const summaryData = {
                revenue: revResult?.rev || 0,
                delivers: deliverResult?.count || 0,
                walkins: walkinResult?.count || 0,
                topRevContri: trcResult || null
            };

            setSummary(summaryData);
            return summaryData;
        } catch(error) {
            console.error("Error fetching summary:", error);
            throw error;
        }
    }, [db, userId]);

    // Load both orders and summary
    const loadData = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);

        try {
            await Promise.all([fetchOrders(), fetchSummary()]);
        } catch(error) {
            console.error("Error loading data:", error);
            Alert.alert("Error", "Failed to load data");
        } finally {
            setIsLoading(false);
        }
    }, [fetchOrders, fetchSummary, userId]);

    // Delete an order
    const deleteOrder = useCallback(async (id) => {
        try {
            if (isNaN(parseInt(id))) {
                throw new Error("Invalid order ID");
            }

            const result = await db.runAsync(
                'DELETE FROM orders WHERE id = ?', 
                [id]
            );

            if (result.changes === 0) {
                throw new Error("Order not found");
            }

            await loadData(); // Refresh data
            Alert.alert("Success", "Order deleted successfully");
        } catch(error) {
            console.error("Error deleting order:", error);
            Alert.alert("Error", error.message);
        }
    }, [db, loadData]);

    // Create a new order
    const createOrder = useCallback(async (product_id, customer_id, quantity, type) => {
        try {
            // Get product price
            const product = await db.getFirstAsync(
                'SELECT base_price FROM products WHERE id = ?',
                [product_id]
            );

            if (!product) {
                throw new Error("Product not found");
            }

            const price = parseFloat(product.base_price);
            let total_price;

            if (type === "deliver") {
                total_price = (price + 5.00) * quantity;
            } else {
                total_price = price * quantity;
            }

            const result = await db.runAsync(`
                INSERT INTO orders(user_id, product_id, customer_id, quantity, type, total_price, created_at)
                VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
            `, [userId, product_id, customer_id, quantity, type, total_price]);

            await loadData();
            Alert.alert("Success", "Order created successfully");
            return result.lastInsertRowid;
        } catch(error) {
            console.error("Error creating order:", error);
            Alert.alert("Error", error.message);
            throw error;
        }
    }, [db, userId, loadData]);

    return { 
        orders, 
        summary,
        isLoading, 
        loadData, 
        deleteOrder,
        createOrder
    };
}