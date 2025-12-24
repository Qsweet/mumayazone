
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, BookOpen, ArrowRight } from "lucide-react";

export async function CourseGrid() {
    const latestCourses = await db.query.courses.findMany({
        where: eq(courses.isPublished, true),
        orderBy: [desc(courses.createdAt)],
        limit: 3,
    });

    if (latestCourses.length === 0) {
        return (
            <div className="text-center py-10 opacity-70">
                <p>New courses coming soon...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestCourses.map((course: any) => (
                <div key={course.id} className="relative group">
                    {/* Glassmorphism Card */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl transition-opacity opacity-0 group-hover:opacity-100" />
                    <Card className="relative h-full bg-white/5 border-white/10 backdrop-blur-md overflow-hidden hover:border-white/20 transition-all duration-300">
                        <div className="h-48 relative bg-gray-900">
                            {/* Placeholder if no image */}
                            {course.coverImageUrl ? (
                                <img
                                    src={course.coverImageUrl}
                                    alt={course.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
                                    <BookOpen className="w-10 h-10 text-white/20" />
                                </div>
                            )}
                            <Badge className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-xs">
                                {course.level || "Beginner"}
                            </Badge>
                        </div>

                        <CardHeader className="pb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors line-clamp-2">
                                {course.title}
                            </h3>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground line-clamp-3 h-[60px]">
                                {course.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{course.duration || "Unknown"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    <span>Online</span>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button asChild className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/5">
                                <Link href={`/courses/${course.slug}`}>
                                    View Course <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            ))}
        </div>
    );
}
