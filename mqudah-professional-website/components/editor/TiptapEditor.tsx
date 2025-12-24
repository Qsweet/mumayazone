"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import {
    Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote, Code,
    Undo, Redo, Sparkles, Image as ImageIcon, Link as LinkIcon, Unlink, Check, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCompletion } from '@ai-sdk/react';
import { toast } from 'sonner';
import { useCallback, useState } from 'react';

interface TiptapEditorProps {
    content: string;
    onChange: (html: string) => void;
    className?: string;
}

const MenuBar = ({ editor, addImage }: { editor: any, addImage: () => void }) => {
    // AI Completion Hook
    const { complete, completion, isLoading, stop } = useCompletion({
        api: '/api/completion',
        onFinish: (_prompt: string, completion: string) => {
            editor.commands.insertContent(completion);
        },
        onError: (err: Error) => {
            toast.error("AI Generation failed: " + err.message);
        }
    });

    // Link handling moved to Popover, removing setLink to clean up


    const handleAiGenerate = () => {
        const text = editor.getText();
        const lastContext = text.slice(-500); // Send last 500 chars as context
        if (!lastContext) {
            toast.error("Write something first for the AI to complete!");
            return;
        }
        complete(lastContext);
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-1.5 p-3 border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-20">
            {/* History Controls */}
            <div className="flex items-center gap-0.5 bg-black/20 p-1 rounded-md border border-white/5">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="h-7 w-7 p-0 text-muted-foreground hover:bg-white/10"
                >
                    <Undo className="w-3.5 h-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="h-7 w-7 p-0 text-muted-foreground hover:bg-white/10"
                >
                    <Redo className="w-3.5 h-3.5" />
                </Button>
            </div>

            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* Typography */}
            <div className="flex items-center gap-0.5">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={cn("h-8 w-8 p-0 text-muted-foreground hover:bg-white/10", editor.isActive('heading', { level: 1 }) && "bg-primary/20 text-primary")}
                >
                    <Heading1 className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={cn("h-8 w-8 p-0 text-muted-foreground hover:bg-white/10", editor.isActive('heading', { level: 2 }) && "bg-primary/20 text-primary")}
                >
                    <Heading2 className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn("h-8 w-8 p-0 text-muted-foreground hover:bg-white/10", editor.isActive('bold') && "bg-primary/20 text-primary")}
                >
                    <Bold className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn("h-8 w-8 p-0 text-muted-foreground hover:bg-white/10", editor.isActive('italic') && "bg-primary/20 text-primary")}
                >
                    <Italic className="w-4 h-4" />
                </Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn("h-8 w-8 p-0 text-muted-foreground hover:bg-white/10", editor.isActive('link') && "bg-primary/20 text-primary")}
                        >
                            <LinkIcon className="w-4 h-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-3 bg-black/90 border-white/10 backdrop-blur-xl" align="start">
                        <div className="flex gap-2">
                            <Input
                                placeholder="https://example.com"
                                defaultValue={editor.getAttributes('link').href}
                                className="h-8 bg-white/5 border-white/10 text-xs"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const target = e.currentTarget;
                                        if (target.value === '') {
                                            editor.chain().focus().extendMarkRange('link').unsetLink().run()
                                        } else {
                                            editor.chain().focus().extendMarkRange('link').setLink({ href: target.value }).run()
                                        }
                                        // Close popover logic would need state, but for now user clicks away. 
                                        // To make it smoother we could add a "Set" button.
                                    }
                                }}
                            />
                            <Button size="sm" variant="secondary" className="h-8 px-2" onClick={() => {
                                editor.chain().focus().unsetLink().run()
                            }}>
                                <Unlink className="w-3 h-3" />
                            </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2">Press Enter to save, or Unlink to remove.</p>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* Lists & Structure */}
            <div className="flex items-center gap-0.5">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn("h-8 w-8 p-0 text-muted-foreground hover:bg-white/10", editor.isActive('bulletList') && "bg-primary/20 text-primary")}
                >
                    <List className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn("h-8 w-8 p-0 text-muted-foreground hover:bg-white/10", editor.isActive('orderedList') && "bg-primary/20 text-primary")}
                >
                    <ListOrdered className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={cn("h-8 w-8 p-0 text-muted-foreground hover:bg-white/10", editor.isActive('blockquote') && "bg-primary/20 text-primary")}
                >
                    <Quote className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={cn("h-8 w-8 p-0 text-muted-foreground hover:bg-white/10", editor.isActive('codeBlock') && "bg-primary/20 text-primary")}
                >
                    <Code className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={addImage}
                    className={cn("h-8 w-8 p-0 text-muted-foreground hover:bg-white/10", editor.isActive('image') && "bg-primary/20 text-primary")}
                >
                    <ImageIcon className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex-1" />

            {/* AI Action */}
            <Button
                variant="outline"
                size="sm"
                onClick={handleAiGenerate}
                disabled={isLoading}
                className={cn("h-7 gap-2 border-purple-500/30 bg-purple-500/5 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all", isLoading && "animate-pulse")}
            >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{isLoading ? "Thinking..." : "AI Autocomplete"}</span>
            </Button>
        </div>
    );
};

// Import necessary extension
// LinkExtension moved to top imports


const TiptapEditor = ({ content, onChange, className }: TiptapEditorProps) => {

    // Image Upload Handler
    const uploadImage = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const promise = fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            toast.promise(promise, {
                loading: 'Uploading image...',
                success: 'Image uploaded!',
                error: 'Failed to upload image.',
            });

            const res = await promise;
            const data = await res.json();

            if (data.url) {
                return data.url;
            } else {
                throw new Error("No URL returned");
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const addImage = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
            if (input.files?.length) {
                const file = input.files[0];
                const url = await uploadImage(file);
                if (url && editor) {
                    editor.chain().focus().setImage({ src: url }).run();
                }
            }
        };
        input.click();
    }, []); // eslint-disable-next-line react-hooks/exhaustive-deps


    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,

            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                }
            }),


            Placeholder.configure({
                placeholder: 'Start writing your story... Use AI to autocomplete.',
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:h-0 before:pointer-events-none',
            }),
            ImageExtension.configure({
                inline: false, // Force block-level images
                allowBase64: false,
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert focus:outline-none max-w-none min-h-[500px] p-8 selection:bg-primary/30',
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                        event.preventDefault(); // Prevent default drop behavior
                        uploadImage(file).then(url => {
                            if (url) {
                                const { schema } = view.state;
                                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                                if (coordinates) {
                                    const node = schema.nodes.image.create({ src: url });
                                    const tr = view.state.tr.insert(coordinates.pos, node);
                                    view.dispatch(tr);
                                }
                            }
                        });
                        return true; // Handled
                    }
                }
                return false;
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return <div className="h-[500px] w-full bg-white/5 animate-pulse rounded-xl" />;
    }

    return (
        <div className={cn("relative w-full border border-white/10 rounded-xl bg-black/20 focus-within:ring-1 focus-within:ring-primary/50 transition-all overflow-hidden shadow-2xl shadow-black/50", className)}>
            <MenuBar editor={editor} addImage={addImage} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default TiptapEditor;
