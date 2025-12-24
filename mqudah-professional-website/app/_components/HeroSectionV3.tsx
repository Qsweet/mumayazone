
"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from 'next/link';

interface HeroProps {
    content: {
        headline: string;
        subhead: string;
        ctaPrimary: string;
        ctaSecondary: string;
    };
}

export default function HeroSectionV3({ content }: HeroProps) {
    return (
        <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-background">
            {/* Aurora Background Effects - Pure CSS */}
            <div className="absolute top-0 left-1/2 -px-40 -translate-x-1/2 opacity-30 pointer-events-none">
                <div className="h-[500px] w-[1000px] bg-primary/40 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
            </div>
            <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
                <div className="h-[400px] w-[600px] bg-accent/30 blur-[100px] rounded-full mix-blend-screen" />
            </div>

            <div className="container relative z-10 flex flex-col items-center text-center px-4 animate-in fade-in duration-1000 slide-in-from-bottom-10">
                {/* Badge */}
                <div
                    className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-neutral-300 backdrop-blur-md"
                >
                    <Sparkles className="mr-2 h-3.5 w-3.5 text-accent" />
                    <span>Redefining Digital Leadership</span>
                </div>

                {/* Headline */}
                <h1
                    className="max-w-4xl text-5xl font-serif font-bold tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9]"
                >
                    {content.headline || "Digital Excellence"}
                </h1>

                {/* Subhead */}
                <p
                    className="mt-8 max-w-2xl text-lg text-neutral-400 sm:text-xl md:text-2xl font-light"
                >
                    {content.subhead}
                </p>

                {/* CTAs */}
                <div
                    className="mt-10 flex flex-col gap-4 sm:flex-row"
                >
                    <Link href="/contact" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-primary px-8 font-medium text-white transition-all hover:bg-primary/90 hover:scale-105 active:scale-95">
                        <span className="mr-2">{content.ctaPrimary}</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link href="/services" className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-105 active:scale-95">
                        {content.ctaSecondary}
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-in fade-in delay-1000 duration-1000"
            >
                <span className="text-xs text-neutral-500 uppercase tracking-widest">Scroll</span>
                <div className="h-10 w-[1px] bg-gradient-to-b from-neutral-500 to-transparent" />
            </div>
        </section>
    );
}
