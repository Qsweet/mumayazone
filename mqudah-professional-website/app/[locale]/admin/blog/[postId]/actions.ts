
"use server";

import { db } from "@/lib/db";
import { blogPosts, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateBlogPost(id: string, formData: FormData) {

    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    // FIX: Checkbox sends "on" on native forms, but checking for existence is safer standard
    console.log("[DEBUG] updateBlogPost formData keys:", Array.from(formData.keys()));
    const rawIsPublished = formData.get("isPublished");
    console.log("[DEBUG] isPublished raw:", rawIsPublished);

    // Handle "true", "on", and ensure we don't accidentally publish on "false" or null
    const isPublished = rawIsPublished === "true" || rawIsPublished === "on";
    const slug = formData.get("slug") as string;

    // SEO Fields (ZEUS)
    const seoTitle = formData.get("seoTitle") as string;
    const seoDescription = formData.get("seoDescription") as string;
    const tagsRaw = formData.get("tags") as string; // JSON string or comma-separated
    let tags: string[] = [];
    try {
        tags = tagsRaw ? JSON.parse(tagsRaw) : [];
    } catch (e) {
        console.warn("Tags parsing failed, using raw string split");
        tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : [];
    }
    const readingTime = Number(formData.get("readingTime")) || 0;

    // Arabic Content


    await db.update(blogPosts)
        .set({
            title,
            slug,
            excerpt,
            content,
            isPublished,
            seoTitle,
            seoDescription,
            tags,
            readingTime,
            updatedAt: new Date(),
        })
        .where(eq(blogPosts.id, id));

    revalidatePath(`/blog/${slug}`);
    revalidatePath(`/admin/blog`);
    revalidatePath(`/`); // For home page grid
}

export async function createBlogPost(formData: FormData) {
    const title = formData.get("title") as string;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Auth Check & Get AuthorId
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    let authorId: string;
    try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        authorId = payload.sub || payload.userId || payload.id;
    } catch (e) {
        throw new Error("Invalid Token");
    }

    // Create new post
    const [newPost] = await db.insert(blogPosts).values({
        title,
        slug,
        content: "<p>Start writing...</p>",
        excerpt: "",
        isPublished: false,
        authorId: authorId,
    }).returning();

    return newPost.id;
}
