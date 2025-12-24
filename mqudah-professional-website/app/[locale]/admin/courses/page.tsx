import Image from "next/image";
import { getAllCourses } from "@/lib/data/courses";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { Plus, Search, MoreVertical, Edit, Trash, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
    const allCourses = await getAllCourses();

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-serif text-white">Courses</h1>
                    <p className="text-muted-foreground mt-1">Manage your training programs and curriculum.</p>
                </div>
                <Link href="/admin/courses/new">
                    <Button className="rounded-full bg-primary hover:bg-primary/90 gap-2">
                        <Plus className="w-4 h-4" />
                        Create Course
                    </Button>
                </Link>
            </div>

            {/* Filters Bar (Placeholder for future interactivity) */}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent/50"
                    />
                </div>
            </div>

            {/* Courses Table */}
            <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-xs uppercase text-muted-foreground font-semibold">
                        <tr>
                            <th className="px-6 py-4">Course</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Last Updated</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {allCourses.map((course) => (
                            <tr key={course.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-16 rounded-lg bg-white/5 overflow-hidden relative">
                                            {course.coverImageUrl && (
                                                <Image
                                                    src={course.coverImageUrl}
                                                    fill
                                                    className="object-cover"
                                                    alt={course.title || "Course"}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white group-hover:text-accent transition-colors">{course.title}</div>
                                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">{course.slug}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {course.price ? `$${(course.price / 100).toFixed(2)}` : <span className="text-green-400">Free</span>}
                                </td>
                                <td className="px-6 py-4">
                                    {course.isPublished ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-400 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                            Published
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                            Draft
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                    {course.updatedAt ? format(new Date(course.updatedAt), "MMM d, yyyy") : "-"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/courses/${course.id}`}>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-white" aria-label={`Edit ${course.title || 'course'}`}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-white" aria-label={course.isPublished ? "Published" : "Draft"}>
                                            {course.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {allCourses.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground">
                        No courses found. Create your first course to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
