import { db } from "@/lib/db";
import { courses, enrollments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PlayCircle, Lock, CheckCircle, Clock, BarChart } from "lucide-react";
import { ReviewsSection } from "@/components/courses/ReviewsSection";
import { EnrollmentFormSection } from "@/components/courses/EnrollmentFormSection";

import { Link } from "@/navigation";
import { auth } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CourseDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const course = await db.query.courses.findFirst({
        where: eq(courses.slug, slug),
        with: {
            instructor: true,
            modules: {
                with: {
                    lessons: {
                        orderBy: (lessons, { asc }) => [asc(lessons.orderIndex)],
                    }
                },
                orderBy: (modules, { asc }) => [asc(modules.orderIndex)],
            }
        }
    });

    if (!course) {
        notFound();
    }

    const session = await auth();
    let isEnrolled = false;
    let firstLessonUrl: string | undefined;

    if (session?.user) {
        const enrollment = await db.query.enrollments.findFirst({
            where: and(
                eq(enrollments.courseId, course.id),
                eq(enrollments.userId, session.user.id),
                eq(enrollments.status, 'active')
            )
        });
        isEnrolled = !!enrollment;
    }

    if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
        firstLessonUrl = `/courses/${course.slug}/lessons/${course.modules[0].lessons[0].id}`;
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            {/* Hero Header */}
            <div className="relative bg-muted/20 border-y border-border">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
                <div className="container mx-auto px-4 py-16 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                                {course.level} Level
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {course.description}
                            </p>
                            <div className="flex items-center gap-6 text-sm">
                                <span className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    {course.duration}
                                </span>
                                <span className="flex items-center gap-2">
                                    <BarChart className="w-4 h-4 text-muted-foreground" />
                                    {course.modules.length} Modules
                                </span>
                            </div>
                            <div className="pt-4 flex items-center gap-4">
                                <Button size="lg" className="rounded-full px-8 text-lg">
                                    Enroll Now • {course.price > 0 ? `$${(course.price / 100).toFixed(2)}` : "Free"}
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-full px-8">
                                    Watch Preview
                                </Button>
                            </div>
                        </div>

                        {/* Course Cover / Preview */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/50 group">
                            {course.coverImageUrl ? (
                                <img
                                    src={course.coverImageUrl}
                                    alt={course.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
                                    <PlayCircle className="w-20 h-20 text-white/50 group-hover:text-white/80 transition-colors" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <PlayCircle className="w-20 h-20 text-white drop-shadow-lg cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Curriculum Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-3 gap-12">

                    <div className="lg:col-span-2 space-y-8">
                        {/* Modules Listing */}
                        <h2 className="text-3xl font-bold">Course Curriculum</h2>

                        <div className="space-y-4">
                            {course.modules.length > 0 ? course.modules.map((module, idx) => (
                                <div key={module.id} className="border border-border rounded-xl bg-card overflow-hidden">
                                    <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between">
                                        <h3 className="font-semibold text-lg flex items-center gap-3">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                                {idx + 1}
                                            </span>
                                            {module.title}
                                        </h3>
                                        <span className="text-xs text-muted-foreground">{module.lessons.length} Lessons</span>
                                    </div>
                                    <div className="divide-y divide-border/50">
                                        {module.lessons.map((lesson) => (
                                            <Link key={lesson.id} href={`/courses/${course.slug}/lessons/${lesson.id}`} className="block">
                                                <div className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors group">
                                                    <div className="flex items-center gap-3">
                                                        <PlayCircle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                        <span className="text-sm group-hover:text-primary transition-colors">{lesson.title}</span>
                                                    </div>
                                                    <PlayCircle className="w-4 h-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 text-center border border-dashed border-border rounded-xl">
                                    <p className="text-muted-foreground">Curriculum content is being updated.</p>
                                </div>
                            )}
                        </div>

                        {/* Reviews Section */}
                        <ReviewsSection />
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <EnrollmentFormSection
                                courseId={course.id}
                                price={course.price}
                                title={course.title}
                                isEnrolled={isEnrolled}
                                firstLessonUrl={firstLessonUrl}
                            />

                            <div className="p-6 rounded-2xl border border-border bg-card">
                                <h3 className="font-bold mb-4">Instructor</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                                        <span className="text-xl font-bold text-muted-foreground">MQ</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold">{course.instructor?.name || "Mohammad Al-Qudah"}</div>
                                        <div className="text-xs text-muted-foreground">Senior Instructor</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
