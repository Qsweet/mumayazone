
import { getResumeCourse, getEnrolledCourses } from "./actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/navigation";
import { PlayCircle, BookOpen, Clock, Award } from "lucide-react";
import Image from "next/image";

export default async function DashboardPage() {
    const resumeData = await getResumeCourse();
    const enrolledCourses = await getEnrolledCourses();

    return (
        <div className="container py-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Pick up where you left off.</p>
            </div>

            {/* Resume Learning Section */}
            {resumeData && (
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-accent" />
                        Resume Learning
                    </h2>
                    <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-white/10 overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-6 p-6">
                            <div className="relative w-full md:w-64 h-40 rounded-lg overflow-hidden shrink-0">
                                {resumeData.course.coverImageUrl ? (
                                    <Image
                                        src={resumeData.course.coverImageUrl}
                                        alt={resumeData.course.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white/10 flex items-center justify-center">
                                        <BookOpen className="w-10 h-10 text-white/30" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group cursor-pointer">
                                    <Link href={`/courses/${resumeData.course.slug}/lessons/${resumeData.lesson.id}`}>
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
                                            <PlayCircle className="w-6 h-6 text-white ml-0.5" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center gap-2 flex-1">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold">{resumeData.course.title}</h3>
                                    <p className="text-sm text-gray-300">
                                        Current Lesson: <span className="text-white font-medium">{resumeData.lesson.title}</span>
                                    </p>
                                </div>
                                <div className="space-y-2 max-w-md">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Progress</span>
                                        <span>{resumeData.progress.isCompleted ? "Completed" : "In Progress"}</span>
                                    </div>
                                    {/* Use our progress component? Or simple div? Assuming Progress is installed */}
                                    <Progress value={resumeData.progress.isCompleted ? 100 : 50} className="h-1.5" />
                                    {/* Note: lastWatchedPosition isn't percentage. We'd need total duration. defaulting to 50 for in-progress. */}
                                </div>
                                <div className="pt-2">
                                    <Button asChild size="sm" className="gap-2">
                                        <Link href={`/courses/${resumeData.course.slug}/lessons/${resumeData.lesson.id}`}>
                                            Continue Lesson <PlayCircle className="w-3 h-3" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>
            )}

            {/* Enrolled Courses */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-accent" />
                    Enrolled Courses
                </h2>

                {enrolledCourses.length === 0 ? (
                    <Card className="border-dashed border-white/20 bg-transparent">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No courses yet</h3>
                            <p className="text-sm text-muted-foreground mb-6">Explore our catalog and start learning today.</p>
                            <Button asChild variant="secondary">
                                <Link href="/courses">Browse Courses</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map((course) => (
                            <Card key={course.id} className="bg-white/5 border-white/10 hover:border-white/20 transition-colors flex flex-col">
                                <div className="relative h-40 w-full bg-black/20">
                                    {course.coverImageUrl ? (
                                        <Image src={course.coverImageUrl} alt={course.title} fill className="object-cover rounded-t-xl" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <BookOpen className="w-8 h-8 text-white/20" />
                                        </div>
                                    )}
                                </div>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 flex-1">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span>{course.progress.percent}% Completed</span>
                                            <span>{course.progress.completed}/{course.progress.total} Lessons</span>
                                        </div>
                                        <Progress value={course.progress.percent} className="h-1.5" />
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Button asChild className="w-full" variant={course.progress.percent === 100 ? "outline" : "default"}>
                                        <Link href={`/courses/${course.slug}`}>
                                            {course.progress.percent === 0 ? "Start Course" : course.progress.percent === 100 ? "Review Course" : "Continue"}
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
