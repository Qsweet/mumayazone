"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutList, Save, Loader2 } from "lucide-react";
import TiptapEditor from "@/components/editor/TiptapEditor";
import { updateCourse } from "../actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    level: "beginner" | "intermediate" | "advanced";
    isPublished: boolean | null;
}

export default function EditCourseForm({ course }: { course: Course }) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [language, setLanguage] = useState<'en' | 'ar'>('en');

    // English State
    const [description, setDescription] = useState(course.description || "");

    const [isPublished, setIsPublished] = useState(course.isPublished || false);

    const handleSubmit = async (formData: FormData) => {
        setIsSaving(true);
        // Force override rich text
        formData.set("description", description);
        formData.set("isPublished", isPublished ? "true" : "false");

        await updateCourse(course.id, formData);

        setIsSaving(false);
        toast.success("Course settings updated!");
        router.refresh();
    };

    return (
        <form action={handleSubmit} className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-6 space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <LayoutList className="w-5 h-5 text-primary" />
                    Course Details
                </h2>

                <div className="flex items-center gap-4">
                    {/* Language Switcher */}
                    {/* Language Switcher Removed */}

                    <Button type="submit" size="sm" disabled={isSaving} className="bg-green-600 hover:bg-green-700 gap-2">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {/* ENGLISH FIELDS */}
                <div className={"space-y-4"}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <input name="title" defaultValue={course.title} required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <div className="border border-white/10 rounded-xl overflow-hidden min-h-[400px]">
                            <TiptapEditor
                                content={description}
                                onChange={setDescription}
                                className="min-h-[400px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Common Fields */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Price (USD)</label>
                        <input type="number" name="price" defaultValue={course.price / 100} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Level</label>
                        <select name="level" defaultValue={course.level} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                    <input
                        type="checkbox"
                        name="isPublished"
                        id="pub"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="w-4 h-4 rounded border-white/10 bg-white/5"
                    />
                    <label htmlFor="pub" className="text-sm font-medium cursor-pointer">Publish this course</label>
                </div>

                {/* Hidden inputs for non-JS submission safety */}
                <textarea name="description" value={description} hidden readOnly />
            </div>
        </form>
    );
}
