import { db } from "@/lib/db";
import { courses, contentModules, lessons } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Save, LayoutList, Video, Plus, Trash2 } from "lucide-react";
import CurriculumEditor from "./_components/CurriculumEditor";
import EditCourseForm from "./_components/EditCourseForm";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        courseId: string;
    }>
}

export default async function EditCoursePage({ params }: PageProps) {
    const { courseId } = await params;
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
        with: {
            modules: {
                with: {
                    lessons: {
                        orderBy: [asc(lessons.orderIndex)],
                    }
                },
                orderBy: [asc(contentModules.orderIndex)],
            }
        }
    });

    if (!course) {
        notFound();
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-4">
                <Link href="/admin/courses" className="p-2 rounded-full hover:bg-white/5 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Edit Course</h1>
                    <div className="text-sm text-muted-foreground">ID: {course.id}</div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Settings Form */}
                <div className="lg:col-span-2 space-y-8">
                    <EditCourseForm course={course} />

                    {/* V2 Curriculum Editor */}
                    <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-6">
                        <CurriculumEditor courseId={course.id} modules={course.modules} />
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-6">
                        <h3 className="font-bold mb-4">Course Assets</h3>
                        <div className="aspect-video bg-white/5 rounded-lg border border-white/10 flex items-center justify-center mb-4 overflow-hidden relative group">
                            {course.coverImageUrl ? (
                                <img src={course.coverImageUrl} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <span className="text-xs text-muted-foreground">No Cover Image</span>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Button size="sm" variant="secondary">Change</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
