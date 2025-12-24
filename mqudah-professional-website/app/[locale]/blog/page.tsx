import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Calendar, User } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: PageProps) {
    const { locale } = await params;

    // Fetch posts
    const posts = await db.query.blogPosts.findMany({
        orderBy: [desc(blogPosts.createdAt)],
        with: {
            author: true,
            category: true,
        },
        where: (posts, { eq }) => eq(posts.isPublished, true), // Filter published only
    });

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4">
                <div className="mb-16 text-center">
                    <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                        {locale === 'ar' ? "المدونة والمقالات" : "Insights & Resources"}
                    </h1>
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        {locale === 'ar'
                            ? "مقالات متخصصة، اتجاهات الصناعة، وأدلة التطوير المهني."
                            : "Expert articles, industry trends, and professional development guides."
                        }
                    </p>
                </div>

                {posts.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => {
                            const title = post.title;
                            const excerpt = post.excerpt;

                            return (
                                <article
                                    key={post.id}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-border/80"
                                >
                                    <div className="aspect-[1.6] w-full bg-muted transition-colors group-hover:bg-muted/80" />
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center text-accent">
                                                {post.category?.name || "Uncategorized"}
                                            </span>
                                            <span className="flex items-center">
                                                <Calendar className="mr-1 h-3 w-3" />
                                                {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : 'Draft'}
                                            </span>
                                        </div>

                                        <h2 className="mb-3 text-2xl font-bold leading-tight group-hover:text-accent transition-colors">
                                            <Link href={`/${locale}/blog/${post.slug}`}>
                                                {title}
                                            </Link>
                                        </h2>

                                        <p className="mb-6 line-clamp-3 text-sm text-muted-foreground flex-1">
                                            {excerpt}
                                        </p>

                                        <div className="mt-auto flex items-center border-t border-border pt-4">
                                            <div className="h-8 w-8 rounded-full bg-muted mr-3" />
                                            <span className="text-sm font-medium">
                                                {post.author.name}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 py-32 text-center">
                        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                            <Calendar className="h-8 w-8" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold">No Articles Yet</h3>
                        <p className="max-w-md text-muted-foreground">
                            Check back soon for our latest insights and articles.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
