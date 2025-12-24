
"use client";

import { useState } from "react";
import TiptapEditor from "@/components/editor/TiptapEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { updateBlogPost } from "../actions";
import { Save, Loader2, ArrowLeft, Sparkles, Bot, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateSeoMetadata } from "@/lib/actions/ai-seo";

interface EditPostFormProps {
    post: {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        isPublished: boolean | null;
        seoTitle?: string | null;
        seoDescription?: string | null;
        tags?: string[] | null;
        readingTime?: number | null;
    }
}

export default function EditPostForm({ post }: EditPostFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Content State
    const [content, setContent] = useState(post.content);
    const [title, setTitle] = useState(post.title);
    const [isPublished, setIsPublished] = useState(post.isPublished || false);

    // SEO State
    const [seoTitle, setSeoTitle] = useState(post.seoTitle || "");
    const [seoDescription, setSeoDescription] = useState(post.seoDescription || "");
    const [tags, setTags] = useState<string[]>(post.tags || []);
    const [readingTime, setReadingTime] = useState(post.readingTime || 0);

    const handleAiGenerate = async () => {
        setIsGenerating(true);
        toast.info("ZEUS is analyzing content...");

        try {
            // Assume english for now or detect from content in the action
            const result = await generateSeoMetadata(content, 'en');

            if (result.success && result.data) {
                setSeoTitle(result.data.seoTitle);
                setSeoDescription(result.data.seoDescription);
                setTags(result.data.tags);
                toast.success("SEO Metadata Generated!");
            } else {
                toast.error("AI Generation Failed");
            }
        } catch (e) {
            toast.error("Error communicating with ZEUS");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (formData: FormData) => {
        setIsSaving(true);


        // FORCE overrides
        formData.set("content", content);
        formData.set("isPublished", isPublished ? "true" : "false");

        // SEO Fields
        formData.set("seoTitle", seoTitle);
        formData.set("seoDescription", seoDescription);
        formData.set("tags", JSON.stringify(tags));
        formData.set("readingTime", readingTime.toString());

        try {
            await updateBlogPost(post.id, formData);
            toast.success("Post updated!");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to update post");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-8 max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b border-white/5 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="p-2 rounded-full hover:bg-white/5 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            Edit Post
                        </h1>
                        <p className="text-sm text-muted-foreground hidden md:block">{post.title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={isSaving} className="bg-green-600 hover:bg-green-700 gap-2 min-w-[120px]">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="content">Content Editor</TabsTrigger>
                    <TabsTrigger value="seo" className="flex gap-2">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        ZEUS SEO & AI
                    </TabsTrigger>
                </TabsList>

                {/* CONTENT TAB */}
                <TabsContent value="content" className="mt-6 space-y-6">
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-lg">Title</Label>
                                <Input
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="text-xl font-bold bg-transparent border-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground"
                                    placeholder="Enter post title..."
                                    required
                                />
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>slug:</span>
                                    <Input name="slug" defaultValue={post.slug} className="h-6 w-[300px] text-xs font-mono bg-white/5 border-white/10" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Content</Label>
                                <div className="border border-white/10 rounded-xl overflow-hidden min-h-[500px]">
                                    <TiptapEditor
                                        content={content || ''}
                                        onChange={(html) => setContent(html)}
                                        className="min-h-[500px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Settings */}
                        <div className="space-y-6">
                            <Card className="bg-black/20 border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-sm">Publishing</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="pub-check">Published</Label>
                                        <Switch
                                            id="pub-check"
                                            checked={isPublished}
                                            onCheckedChange={setIsPublished}
                                            className="data-[state=checked]:bg-green-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Excerpt</Label>
                                        <Textarea name="excerpt" defaultValue={post.excerpt || ""} placeholder="Short summary..." rows={4} className="bg-white/5 border-white/10 text-sm" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* SEO TAB (ZEUS) */}
                <TabsContent value="seo" className="mt-6">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* INPUTS */}
                        <div className="space-y-6">
                            <Card className="bg-muted/10 border-white/10">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Bot className="w-5 h-5 text-purple-400" />
                                            AI Assistant
                                        </CardTitle>
                                        <CardDescription>Generate optimized metadata with ZEUS.</CardDescription>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={handleAiGenerate}
                                        disabled={isGenerating || !content}
                                        variant="outline"
                                        className="border-purple-500/50 hover:bg-purple-500/10 text-purple-400"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4 mr-2" /> Generate SEO
                                            </>
                                        )}
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <Label>SEO Title</Label>
                                            <span className={cn("text-xs", seoTitle.length > 60 ? "text-red-400" : "text-muted-foreground")}>
                                                {seoTitle.length}/60
                                            </span>
                                        </div>
                                        <Input
                                            value={seoTitle}
                                            onChange={(e) => setSeoTitle(e.target.value)}
                                            placeholder="Optimized title..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <Label>SEO Description</Label>
                                            <span className={cn("text-xs", seoDescription.length > 160 ? "text-red-400" : "text-muted-foreground")}>
                                                {seoDescription.length}/160
                                            </span>
                                        </div>
                                        <Textarea
                                            value={seoDescription}
                                            onChange={(e) => setSeoDescription(e.target.value)}
                                            placeholder="Meta description..."
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tags (Keywords)</Label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {tags.map((tag, i) => (
                                                <Badge key={i} variant="secondary" className="px-2 py-1 gap-1">
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                                                        className="ml-1 hover:text-red-400"
                                                    >
                                                        ×
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                        <Input
                                            placeholder="Add tag and press Enter..."
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = e.currentTarget.value.trim();
                                                    if (val) {
                                                        setTags([...tags, val]);
                                                        e.currentTarget.value = "";
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* PREVIEW */}
                        <div className="space-y-6">
                            <Card className="bg-white dark:bg-[#1a1c20] border-border text-left">
                                <CardHeader>
                                    <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        Google Search Preview (Draft)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="font-sans">
                                        <div className="flex items-center gap-2 text-sm text-[#dadce0] mb-1">
                                            <div className="bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center text-xs">Fav</div>
                                            <div className="flex flex-col">
                                                <span className="text-[#dadce0]">mumayazone.com</span>
                                                <span className="text-[#9aa0a6] text-xs">https://mumayazone.com › blog › {post.slug}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl text-[#8ab4f8] hover:underline cursor-pointer truncate font-medium">
                                            {seoTitle || title || "Your Page Title"}
                                        </h3>
                                        <p className="text-sm text-[#bdc1c6] mt-1 line-clamp-2">
                                            {seoDescription || "Please provide a meta description for search engines to understand clearly what your page content is about..."}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 text-sm">
                                <strong>ZEUS Tip:</strong> Keep titles under 60 characters and descriptions under 160 characters for best visibility.
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Hidden Inputs */}
            <input type="hidden" name="isPublished" value={String(isPublished)} />
            <textarea name="content" value={content} hidden readOnly />
        </form>
    );
}
