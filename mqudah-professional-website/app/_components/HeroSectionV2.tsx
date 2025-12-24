
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";

interface HeroV2Props {
    content: {
        headline: string;
        subhead: string;
        ctaPrimary: string;
        ctaSecondary: string;
        name?: string;
    };
}

export default function HeroSectionV2({ content }: HeroV2Props) {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            </div>

            <div className="container relative z-10 mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-accent">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                        </span>
                        Thinking Forward in 2025
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold font-serif leading-tight">
                        <span className="text-white block">{content.headline?.split(" ")[0]} </span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500">
                            {content.headline?.split(" ").slice(1).join(" ") || "Master Digital Leadership"}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed border-l-2 border-accent/50 pl-6">
                        {content.subhead || "Join a community of forward-thinkers bridging the gap between human potential and AI innovation."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button size="lg" className="h-14 px-8 text-lg bg-white text-black hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            {content.ctaPrimary || "Start Learning"} <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-white/20 hover:bg-white/5 backdrop-blur-sm">
                            <PlayCircle className="mr-2 w-5 h-5" /> {content.ctaSecondary || "Explore Services"}
                        </Button>
                    </div>
                </motion.div>

                {/* Right: Visual Abstract */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative hidden lg:block"
                >
                    <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                        {/* Placeholder for Dynamic Art or 3D Element */}
                        <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_60s_linear_infinite]" />
                        <div className="absolute inset-10 border border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-[80px] opacity-50" />
                            {/* If we have a hero image in content, use it, else abstract */}
                            <div className="text-9xl font-bold text-white/5 select-none">MQ</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
