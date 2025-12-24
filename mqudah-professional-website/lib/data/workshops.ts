import { db } from "@/lib/db";
import { workshops } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function getAllWorkshops() {
    // Used for Admin List
    return await db.query.workshops.findMany({
        orderBy: [desc(workshops.startTime)]
    });
}
