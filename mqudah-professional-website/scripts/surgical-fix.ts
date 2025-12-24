
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Running surgical fix for courses/workshops...");
    try {
        await db.execute(sql`ALTER TABLE courses ADD COLUMN IF NOT EXISTS title_ar text;`);
        await db.execute(sql`ALTER TABLE courses ADD COLUMN IF NOT EXISTS description_ar text;`);

        await db.execute(sql`ALTER TABLE workshops ADD COLUMN IF NOT EXISTS title_ar text;`);
        await db.execute(sql`ALTER TABLE workshops ADD COLUMN IF NOT EXISTS description_ar text;`);

        console.log("Successfully added ar columns.");
    } catch (e) {
        console.error("Error adding columns:", e);
    }
    process.exit(0);
}

main();
