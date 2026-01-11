import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

// Rechecking useTransactions
export function useTransactions() {
    const db = useSQLiteContext();
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        income: 0,
        expenses: 0,
        netIncome: 0,
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

        setTransactions(result);
        return result;
    } catch(error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
    }, [db]);

    // Fetch summary for the month instead of a (daily report)
    // Customer feature
    const fetchSummary = useCallback(async () => {
        try {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1; // Months are 0-indexed (+1)
            
            // (Gross) Income
            const incResult = await db.getFirstAsync(`
                SELECT COALESCE(SUM(total_price), 0) AS inc
                FROM orders
                WHERE strftime('%Y', created_at) = ? 
                AND strftime('%m', created_at) = ?
            `, [year.toString(), month.toString().padStart(2, '0')]);

            // Expenses
            const expResult = await db.getFirstAsync(`
                SELECT COALESCE(SUM(amount), 0) AS exp
                FROM expenses
                WHERE strftime('%Y', created_at) = ? 
                AND strftime('%m', created_at) = ?
            `, [year.toString(), month.toString().padStart(2, '0')]);

            const income = incResult?.inc || 0;
            const expenses = expResult?.exp || 0;

            const summaryData = {
                income,
                expenses,
                netIncome: income - expenses,
            };
            setSummary(summaryData);
            return summaryData;
        } catch (error) {
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

            await new Promise(resolve => setTimeout(resolve, 500)); // new Promise object + set a Timeout for delete delay fx
            await loadData();
        } catch(error) {
            console.error("Error deleting transaction:", error);
            Alert.alert("Error", error.message);
        } finally {
            Alert.alert("Success", `${type === 'order' ? 'Order' : 'Expense'} deleted successfully`);    
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