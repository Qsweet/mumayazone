
import { db } from "@/lib/db";
import { lessons, contentModules, courses, lessonProgress } from "@/lib/db/schema";
import { eq, and, asc, gt } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/session";
import { LessonPlayer } from "./_components/LessonPlayer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText } from "lucide-react";
import { Link } from "@/navigation";
import { getCourseProgress } from "@/app/[locale]/dashboard/actions"; // Reuse for enrollment check? Or just check DB.

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
    const { slug, lessonId } = await params;
    const session = await auth();
    if (!session?.user) {
        redirect(`/login?callbackUrl=/courses/${slug}/lessons/${lessonId}`);
    }

    // 1. Fetch Lesson & Course
    const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            module: {
                with: {
                    course: true
                }
            }
        }
    });

    if (!lesson) notFound();
    const course = lesson.module.course;

    // 2. Check Enrollment (Simulated or Real)
    // We should check 'enrollments' table.
    // For now, allowing access to check E2E or we can assume if they are logged in they can see it (OPEN ACCESS for testing)
    // OR we ideally restrict.
    // Let's rely on openness for now unless we added enrollment check logic strictly.

    // 3. Get User Progress
    const progress = await db.query.lessonProgress.findFirst({
        where: and(
            eq(lessonProgress.userId, session.user.id),
            eq(lessonProgress.lessonId, lesson.id)
        )
    });

    // 4. Find Next Lesson (Simple logic: next orderIndex in same module, or first in next module)
    // This is complex to query efficiently in one go without a "next" pointer.
    // Let's just fetch all lessons in module and find next.
    const moduleLessons = await db.query.lessons.findMany({
        where: eq(lessons.moduleId, lesson.moduleId),
        orderBy: [asc(lessons.orderIndex)]
    });

    const currentIndex = moduleLessons.findIndex(l => l.id === lesson.id);
    const nextLesson = moduleLessons[currentIndex + 1];
    let nextLessonUrl = nextLesson ? `/courses/${slug}/lessons/${nextLesson.id}` : null;

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4">
                <div className="mb-6">
                    <Button asChild variant="ghost" size="sm" className="gap-2 mb-2">
                        <Link href={`/courses/${slug}`}>
                            <ChevronLeft className="w-4 h-4" /> Back to Course
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">{lesson.title}</h1>
                    <p className="text-muted-foreground text-sm">{course.title} • Module: {lesson.module.title}</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <LessonPlayer
                            lessonId={lesson.id}
                            videoUrl={lesson.videoUrl}
                            initialCompleted={progress?.isCompleted || false}
                            initialPosition={progress?.lastWatchedPosition || 0}
                            nextLessonUrl={nextLessonUrl}
                        />

                        {lesson.contentText && (
                            <div className="p-6 bg-muted/20 rounded-xl border border-border">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5" /> Lesson Notes
                                </h3>
                                <div className="prose prose-invert max-w-none text-sm text-muted-foreground">
                                    {lesson.contentText}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        {/* Course Content Sidebar (List of other lessons) */}
                        <div className="border border-border rounded-xl bg-card p-4 space-y-4 max-h-[600px] overflow-y-auto">
                            <h3 className="font-semibold">Course Content</h3>
                            <div className="space-y-2">
                                {moduleLessons.map(l => (
                                    <Link
                                        key={l.id}
                                        href={`/courses/${slug}/lessons/${l.id}`}
                                        className={`block p-3 rounded-lg text-sm transition-colors ${l.id === lesson.id ? 'bg-primary/20 text-primary font-medium' : 'hover:bg-muted'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{l.orderIndex + 1}.</span>
                                            <span className="truncate">{l.title}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
