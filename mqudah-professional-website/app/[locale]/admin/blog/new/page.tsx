
"use client";

import { createBlogPost } from "../[postId]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "@/navigation";
import Link from "next/link";
import { useState } from "react";

export default function NewPostPage() {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsCreating(true);
        try {
            const newId = await createBlogPost(formData);
            if (newId) {
                router.push(`/admin/blog/${newId}`);
            }
        } catch (error) {
            console.error("Failed to create post", error);
            setIsCreating(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 space-y-8">
            <Link href="/admin/blog" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-8">
                <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold font-serif">Create New Post</h1>
                <p className="text-muted-foreground">Start an insightful article.</p>
            </div>

            <form action={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 rounded-xl p-8">
                <div className="space-y-2">
                    <Label htmlFor="title">Post Title</Label>
                    <Input id="title" name="title" placeholder="e.g. The Future of Digital Marketing" className="bg-black/20 font-bold text-lg" required autoFocus />
                </div>

                <div className="pt-4">
                    <Button type="submit" disabled={isCreating} className="w-full gap-2">
                        {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Create Draft & Open Editor
                    </Button>
                </div>
            </form>
        </div>
    );
}
