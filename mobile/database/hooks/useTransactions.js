import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

// Rechecking useTransactions
export function useTransactions() {
    const db = useSQLiteContext();
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        revenue: 0,
        expenses: 0,
        netIncome: 0,
        delivers: 0,
        walkins: 0,
        topRevContri: null
    });
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all transactions (orders + expenses)
    const fetchTransactions = useCallback(async () => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
                'order-' || orders.id AS unique_key,
                orders.id,
                'order' AS transaction_type,
                orders.type AS order_type,
                orders.quantity,
                orders.total_price AS amount,
                orders.created_at,
                customers.name AS customer_name,
                customers.address AS customer_address,
                products.item AS description
            FROM orders
            JOIN customers ON orders.customer_id = customers.id
            JOIN products ON orders.product_id = products.id
            
            UNION ALL
            
            SELECT 
                'expense-' || expenses.id AS unique_key,
                expenses.id,
                'expense' AS transaction_type,
                NULL AS order_type,
                NULL AS quantity,
                expenses.amount AS amount,
                expenses.created_at,
                NULL AS customer_name,
                NULL AS customer_address,
                expenses.title AS description
            FROM expenses
            
            ORDER BY created_at DESC
            LIMIT 50
        `);
        
        /*
        console.log('First 3 transactions with keys:', result.slice(0, 3).map(t => ({ 
            unique_key: t.unique_key, 
            id: t.id, 
            type: t.transaction_type 
        })));
        */
       
        setTransactions(result);
        return result;
    } catch(error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
    }, [db]);

    // Fetch summary for today
    const fetchSummary = useCallback(async () => {
        try {
            const today = new Date().toISOString().split('T')[0];

            // 1. Total Revenue from orders
            const revResult = await db.getFirstAsync(`
                SELECT COALESCE(SUM(total_price), 0) AS rev
                FROM orders
                WHERE DATE(created_at) = ?
            `, [today]);

            // 2. Total Expenses
            const expResult = await db.getFirstAsync(`
                SELECT COALESCE(SUM(amount), 0) AS exp
                FROM expenses
                WHERE DATE(created_at) = ?
            `, [today]);

            // 3. Delivery Count
            const deliverResult = await db.getFirstAsync(`
                SELECT COUNT(*) AS count FROM orders 
                WHERE type = 'deliver' AND DATE(created_at) = ?
            `, [today]);

            // 4. Walk-in Count
            const walkinResult = await db.getFirstAsync(`
                SELECT COUNT(*) AS count FROM orders 
                WHERE type = 'walk in' AND DATE(created_at) = ?
            `, [today]);

            // 5. Top Revenue Contributor
            const trcResult = await db.getFirstAsync(`
                SELECT 
                    customers.name, 
                    customers.address, 
                    orders.quantity, 
                    products.item, 
                    orders.total_price AS rev
                FROM orders
                JOIN customers ON orders.customer_id = customers.id
                JOIN products ON orders.product_id = products.id
                WHERE DATE(orders.created_at) = ?
                ORDER BY rev DESC
                LIMIT 1
            `, [today]);

            const revenue = revResult?.rev || 0;
            const expenses = expResult?.exp || 0;

            const summaryData = {
                revenue,
                expenses,
                netIncome: revenue - expenses,
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
    }, [db]);

    // Load both transactions and summary
    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            await Promise.all([fetchTransactions(), fetchSummary()]);
        } catch(error) {
            console.error("Error loading data:", error);
            Alert.alert("Error", "Failed to load data");
        } finally {
            setIsLoading(false);
        }
    }, [fetchTransactions, fetchSummary]);

    // Delete a transaction (order or expense)
    const deleteTransaction = useCallback(async (id, type) => {
        try {
            if (isNaN(parseInt(id))) throw new Error("Invalid transaction ID");

            const table = type === 'order' ? 'orders' : 'expenses';
            const result = await db.runAsync(`DELETE FROM ${table} WHERE id = ?`, [id]);

            if (result.changes === 0) throw new Error("Transaction not found");

            await loadData();
            Alert.alert("Success", `${type === 'order' ? 'Order' : 'Expense'} deleted successfully`);
        } catch(error) {
            console.error("Error deleting transaction:", error);
            Alert.alert("Error", error.message);
        }
    }, [db, loadData]);

    // Create a new order
    const createOrder = useCallback(async (product_id, customer_id, quantity, type) => {
        try {
            const product = await db.getFirstAsync(
                'SELECT base_price FROM products WHERE id = ?',
                [product_id]
            );

            if (!product) throw new Error("Product not found");

            const price = parseFloat(product.base_price);
            let total_price = (type === "deliver") ? (price + 5.00) * quantity : price * quantity;

            const result = await db.runAsync(`
                INSERT INTO orders(product_id, customer_id, quantity, type, total_price, created_at)
                VALUES (?, ?, ?, ?, ?, datetime('now'))
            `, [product_id, customer_id, quantity, type, total_price]);

            await loadData();
            return result.lastInsertRowid;
        } catch(error) {
            console.error("Error creating order:", error);
            Alert.alert("Error", error.message);
            throw error;
        }
    }, [db, loadData]);

    // Create a new expense
    const createExpense = useCallback(async (title, amount) => {
        try {
            if (!title || !amount) throw new Error("Title and amount are required");
            if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
                throw new Error("Amount must be a positive number");
            }

            const result = await db.runAsync(`
                INSERT INTO expenses(title, amount, created_at)
                VALUES (?, ?, datetime('now'))
            `, [title, parseFloat(amount)]);

            await loadData();
            return result.lastInsertRowid;
        } catch(error) {
            console.error("Error creating expense:", error);
            Alert.alert("Error", error.message);
            throw error;
        }
    }, [db, loadData]);

    return { 
        transactions,
        summary,
        isLoading, 
        loadData, 
        deleteTransaction,
        createOrder,
        createExpense
    };
}