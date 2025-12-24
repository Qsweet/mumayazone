
"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit2, GripVertical, Video, FileText } from "lucide-react";
import { createModule, deleteModule, createLesson, updateLesson, deleteLesson } from "../actions";
import { FileUpload } from "@/components/ui/file-upload";

interface Lesson {
    id: string;
    title: string;
    videoUrl?: string | null;
    contentText?: string | null;
    orderIndex: number;
}

interface Module {
    id: string;
    title: string;
    orderIndex: number;
    lessons: Lesson[];
}

interface CurriculumEditorProps {
    courseId: string;
    modules: Module[];
}

export default function CurriculumEditor({ courseId, modules }: CurriculumEditorProps) {
    const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

    // Handlers
    const handleAddModule = async (formData: FormData) => {
        const title = formData.get("title") as string;
        await createModule(courseId, title);
        setIsAddModuleOpen(false);
    };

    const handleAddLesson = async (moduleId: string) => {
        // For speed, we just add "New Lesson" directly then edit
        // Or we could prompt. Let's precise "New Lesson"
        await createLesson(moduleId, "New Lesson", courseId);
    };

    const handleSaveLesson = async (formData: FormData) => {
        if (!editingLesson) return;
        const title = formData.get("title") as string;
        const videoUrl = formData.get("videoUrl") as string;
        const contentText = formData.get("contentText") as string;

        await updateLesson(editingLesson.id, { title, videoUrl, contentText }, courseId);
        setEditingLesson(null);
    };

    // State for controlled inputs in dialog
    const [videoUrl, setVideoUrl] = useState("");

    // Update state when opening dialog
    const handleEditClick = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setVideoUrl(lesson.videoUrl || "");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Video className="w-5 h-5 text-accent" />
                    Curriculum Builder
                </h3>
                <Button onClick={() => setIsAddModuleOpen(true)} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" /> Add Module
                </Button>
            </div>

            <Accordion type="multiple" className="space-y-4">
                {modules.map((module) => (
                    <AccordionItem key={module.id} value={module.id} className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
                        <AccordionTrigger className="px-4 py-3 hover:bg-white/5 hover:no-underline">
                            <div className="flex items-center gap-4 flex-1 text-left">
                                <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                                <span className="font-bold">{module.title}</span>
                                <span className="text-xs text-muted-foreground ml-auto mr-4">{module.lessons.length} Lessons</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-black/20 p-4 space-y-3">
                            <div className="flex justify-end gap-2 mb-2">
                                <Button variant="destructive" size="sm" onClick={() => deleteModule(module.id, courseId)}>
                                    <Trash2 className="w-3 h-3 mr-2" /> Delete Module
                                </Button>
                                <Button variant="secondary" size="sm" onClick={() => handleAddLesson(module.id)}>
                                    <Plus className="w-3 h-3 mr-2" /> Add Lesson
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {module.lessons.map((lesson) => (
                                    <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 group">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-4 h-4 text-blue-400" />
                                            <span className="font-medium text-sm">{lesson.title}</span>
                                            {lesson.videoUrl && <Video className="w-3 h-3 text-green-400" />}
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEditClick(lesson)}>
                                                <Edit2 className="w-3 h-3" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400" onClick={() => deleteLesson(lesson.id, courseId)}>
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {module.lessons.length === 0 && (
                                    <p className="text-center text-xs text-muted-foreground py-4">No lessons yet.</p>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {/* Add Module Dialog */}
            <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Module</DialogTitle>
                    </DialogHeader>
                    <form action={handleAddModule} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Module Title</Label>
                            <Input name="title" placeholder="e.g. Introduction to AI" required />
                        </div>
                        <Button type="submit" className="w-full">Create Module</Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Lesson Dialog */}
            <Dialog open={!!editingLesson} onOpenChange={(open) => !open && setEditingLesson(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Lesson: {editingLesson?.title}</DialogTitle>
                    </DialogHeader>
                    <form action={handleSaveLesson} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Lesson Title</Label>
                            <Input name="title" defaultValue={editingLesson?.title} required />
                        </div>

                        <div className="space-y-4 border border-white/10 rounded-xl p-4 bg-white/5">
                            <Label>Video Content</Label>

                            <FileUpload
                                type="video"
                                accept="video/mp4,video/webm"
                                endpoint="/api/upload"
                                onUploadComplete={(url) => setVideoUrl(url)}
                                defaultValue={videoUrl}
                            />

                            <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-white/10"></div>
                                <span className="text-xs text-muted-foreground">OR EXTERNAL URL</span>
                                <div className="h-px flex-1 bg-white/10"></div>
                            </div>

                            <Input
                                name="videoUrl"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="https://vimeo.com/..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Content / Notes</Label>
                            {/* Textarea not installed? Try Input or simple textarea */}
                            <textarea name="contentText" defaultValue={editingLesson?.contentText || ""} rows={10} className="w-full bg-black/10 border border-white/10 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <Button type="submit" className="w-full">Save Changes</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
