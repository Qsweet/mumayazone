"use client";

import { useEffect, useRef, useState } from "react";
import { updateLessonProgress } from "@/app/[locale]/dashboard/actions";
import { Button } from "@/components/ui/button";
import { CheckCircle, Play } from "lucide-react";
import { toast } from "sonner";

interface LessonPlayerProps {
    lessonId: string;
    videoUrl?: string | null;
    initialCompleted?: boolean;
    initialPosition?: number;
    nextLessonUrl?: string | null;
}

export function LessonPlayer({
    lessonId,
    videoUrl,
    initialCompleted = false,
    initialPosition = 0,
    nextLessonUrl
}: LessonPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCompleted, setIsCompleted] = useState(initialCompleted);
    const [progressSaved, setProgressSaved] = useState(false);

    // Save progress periodically (every 30 seconds or on pause)
    const saveProgress = async (completed: boolean = false) => {
        if (!videoRef.current) return;

        const currentTime = Math.floor(videoRef.current.currentTime);
        try {
            await updateLessonProgress(lessonId, completed, currentTime);
            if (completed) {
                setIsCompleted(true);
                toast.success("Lesson Completed!");
            }
        } catch (error) {
            console.error("Failed to save progress", error);
        }
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        // Auto-complete at 90%
        const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        if (!isCompleted && percent > 90) {
            saveProgress(true);
        }
    };

    const handleEnded = () => {
        saveProgress(true);
    };

    useEffect(() => {
        // Set initial position
        if (videoRef.current && initialPosition > 0) {
            videoRef.current.currentTime = initialPosition;
        }
    }, [initialPosition]);

    // Handle "external" video URLs (e.g. Vimeo/YouTube) vs "uploaded" (mp4)
    // For now, assuming uploaded/direct MP4 links from our new upload feature
    // If it's a raw URL that isn't a file, we might need an iframe.
    const isDirectFile = videoUrl?.match(/\.(mp4|webm|ogg)$/i) || videoUrl?.startsWith("/uploads");

    if (!videoUrl) {
        return (
            <div className="aspect-video bg-black/80 flex items-center justify-center rounded-xl border border-white/10">
                <div className="text-center p-6">
                    <p className="text-muted-foreground mb-4">No video content for this lesson.</p>
                    <Button onClick={() => saveProgress(true)} disabled={isCompleted}>
                        {isCompleted ? <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Completed</span> : "Mark as Complete"}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                {isDirectFile ? (
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        controls
                        className="w-full h-full"
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleEnded}
                        onPause={() => saveProgress(isCompleted)}
                    />
                ) : (
                    // Fallback for generic URLs (iframe or link)
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                        <div className="text-center">
                            <p className="mb-4 text-sm text-muted-foreground">External Video Link</p>
                            <Button asChild variant="secondary">
                                <a href={videoUrl} target="_blank" rel="noopener noreferrer" onClick={() => saveProgress(true)}>
                                    Open Video <Play className="w-4 h-4 ml-2" />
                                </a>
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                    {isCompleted ? (
                        <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                            <CheckCircle className="w-5 h-5" />
                            <span>Completed</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="text-sm text-muted-foreground">In Progress</div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-white/10 hover:bg-white/10"
                                onClick={() => saveProgress(true)}
                            >
                                <CheckCircle className="w-3 h-3 mr-2" />
                                Mark as Complete
                            </Button>
                        </div>
                    )}
                </div>
                {nextLessonUrl && (
                    <Button asChild>
                        <a href={nextLessonUrl}>Next Lesson</a>
                    </Button>
                )}
            </div>
        </div>
    );
}
