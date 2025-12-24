
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Checking UserRole values...");
    try {
        const res = await db.execute(sql`
            SELECT e.enumlabel
            FROM pg_enum e
            JOIN pg_type t ON e.enumtypid = t.oid
            WHERE t.typname = 'UserRole';
        `);
        console.log("Values:", res.rows.map(r => r.enumlabel).join(', '));
    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
}

main();
