
import "dotenv/config";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Diagnosing Users Table Schema...");
    try {
        const cols = await db.execute(sql`
            SELECT column_name, data_type, udt_name
            FROM information_schema.columns 
            WHERE table_name = 'users';
        `);
        console.table(cols.rows);
    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
}

main();
