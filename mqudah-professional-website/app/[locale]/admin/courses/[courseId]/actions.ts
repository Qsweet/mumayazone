
"use server";

import { db } from "@/lib/db";
import { contentModules, lessons, courses } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createModule(courseId: string, title: string) {
    // Get highest order index
    const existingModules = await db.query.contentModules.findMany({
        where: eq(contentModules.courseId, courseId),
        orderBy: [asc(contentModules.orderIndex)]
    });

    const nextIndex = existingModules.length > 0
        ? existingModules[existingModules.length - 1].orderIndex + 1
        : 0;

    await db.insert(contentModules).values({
        courseId,
        title,
        orderIndex: nextIndex
    });

    revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteModule(moduleId: string, courseId: string) {
    // Determine if we need to cascade delete lessons? 
    // Drizzle/PG usually handles this if cascade is set, but let's be safe and delete lessons first or rely on cascade.
    // Schema doesn't specify cascade for lessons -> module, so we should delete lessons manually or update schema.
    // For now, let's assuming manual delete for safety.

    await db.delete(lessons).where(eq(lessons.moduleId, moduleId));
    await db.delete(contentModules).where(eq(contentModules.id, moduleId));

    revalidatePath(`/admin/courses/${courseId}`);
}

export async function createLesson(moduleId: string, title: string, courseId: string) {
    const existingLessons = await db.query.lessons.findMany({
        where: eq(lessons.moduleId, moduleId),
        orderBy: [asc(lessons.orderIndex)]
    });

    const nextIndex = existingLessons.length > 0
        ? existingLessons[existingLessons.length - 1].orderIndex + 1
        : 0;

    await db.insert(lessons).values({
        moduleId,
        title,
        orderIndex: nextIndex
    });

    revalidatePath(`/admin/courses/${courseId}`);
}

export async function updateLesson(lessonId: string, data: { title?: string, videoUrl?: string, contentText?: string }, courseId: string) {
    await db.update(lessons)
        .set(data)
        .where(eq(lessons.id, lessonId));

    revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteLesson(lessonId: string, courseId: string) {
    await db.delete(lessons).where(eq(lessons.id, lessonId));
    revalidatePath(`/admin/courses/${courseId}`);
}

export async function reorderModules(courseId: string, newOrder: { id: string, orderIndex: number }[]) {
    // This could be optimized with a transaction or batch update
    // For now simple Promise.all
    await Promise.all(newOrder.map(item =>
        db.update(contentModules)
            .set({ orderIndex: item.orderIndex })
            .where(eq(contentModules.id, item.id))
    ));

    revalidatePath(`/admin/courses/${courseId}`);
}

export async function updateCourse(courseId: string, formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string) * 100; // Convert to cents
    const level = formData.get("level") as string;
    // Client component sends "true" or "false" string, or checked state. 
    // Let's handle generic FormData check like in blog
    const rawIsPublished = formData.get("isPublished");
    const isPublished = rawIsPublished === "true" || rawIsPublished === "on";

    await db.update(courses)
        .set({
            title,
            description,
            price,
            level: level as "beginner" | "intermediate" | "advanced",
            isPublished
        })
        .where(eq(courses.id, courseId));

    revalidatePath(`/admin/courses`);
    revalidatePath(`/courses`);
    revalidatePath(`/admin/courses/${courseId}`);
}
