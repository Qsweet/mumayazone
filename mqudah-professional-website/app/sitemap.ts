import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function generateSitemaps() {
    return [{ id: 'en' }, { id: 'ar' }];
}

export default async function sitemap({
    id,
}: {
    id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
    const locale = await id;
    const baseUrl = 'https://mumayazone.com';

    // Static routes
    const routes = [
        '',
        '/about',
        '/courses',
        '/blog',
        '/contact',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Blog Posts
    const posts = await db.query.blogPosts.findMany({
        where: (posts, { eq }) => eq(posts.isPublished, true),
        columns: {
            slug: true,
            updatedAt: true,
        }
    });

    const postUrls = posts.map((post) => ({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: post.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Dynamic Courses
    const coursesList = await db.query.courses.findMany({
        where: (courses, { eq }) => eq(courses.isPublished, true),
        columns: {
            slug: true,
            updatedAt: true,
        }
    });

    const courseUrls = coursesList.map((course) => ({
        url: `${baseUrl}/${locale}/courses/${course.slug}`,
        lastModified: course.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...routes, ...postUrls, ...courseUrls];
}
