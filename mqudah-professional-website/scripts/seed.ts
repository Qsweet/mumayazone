// @ts-nocheck
import * as dotenv from "dotenv";
dotenv.config();
import { db } from "../lib/db";
import { courses, blogPosts, users, workshops, contentModules, lessons } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "../lib/auth-server";

async function main() {
    console.log("🌱 Seeding database with Professional Blueprint...");

    // Create Admin
    // Create Admin
    const adminEmail = "m.qudah@mqudah.com";
    const FIXED_ADMIN_ID = "00000000-0000-0000-0000-000000000001";
    const hashedPwd = await hashPassword("MqudahAdmin2025!");

    await db.insert(users).values({
        id: FIXED_ADMIN_ID,
        name: "Mohammad Qudah",
        email: adminEmail,
        passwordHash: hashedPwd,
        role: "admin",
        isVerified: true,
    }).onConflictDoUpdate({
        target: users.email,
        set: { passwordHash: hashedPwd }
    });

    // Create E2E Admin
    const e2eEmail = "admin_e2e@mqudah.com";
    await db.insert(users).values({
        id: crypto.randomUUID(),
        name: "E2E Admin Robot",
        email: e2eEmail,
        passwordHash: hashedPwd,
        role: "admin",
        isVerified: true,
    }).onConflictDoNothing();

    console.log("✅ Admin user ensured");

    // Create Courses with Modules and Lessons
    const courseData = [
        {
            title: "AI Fundamentals for Business",
            slug: "ai-fundamentals",
            description: "Master the basics of Artificial Intelligence and how to leverage it for business growth in 2025.",
            duration: "15h 30m",
            level: "beginner" as const,
            price: 19900,
            currency: "USD",
            instructorId: FIXED_ADMIN_ID,
            isPublished: true,
            coverImageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
        },
        {
            title: "Advanced Leadership Mastery",
            slug: "leadership-mastery",
            description: "Develop executive presence and lead high-performing teams in a digital-first world.",
            duration: "24h 00m",
            level: "advanced" as const,
            price: 49900,
            currency: "USD",
            instructorId: FIXED_ADMIN_ID,
            isPublished: true,
            coverImageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
        },
    ];

    for (const course of courseData) {
        // Check if course already exists to get its ID
        const existingCourse = await db.query.courses.findFirst({
            where: eq(courses.slug, course.slug)
        });

        let courseId: string;

        if (existingCourse) {
            courseId = existingCourse.id;
            // Update if needed, or skip
            console.log(`Using existing course: ${course.title}`);
        } else {
            courseId = crypto.randomUUID();
            await db.insert(courses).values({
                ...course,
                id: courseId,
            }).onConflictDoNothing();
        }

        // Add Modules (Check if module exists for simplicity or just try to insert)
        // Since modules don't have unique slugs in this simple seed, we might duplicate them if we run seed multiple times.
        // Better to check if modules exist for this course.
        const existingModules = await db.query.contentModules.findMany({
            where: eq(contentModules.courseId, courseId)
        });

        if (existingModules.length === 0) {
            const moduleId = crypto.randomUUID();
            await db.insert(contentModules).values({
                id: moduleId,
                courseId: courseId,
                title: "Module 1: Introduction",
                orderIndex: 0
            });

            // Add Lesson
            await db.insert(lessons).values({
                id: crypto.randomUUID(),
                moduleId: moduleId,
                title: "Welcome to the Course",
                contentText: "Welcome! use the video above.",
                videoUrl: "https://vimeo.com/manage/videos/123456",
                orderIndex: 0
            });
        }
    }
    console.log(`✅ Seeded courses with curriculum`);

    // Create Workshops (New Feature)
    const workshopData = [
        {
            title: "Live Strategy Session: Q1 2025",
            slug: "strategy-session-q1",
            description: "Join us for a live interactive workshop on planning your Q1 strategy.",
            startTime: new Date("2025-01-15T14:00:00Z"),
            durationMinutes: 90,
            price: 5000,
            currency: "USD",
            isFree: false,
            isPublished: true,
            coverImageUrl: "https://images.unsplash.com/photo-1544531586-fde5298cdd40"
        },
        {
            title: "Free AI Tools Webinar",
            slug: "free-ai-webinar",
            description: "Explore the best free AI tools available today.",
            startTime: new Date("2025-01-20T10:00:00Z"),
            durationMinutes: 60,
            price: 0,
            currency: "USD",
            isFree: true,
            isPublished: true,
            coverImageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b"
        }
    ];

    for (const ws of workshopData) {
        await db.insert(workshops).values({
            ...ws,
            id: crypto.randomUUID(),
        }).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${workshopData.length} workshops`);

    // Create Blog Posts
    const postData = [
        {
            title: "The Future of Work in 2025",
            slug: "future-of-work-2025",
            content: "Full content here...",
            excerpt: "Explore the emerging trends shaping the global workforce, from AI integration to remote leadership.",
            authorId: FIXED_ADMIN_ID,
            isPublished: true,
            publishedAt: new Date(),
        },
    ];

    for (const post of postData) {
        await db.insert(blogPosts).values({
            ...post,
            id: crypto.randomUUID(),
        }).onConflictDoNothing();
    }
    console.log(`✅ Seeded blog posts`);

    console.log("🎉 Seeding complete!");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
