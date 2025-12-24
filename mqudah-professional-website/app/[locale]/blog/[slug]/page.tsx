
import { db } from "@/lib/db";
import { blogPosts, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { Metadata } from "next";
import Script from "next/script";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        slug: string;
        locale: string;
    }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, locale } = await params;
    const isAr = locale === 'ar';

    const post = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.slug, slug),
        with: { author: true }
    });

    if (!post || !post.isPublished) {
        return {
            title: isAr ? 'غير موجود' : 'Not Found',
        }
    }

    // Priority: SEO Title > DB Title
    const title = post.seoTitle || post.title;
    const description = post.seoDescription || post.excerpt;
    const url = `https://mumayazone.com/${locale}/blog/${slug}`;

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description || undefined,
            type: 'article',
            publishedTime: post.publishedAt?.toISOString(),
            modifiedTime: post.updatedAt?.toISOString(),
            url: url,
            authors: [post.author?.name || 'Mohammad Al-Qudah'],
            images: [
                {
                    url: 'https://mumayazone.com/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ],
            locale: locale,
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description || undefined,
        },
        alternates: {
            canonical: url,
        }
    }
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug, locale } = await params;
    const isAr = locale === 'ar';

    const post = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.slug, slug),
        with: {
            author: true,
            category: true,
        }
    });

    if (!post || !post.isPublished) {
        notFound();
    }

    const title = post.title;
    const content = post.content;
    const excerpt = post.excerpt;

    // JSON-LD Schema (ZEUS Protocol)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.seoTitle || title,
        description: post.seoDescription || excerpt,
        image: 'https://mumayazone.com/og-image.jpg',
        datePublished: post.publishedAt?.toISOString(),
        dateModified: post.updatedAt?.toISOString(),
        author: {
            '@type': 'Person',
            name: post.author?.name || 'Mohammad Al-Qudah',
            url: 'https://mumayazone.com'
        },
        publisher: {
            '@type': 'Organization',
            name: 'Mqudah',
            logo: {
                '@type': 'ImageObject',
                url: 'https://mumayazone.com/logo.png'
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://mumayazone.com/${locale}/blog/${slug}`
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            {/* JSON-LD Script */}
            <Script
                id="json-ld-article"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <div className="relative border-b border-border bg-muted/10">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <Link href={`/${locale}/blog`} className="flex items-center hover:text-primary transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2 rtl:rotate-180 rtl:ml-2 rtl:mr-0" />
                                {isAr ? "العودة للمدونة" : "Back to Blog"}
                            </Link>
                            <span className="h-1 w-1 rounded-full bg-border" />
                            <span className="flex items-center text-accent font-medium">
                                {post.category?.name || (isAr ? "عام" : "General")}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-border" />
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                                {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : 'Draft'}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-border" />
                            <span className="flex items-center">
                                <User className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                                {post.author.name}
                            </span>
                            {/* Reading Time Badge */}
                            {post.readingTime && (
                                <>
                                    <span className="h-1 w-1 rounded-full bg-border" />
                                    <span className="flex items-center text-green-400">
                                        {post.readingTime} {isAr ? "دقيقة" : "min read"}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
                            {title}
                        </h1>

                        {/* Excerpt */}
                        {excerpt && (
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                {excerpt}
                            </p>
                        )}

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex gap-2">
                                {post.tags.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <article className="container mx-auto px-4 py-16">
                <div className="flex justify-between items-center max-w-4xl mx-auto mb-8">
                    <div className="text-sm text-muted-foreground">{isAr ? "مشاركة المقال:" : "Share this article:"}</div>
                    <ShareButtons title={title} />
                </div>
                <div
                    className="prose prose-invert prose-lg max-w-4xl mx-auto prose-headings:font-serif prose-a:text-accent prose-img:rounded-2xl"
                    dir={isAr ? "rtl" : "ltr"}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </article>

            {/* CTA / Footer */}
            <div className="container mx-auto px-4 py-16 border-t border-border">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <h3 className="text-2xl font-bold">
                        {isAr ? "استمتعت بهذا المقال؟" : "Enjoyed this article?"}
                    </h3>
                    <p className="text-muted-foreground">
                        {isAr
                            ? "انضم إلى نشرتنا الإخبارية للحصول على المزيد من الأفكار والموارد."
                            : "Subscribe to our newsletter for more insights and resources."}
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/${locale}/blog`}>
                                {isAr ? "اقرأ المزيد" : "Read More Articles"}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
