
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
    const posts = await db.query.blogPosts.findMany({
        orderBy: [desc(blogPosts.createdAt)],
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-serif">Blog Management</h1>
                    <p className="text-muted-foreground">Manage your articles and insights.</p>
                </div>
                <Link href="/admin/blog/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" /> New Post
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {posts.length === 0 ? (
                    <div className="p-8 text-center border border-white/10 rounded-xl bg-white/5">
                        <p className="text-muted-foreground">No posts found. Start writing!</p>
                    </div>
                ) : (
                    posts.map((post: any) => (
                        <div key={post.id} className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-black/20 rounded-lg">
                                    <FileText className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{post.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span className={post.isPublished ? "text-green-400 px-2 py-0.5 bg-green-400/10 rounded-full" : "text-yellow-400 px-2 py-0.5 bg-yellow-400/10 rounded-full"}>
                                            {post.isPublished ? "Published" : "Draft"}
                                        </span>
                                        <span>• {new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <Link href={`/admin/blog/${post.id}`}>
                                <Button variant="ghost" size="sm">
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
