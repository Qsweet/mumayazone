
"use client";

import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Facebook, Copy } from "lucide-react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

interface ShareButtonsProps {
    title: string;
    url?: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
    const pathname = usePathname();
    const url = typeof window !== 'undefined' ? `${window.location.origin}${pathname}` : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    };

    const handleShare = (platform: string) => {
        let shareUrl = "";
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
        }
        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => handleShare('twitter')} title="Share on X">
                <Twitter className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleShare('linkedin')} title="Share on LinkedIn">
                <Linkedin className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleShare('facebook')} title="Share on Facebook">
                <Facebook className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleCopy} title="Copy Link">
                <Copy className="w-4 h-4" />
            </Button>
        </div>
    );
}
