import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default function NewCoursePage() {

    async function createCourse(formData: FormData) {
        "use server";

        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string || title?.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        if (!title) return;

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            throw new Error("Unauthorized: No token found");
        }

        let instructorId: string;
        try {
            const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            instructorId = payload.sub || payload.userId || payload.id;
        } catch (e) {
            console.error("Failed to decode token", e);
            throw new Error("Invalid Token");
        }

        const description = formData.get("description") as string || "New course description...";
        const duration = formData.get("duration") as string || "0";
        const level = formData.get("level") as string || "beginner";
        const price = parseInt(formData.get("price") as string || "0");

        const [newCourse] = await db.insert(courses).values({
            title,
            slug,
            description,
            duration,
            level: level as "beginner" | "intermediate" | "advanced",
            price,
            isPublished: false,
            instructorId,
        }).returning();

        redirect(`/admin/courses/${newCourse.id}`);
    }

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8">
            <Link href="/admin/courses" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Courses
            </Link>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold font-serif text-white">Create New Course</h1>
                <p className="text-muted-foreground">Start by giving your course a title. You can add more details later.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-8">
                <form action={createCourse} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium text-white">Course Title</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="e.g. Advanced AI Strategies"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="slug" className="text-sm font-medium text-white">Slug (Optional)</label>
                        <input
                            type="text"
                            name="slug"
                            id="slug"
                            placeholder="e.g. advanced-ai-strategies"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50"
                        />
                        <p className="text-xs text-muted-foreground">URL friendly name. Leave empty to auto-generate from title.</p>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-4">
                        <Link href="/admin/courses">
                            <Button variant="ghost" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit" className="rounded-full bg-primary hover:bg-primary/90 min-w-[120px]">
                            Create Course
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
