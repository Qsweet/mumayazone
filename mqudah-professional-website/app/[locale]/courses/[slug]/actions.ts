"use server";

import { auth } from "@/lib/session";
import { db } from "@/lib/db";
import { enrollments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function enrollUser(courseId: string) {
    const session = await auth();

    if (!session || !session.user) {
        return { error: "You must be logged in to enroll." };
    }

    try {
        // Check if already enrolled
        const existing = await db.query.enrollments.findFirst({
            where: and(
                eq(enrollments.courseId, courseId),
                eq(enrollments.userId, session.user.id)
            )
        });

        if (existing) {
            return { message: "Already enrolled" };
        }

        // Create new enrollment
        // Note: For paid courses, paymentId would be required. 
        // For now, assuming free enrollment or handled elsewhere for paid.
        // The UI component checks price > 0, but this action doesn't validate payment yet.
        // Plan assumes simple enrollment logic for now as per "Optimistic UI" task.

        await db.insert(enrollments).values({
            userId: session.user.id,
            courseId: courseId,
            status: 'active',
            enrolledAt: new Date(),
        });

        revalidatePath("/courses/[slug]", "page");
        // We might want to revalidate the specific path if we had the slug, 
        // but revalidating the layout or specific path pattern works too.
        // Better: return success and let client router.refresh() handle it, 
        // but revalidatePath ensures server cache is stale.

        return { success: true };

    } catch (error) {
        console.error("Enrollment error:", error);
        return { error: "Failed to enroll. Please try again." };
    }
}
