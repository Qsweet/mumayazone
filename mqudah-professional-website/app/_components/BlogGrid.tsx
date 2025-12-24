
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import { format } from "date-fns";

export async function BlogGrid() {
    // Fetch posts with relations
    const latestPosts = await db.query.blogPosts.findMany({
        where: eq(blogPosts.isPublished, true),
        orderBy: [desc(blogPosts.createdAt)],
        limit: 3,
        with: {
            author: true,
            category: true
        }
    });

    if (latestPosts.length === 0) {
        return (
            <div className="text-center py-10 opacity-70">
                <p>New insights coming soon...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post: any) => (
                <div key={post.id} className="relative group h-full">
                    {/* Glassmorphism Card */}
                    <Card className="h-full bg-white/5 border-white/10 backdrop-blur-md overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col">
                        <div className="h-48 relative bg-gray-900 overflow-hidden">
                            {/* Placeholder (Schema update needed for images) */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 to-black text-white/20 font-bold text-4xl">
                                MQ
                            </div>
                            {post.category && (
                                <Badge className="absolute top-4 left-4 bg-accent text-black font-bold">
                                    {post.category.name}
                                </Badge>
                            )}
                        </div>

                        <CardHeader className="pb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors line-clamp-2">
                                {post.title}
                            </h3>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-grow">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {post.excerpt || "Read full article to learn more."}
                            </p>
                        </CardContent>

                        <CardFooter className="border-t border-white/5 pt-4 mt-auto">
                            <div className="w-full flex items-center justify-between text-xs text-gray-400">
                                <div className="flex items-center gap-2">
                                    {post.author?.image ? (
                                        <img src={post.author.image} alt="Author" className="w-6 h-6 rounded-full" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                                            <User className="w-3 h-3" />
                                        </div>
                                    )}
                                    <span>{post.author?.name || "Team MQ"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{post.createdAt ? format(new Date(post.createdAt), 'MMM d, yyyy') : 'Recent'}</span>
                                </div>
                            </div>
                        </CardFooter>

                        <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10">
                            <span className="sr-only">Read {post.title}</span>
                        </Link>
                    </Card>
                </div>
            ))}
        </div>
    );
}
