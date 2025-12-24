
"use client";

export default function RichTextEditor({ content, onChange }: { content: string, onChange: (val: string) => void }) {
    return (
        <div className="p-4 border border-white/10 rounded bg-white/5 text-muted-foreground">
            Rich Text Editor is currently disabled for debugging. Please use the Textarea below.
        </div>
    );
}
