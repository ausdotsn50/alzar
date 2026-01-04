import { SQLiteProvider } from "expo-sqlite";

// SQLite syntax from 
async function initDB(db) {
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS products(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                item TEXT NOT NULL,
                base_price REAL NOT NULL
            );

            CREATE TABLE IF NOT EXISTS customers(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                address TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS orders(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
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
        
        console.log("Database initialized successfully");
    } catch(error) {
        console.error("Error initializing database:", error);
        throw error; 
    }
}

export default function App(){
    return (
        <SQLiteProvider
            databaseName="alzar.db"
            onInit={initDB}
        >
        </SQLiteProvider>
    );
}