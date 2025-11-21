import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initialize DB
let db: any;

export async function initDB() {
    db = await open({
        filename: ':memory:', // Use in-memory for simplicity
        driver: sqlite3.Database
    });

    await db.exec(`
    CREATE TABLE sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item TEXT,
      category TEXT,
      amount REAL,
      date TEXT
    );
    INSERT INTO sales (item, category, amount, date) VALUES ('Laptop', 'electronics', 1200, '2023-10-25');
    INSERT INTO sales (item, category, amount, date) VALUES ('Laptop', 'electronics', 1500, '2023-10-26');
    INSERT INTO sales (item, category, amount, date) VALUES ('Laptop', 'electronics', 1300, '2023-10-27');
    INSERT INTO sales (item, category, amount, date) VALUES ('Mouse', 'electronics', 25, '2023-10-25');
    INSERT INTO sales (item, category, amount, date) VALUES ('Keyboard', 'electronics', 75, '2023-10-26');
    INSERT INTO sales (item, category, amount, date) VALUES ('Coffee', 'food', 5, '2023-10-26');
  `);
    console.log('Mock DB initialized');

    // Test query to verify data
    const testResult = await db.all("SELECT * FROM sales WHERE item LIKE '%Laptop%'");
    console.log('TEST QUERY - Laptop sales:', JSON.stringify(testResult, null, 2));
    console.log('TEST QUERY - Count:', testResult.length);
}

export const tools = [
    {
        functionDeclarations: [
            {
                name: "query_database",
                description: `Execute a SQL query against the sales database. 
                
Database schema:
- Table: 'sales'
- Columns: id (INTEGER), item (TEXT), category (TEXT), amount (REAL), date (TEXT)

Important: 
- 'item' contains product names like 'Laptop', 'Mouse', 'Keyboard', 'Coffee'
- 'category' contains categories like 'electronics', 'food'
- Use LIKE with wildcards for flexible matching on item names

Examples:
- To count laptops: SELECT COUNT(*) FROM sales WHERE item LIKE '%Laptop%'
- To sum laptop sales: SELECT SUM(amount) FROM sales WHERE item LIKE '%Laptop%'
- To get all laptop records: SELECT * FROM sales WHERE item LIKE '%Laptop%'`,
                parameters: {
                    type: "OBJECT",
                    properties: {
                        sql: {
                            type: "STRING",
                            description: "The SQL query to execute"
                        }
                    },
                    required: ["sql"]
                }
            }
        ]
    }
];

export async function executeTool(name: string, args: any) {
    console.log('=== TOOL EXECUTION START ===');
    console.log('Tool name:', name);
    console.log('Tool args:', JSON.stringify(args, null, 2));

    if (name === 'query_database') {
        try {
            const sql = args.sql;
            console.log('Executing SQL:', sql);
            const result = await db.all(sql);
            console.log('SQL Result:', JSON.stringify(result, null, 2));
            console.log('Result count:', result.length);
            console.log('=== TOOL EXECUTION END ===');
            return JSON.stringify(result);
        } catch (e: any) {
            console.error('SQL Error:', e.message);
            console.log('=== TOOL EXECUTION END (ERROR) ===');
            return `Error executing SQL: ${e.message}`;
        }
    }
    console.log('=== TOOL EXECUTION END (UNKNOWN TOOL) ===');
    return 'Unknown tool';
}
