"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Trash2, Save, Loader2 } from "lucide-react";
import { Link } from "@/navigation";
import { useState } from "react";
import { updateWorkshop, deleteWorkshop } from "../actions";
import { format } from "date-fns";
import { useRouter } from "@/navigation";
import TiptapEditor from "@/components/editor/TiptapEditor";

interface Workshop {
    id: string;
    title: string;
    description: string;
    startTime: Date;
    durationMinutes: number;
    price: number;
    isFree: boolean | null;
    isPublished: boolean | null;
}

export default function EditWorkshopForm({ workshop }: { workshop: Workshop }) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [description, setDescription] = useState(workshop.description || "");

    // Format date/time for inputs
    const date = format(new Date(workshop.startTime), "yyyy-MM-dd");
    const time = format(new Date(workshop.startTime), "HH:mm");

    const handleUpdate = async (formData: FormData) => {
        setIsSaving(true);
        // FORCE override description with rich text content
        formData.set("description", description);

        await updateWorkshop(workshop.id, formData);
        setIsSaving(false);
        router.refresh();
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this workshop?")) {
            setIsDeleting(true);
            await deleteWorkshop(workshop.id);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <Link href="/admin/workshops" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Workshops
            </Link>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-serif text-white">Edit Workshop</h1>
                    <p className="text-muted-foreground">Manage event details and visibility.</p>
                </div>
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <form action={handleUpdate} id="workshop-form" className="space-y-6 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-white">Event Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={workshop.title}
                                    required
                                    className="bg-white/5 border-white/10 text-white text-lg font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white">Description</Label>
                                <div className="border border-white/10 rounded-xl overflow-hidden min-h-[400px]">
                                    <TiptapEditor
                                        content={description}
                                        onChange={setDescription}
                                        className="min-h-[400px]"
                                    />
                                </div>
                                {/* Hidden input to ensure form logic works if JS fails (though Tiptap is JS only) */}
                                <textarea name="description" value={description} hidden readOnly />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-white/10 bg-black/20 p-6 space-y-6 sticky top-8">
                        <h3 className="font-bold text-lg">Event Settings</h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-white">Date</Label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    defaultValue={date}
                                    required
                                    form="workshop-form"
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time" className="text-white">Time (UTC)</Label>
                                <Input
                                    id="time"
                                    name="time"
                                    type="time"
                                    defaultValue={time}
                                    required
                                    form="workshop-form"
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="duration" className="text-white">Duration (Min)</Label>
                                    <Input
                                        id="duration"
                                        name="duration"
                                        type="number"
                                        defaultValue={workshop.durationMinutes}
                                        form="workshop-form"
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-white">Price (USD)</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        defaultValue={workshop.price / 100}
                                        form="workshop-form"
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isFree"
                                    id="isFree"
                                    defaultChecked={workshop.isFree || false}
                                    form="workshop-form"
                                    className="w-4 h-4 rounded bg-white/5 border-white/10"
                                />
                                <Label htmlFor="isFree" className="text-sm cursor-pointer">This is a free event</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isPublished"
                                    id="isPublished"
                                    defaultChecked={workshop.isPublished || false}
                                    form="workshop-form"
                                    className="w-4 h-4 rounded bg-white/5 border-white/10"
                                />
                                <Label htmlFor="isPublished" className="text-sm cursor-pointer text-green-400 font-bold">Publish to Live Site</Label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSaving}
                            form="workshop-form"
                            className="w-full bg-green-600 hover:bg-green-700 gap-2 font-bold"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
