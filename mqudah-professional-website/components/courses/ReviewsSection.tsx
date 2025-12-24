
"use client";

import { Star, User } from "lucide-react";
import { useTranslations } from "next-intl";

export function ReviewsSection() {
    // Mock Data - In real app fetch from DB
    const reviews = [
        { id: 1, user: "Sarah J.", rating: 5, text: "This course completely changed my career path. Highly recommended!" },
        { id: 2, user: "Michael R.", rating: 5, text: "The best technical deep dive I've seen. Clear and concise." },
        { id: 3, user: "Ahmad K.", rating: 4, text: "Excellent content, especially the advanced patterns module." },
    ];

    return (
        <div className="bg-card border border-border rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Student Reviews</h3>

            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b border-border/50 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex text-accent">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-muted/20"}`} />
                                ))}
                            </div>
                            <span className="text-sm font-bold ml-2">{review.rating}.0</span>
                        </div>
                        <p className="text-muted-foreground mb-3">"{review.text}"</p>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <div className="p-1 bg-muted rounded-full">
                                <User className="w-3 h-3" />
                            </div>
                            {review.user}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
