import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function getAllCourses() {
    return await db.query.courses.findMany({
        orderBy: [desc(courses.updatedAt)]
    });
}
