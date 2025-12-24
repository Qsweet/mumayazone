
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight } from "lucide-react";

interface NewsletterSectionProps {
    content: {
        title: string;
        desc: string;
        cta: string;
    };
}

export default function NewsletterSection({ content }: NewsletterSectionProps) {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative p-10 rounded-3xl overflow-hidden text-center"
            >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-gray-900/80 to-black/90 backdrop-blur-xl border border-white/10" />
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />

                <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 border border-white/10 mb-4">
                        <Mail className="w-6 h-6 text-accent" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white font-serif">
                        {content.title || "Stay Ahead of the Curve"}
                    </h2>

                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {content.desc || "Join thousands of leaders receiving weekly insights on AI, Tech, and Growth."}
                    </p>

                    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mt-8" onSubmit={(e) => e.preventDefault()}>
                        <div className="relative flex-grow">
                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="pl-10 h-12 bg-black/40 border-white/10 text-white focus:border-accent"
                            />
                        </div>
                        <Button size="lg" className="h-12 bg-accent text-black hover:bg-accent/90 font-bold px-8">
                            {content.cta || "Subscribe"} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </form>

                    <p className="text-xs text-gray-500 mt-4">
                        No spam. Unsubscribe at any time.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
