import { db } from "@/lib/db";
import { users, courses, workshops, blogPosts, enrollments } from "@/lib/db/schema";
import { sql, desc } from "drizzle-orm";

export async function getAdminDashboardStats() {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [courseCount] = await db.select({ count: sql<number>`count(*)` }).from(courses);
    const [workshopCount] = await db.select({ count: sql<number>`count(*)` }).from(workshops);
    const [postCount] = await db.select({ count: sql<number>`count(*)` }).from(blogPosts);

    // Revenue simulation (real sum would go here)
    const revenue = 125000;

    return {
        userCount: userCount.count,
        courseCount: courseCount.count,
        workshopCount: workshopCount.count,
        postCount: postCount.count,
        revenue
    };
}

export async function getRecentActivity() {
    const recentEnrollments = await db.query.enrollments.findMany({
        orderBy: [desc(enrollments.enrolledAt)],
        limit: 5,
        with: {
            user: true,
            course: true
        }
    });
    return recentEnrollments;
}
