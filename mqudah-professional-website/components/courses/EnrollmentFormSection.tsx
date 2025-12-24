
"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { enrollUser } from "@/app/[locale]/courses/[slug]/actions";
import { useRouter } from "@/navigation";

interface EnrollmentProps {
    courseId: string;
    price: number;
    title: string;
    isEnrolled?: boolean;
    firstLessonUrl?: string; // Optional URL to jump straight to learning
}

export function EnrollmentFormSection({ courseId, price, title, isEnrolled, firstLessonUrl }: EnrollmentProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEnroll = async () => {
        setLoading(true);
        try {
            const result = await enrollUser(courseId);

            if (result.error) {
                toast.error(result.error);
                if (result.error.includes("logged in")) {
                    router.push("/login"); // Use localized router
                }
            } else {
                toast.success("Successfully enrolled!");
                router.refresh(); // Refresh to update UI state to "You are Enrolled!"
            }
        } catch (e) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (isEnrolled) {
        return (
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24 shadow-2xl shadow-primary/5 border-l-4 border-l-green-500">
                <h3 className="text-xl font-bold mb-2">You are Enrolled!</h3>
                <div className="text-sm text-muted-foreground mb-6">
                    You have full lifetime access to this course.
                </div>

                <Button size="lg" className="w-full mb-4 text-lg font-bold bg-green-600 hover:bg-green-700 text-white" asChild>
                    <a href={firstLessonUrl || "#"}>
                        Resume Learning
                    </a>
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                    Continue where you left off
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-2xl p-6 sticky top-24 shadow-2xl shadow-primary/5">
            <h3 className="text-xl font-bold mb-2">Subscribe to Course</h3>
            <div className="text-3xl font-bold text-primary mb-6">
                {price > 0 ? `$${(price / 100).toFixed(2)}` : "Free"}
            </div>

            <Button size="lg" className="w-full mb-4 text-lg font-bold" onClick={handleEnroll} disabled={loading}>
                {loading ? "Processing..." : "Enroll Now"}
            </Button>

            <p className="text-xs text-center text-muted-foreground mb-6">
                30-Day Money-Back Guarantee
            </p>

            <div className="space-y-3">
                <h4 className="font-semibold text-sm">This course includes:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                        <CheckCircle className="w-4 h-4 text-accent" /> Full lifetime access
                    </li>
                    <li className="flex gap-2">
                        <CheckCircle className="w-4 h-4 text-accent" /> Access on mobile and TV
                    </li>
                    <li className="flex gap-2">
                        <CheckCircle className="w-4 h-4 text-accent" /> Certificate of completion
                    </li>
                </ul>
            </div>

            <div className="mt-6 pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4" /> Secure Payment
            </div>
        </div>
    );
}
