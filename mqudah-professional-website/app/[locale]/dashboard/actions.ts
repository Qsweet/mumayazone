"use server";

import { db } from "@/lib/db";
import { lessonProgress, lessons, contentModules, enrollments } from "@/lib/db/schema";
import { eq, and, count, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/session";
import { redirect } from "next/navigation";

// Helper to get current user
async function getUser() {
    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }
    return session.user;
}

export async function getCourseProgress(courseId: string) {
    const user = await getUser();

    // 1. Total Lessons
    const courseLessons = await db
        .select({ id: lessons.id })
        .from(lessons)
        .innerJoin(contentModules, eq(lessons.moduleId, contentModules.id))
        .where(eq(contentModules.courseId, courseId));

    const totalLessons = courseLessons.length;
    if (totalLessons === 0) return { percent: 0, completed: 0, total: 0 };

    // 2. Completed Lessons
    const completedCountResult = await db
        .select({ count: count() })
        .from(lessonProgress)
        .innerJoin(lessons, eq(lessonProgress.lessonId, lessons.id))
        .innerJoin(contentModules, eq(lessons.moduleId, contentModules.id))
        .where(and(
            eq(lessonProgress.userId, user.id),
            eq(lessonProgress.isCompleted, true),
            eq(contentModules.courseId, courseId)
        ));

    const completedCount = completedCountResult[0].count;
    const percent = Math.round((completedCount / totalLessons) * 100);

    return {
        percent,
        completed: completedCount,
        total: totalLessons
    };
}

export async function updateLessonProgress(lessonId: string, isCompleted?: boolean, lastWatchedPosition?: number) {
    const user = await getUser();

    const existing = await db.query.lessonProgress.findFirst({
        where: and(
            eq(lessonProgress.userId, user.id),
            eq(lessonProgress.lessonId, lessonId)
        )
    });

    if (existing) {
        await db.update(lessonProgress)
            .set({
                isCompleted: isCompleted ?? existing.isCompleted,
                lastWatchedPosition: lastWatchedPosition ?? existing.lastWatchedPosition,
                updatedAt: new Date()
            })
            .where(eq(lessonProgress.id, existing.id));
    } else {
        await db.insert(lessonProgress)
            .values({
                userId: user.id,
                lessonId,
                isCompleted: isCompleted ?? false,
                lastWatchedPosition: lastWatchedPosition ?? 0
            });
    }

    revalidatePath("/dashboard");
    revalidatePath(`/courses`);
    // We might also want to revalidate the lesson page itself if we knew the path
}

export async function getResumeCourse() {
    const user = await getUser();

    console.log("--- DEBUG: UPDATED CODE RUNNING: Checking Lesson Progress ---");
    const lastProgress = await db.query.lessonProgress.findFirst({
        where: eq(lessonProgress.userId, user.id),
        orderBy: [desc(lessonProgress.updatedAt)],
        with: {
            lesson: {
                with: {
                    module: {
                        with: {
                            course: true
                        }
                    }
                }
            }
        }
    });

    if (!lastProgress) return null;

    return {
        course: lastProgress.lesson.module.course,
        lesson: lastProgress.lesson,
        progress: lastProgress
    };
}

export async function getEnrolledCourses() {
    const user = await getUser();
    // Fetch courses user is enrolled in
    // Join enrollments -> courses
    // And attach progress

    // For now, simpler: just get enrollments
    const userEnrollments = await db.query.enrollments.findMany({
        where: eq(enrollments.userId, user.id),
        with: {
            course: true
        }
    });

    // Calculate progress for each
    const coursesWithProgress = await Promise.all(userEnrollments.map(async (enrollment) => {
        const progress = await getCourseProgress(enrollment.course.id);
        return {
            ...enrollment.course,
            progress
        };
    }));

    return coursesWithProgress;
}
