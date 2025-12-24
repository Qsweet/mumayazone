import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Clock, Star, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
    const allCourses = await db.query.courses.findMany({
        orderBy: [desc(courses.createdAt)],
    });

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl text-foreground">
                        Professional Training Programs
                    </h1>
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        Master new skills with our comprehensive, industry-focused courses designed for the modern professional.
                    </p>
                </div>

                {allCourses.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {allCourses.map((course) => (
                            <div
                                key={course.id}
                                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-accent/50 hover:shadow-lg"
                            >
                                <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-accent/10 transition-colors group-hover:from-primary/30 group-hover:to-accent/20" />

                                <div className="flex flex-1 flex-col p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                                            {course.level}
                                        </span>
                                        <span className="flex items-center text-sm text-yellow-500">
                                            <Star className="mr-1 h-3 w-3 fill-current" />
                                            4.9
                                        </span>
                                    </div>

                                    <h3 className="mb-2 text-xl font-bold leading-tight text-foreground group-hover:text-accent transition-colors">
                                        {course.title}
                                    </h3>

                                    <p className="mb-6 line-clamp-2 text-sm text-muted-foreground flex-1">
                                        {course.description}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
                                        <div className="flex items-center">
                                            <Clock className="mr-1.5 h-4 w-4" />
                                            {course.duration}
                                        </div>
                                        <div className="font-semibold text-foreground">
                                            {course.price ? `$${(course.price / 100).toFixed(2)}` : "Free"}
                                        </div>
                                    </div>

                                    <Link href={`/courses/${course.slug}`} className="absolute inset-0 z-10">
                                        <span className="sr-only">View course</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 py-32 text-center">
                        <div className="mb-4 rounded-full bg-accent/10 p-4 text-accent">
                            <Star className="h-8 w-8" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold">New Courses Launching Soon</h3>
                        <p className="max-w-md text-muted-foreground">
                            We are currently finalizing our 2025 curriculum. Join the waitlist to get notified when enrollment opens.
                        </p>
                        <Button className="mt-8 rounded-full" variant="outline">
                            Join Waitlist
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
