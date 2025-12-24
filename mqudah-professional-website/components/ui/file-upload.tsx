"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, X, FileVideo, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";

interface FileUploadProps {
    onUploadComplete: (url: string) => void;
    endpoint?: string;
    accept?: string;
    maxSizeMB?: number; // Default 500MB
    type?: "video" | "material" | "general";
    defaultValue?: string;
    className?: string;
}

export function FileUpload({
    onUploadComplete,
    endpoint = "/api/upload",
    accept = "video/*",
    maxSizeMB = 500,
    type = "general",
    defaultValue,
    className
}: FileUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(defaultValue || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`File too large. Max size is ${maxSizeMB}MB.`);
            return;
        }

        setCurrentFile(file);
        setIsUploading(true);
        setProgress(0);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        try {
            const response = await axios.post(endpoint, formData, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percent);
                    }
                }
            });

            if (response.data.success) {
                setPreviewUrl(response.data.url);
                onUploadComplete(response.data.url);
                toast.success("Upload complete!");
            } else {
                toast.error("Upload failed server-side.");
            }

        } catch (error) {
            console.error(error);
            toast.error("Upload failed. Please try again.");
            setCurrentFile(null);
        } finally {
            setIsUploading(false);
        }
    };

    const clearFile = () => {
        setCurrentFile(null);
        setPreviewUrl(null);
        onUploadComplete("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className={cn("w-full space-y-4", className)}>
            <input
                type="file"
                ref={fileInputRef}
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
            />

            {!previewUrl && !isUploading && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 hover:border-blue-400/50 transition-colors group"
                >
                    <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="font-medium">
                        Drag & drop or <span className="text-blue-400">browse</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Max size: {maxSizeMB}MB
                    </p>
                </div>
            )}

            {isUploading && (
                <div className="border border-white/10 rounded-xl p-6 bg-white/5 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                            {type === 'video' ? <FileVideo className="w-6 h-6 text-blue-400" /> : <FileText className="w-6 h-6 text-blue-400" />}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{currentFile?.name}</p>
                            <p className="text-xs text-muted-foreground">{progress}% Uploading...</p>
                        </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            )}

            {previewUrl && !isUploading && (
                <div className="border border-green-500/20 rounded-xl p-4 bg-green-500/5 flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-green-400">File Ready</p>
                        <p className="text-xs text-muted-foreground truncate">{previewUrl}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={clearFile} className="hover:bg-red-500/10 hover:text-red-400">
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
