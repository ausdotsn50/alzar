export async function initDB(db) {
    try {
        await db.execAsync('PRAGMA foreign_keys = ON;');

        // Create Products
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                item TEXT NOT NULL,
                base_price REAL NOT NULL
            );
        `);

        // Create Customers
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                address TEXT NOT NULL
            );
        `);

        // Separating orders and expense table instead of coalesceing to a Transactions table
        // Expenses are free form and orders have more structure
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                customer_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                type TEXT NOT NULL,
                total_price REAL NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
            );
        `);
        
        // Additional table in the DB for expenses
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                amount REAL NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error initializing database:", error);
        throw error; 
    }
}