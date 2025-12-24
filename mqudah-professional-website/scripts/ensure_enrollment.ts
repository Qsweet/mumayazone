import 'dotenv/config';
import { db } from "../lib/db";
import { users, courses, enrollments } from "../lib/db/schema";
import { eq, and } from "drizzle-orm";

async function main() {
    console.log("Checking enrollment...");

    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL not set");
        process.exit(1);
    }

    // Check if db connection works
    try {
        const user = await db.query.users.findFirst();
        console.log("DB connection successful");
    } catch (e) {
        console.error("DB connection failed", e);
        process.exit(1);
    }

    const email = "admin_e2e@mqudah.com";
    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (!user) {
        console.error(`User ${email} not found`);
        process.exit(1);
    }

    const course = await db.query.courses.findFirst();
    if (!course) {
        console.error("No courses found");
        process.exit(1);
    }

    console.log(`Checking enrollment for user ${user.id} in course ${course.slug}`);

    const enrollment = await db.query.enrollments.findFirst({
        where: and(
            eq(enrollments.userId, user.id),
            eq(enrollments.courseId, course.id)
        )
    });

    if (enrollment) {
        console.log(`User already enrolled in ${course.title} (Status: ${enrollment.status})`);

        // Ensure status is active
        if (enrollment.status !== 'active') {
            await db.update(enrollments)
                .set({ status: 'active' })
                .where(eq(enrollments.id, enrollment.id));
            console.log("Updated enrollment status to active");
        }
    } else {
        await db.insert(enrollments).values({
            userId: user.id,
            courseId: course.id,
            status: 'active'
        });
        console.log(`Enrolled user in ${course.title}`);
    }
}

main().catch(console.error).then(() => process.exit(0));
