
import "dotenv/config";
import { db } from "../lib/db";
import { courses } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Checking courses...");
    const allCourses = await db.query.courses.findMany();

    if (allCourses.length === 0) {
        console.log("No courses found in database.");
    } else {
        allCourses.forEach((c) => {
            console.log(`- [${c.id}] ${c.title}`);
            console.log(`  Slug: ${c.slug}`);
            console.log(`  Published: ${c.isPublished}`);
            console.log("---");
        });
    }
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
