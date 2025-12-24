
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditPostForm from "./_components/EditPostForm";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        postId: string;
    }>
}

export default async function EditPostPage({ params }: PageProps) {
    const { postId } = await params;

    const post = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.id, postId),
    });

    if (!post) {
        notFound();
    }

    return <EditPostForm post={post} />;
}
