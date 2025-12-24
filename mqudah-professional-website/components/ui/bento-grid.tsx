
"use client";

import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { ReactNode } from "react";
import Link from 'next/link';

export const BentoGrid = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "grid w-full auto-rows-[22rem] grid-cols-1 gap-4 md:grid-cols-3",
                className,
            )}
        >
            {children}
        </div>
    );
};

export const BentoCard = ({
    name,
    className,
    background,
    icon,
    description,
    href,
    cta,
}: {
    name: string;
    className?: string;
    background: ReactNode;
    icon: ReactNode;
    description: string;
    href: string;
    cta: string;
}) => (
    <div
        key={name}
        className={cn(
            "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
            // Modern Noir Glassmorphism
            "bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl",
            // Hover Effect
            "transition-all duration-300 hover:shadow-primary/20 hover:border-primary/50",
            className,
        )}
    >
        {/* Background Content (Image/Canvas/Aurora) */}
        <div className="absolute inset-0 -z-10">{background}</div>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

        {/* Content Container */}
        <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
            <div className="h-12 w-12 origin-left transform-gpu text-white transition-all duration-300 ease-in-out group-hover:scale-75 mb-2">
                {icon}
            </div>
            <h3 className="text-2xl font-semibold font-serif text-white tracking-tight">
                {name}
            </h3>
            <p className="max-w-lg text-neutral-300">{description}</p>
        </div>

        {/* CTA at Bottom (Revealed on Hover) */}
        <div
            className={cn(
                "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
            )}
        >
            <Link href={href} className="pointer-events-auto">
                <button className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 transition-colors">
                    {cta}
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                </button>
            </Link>
        </div>

        {/* Decorative Pointer/Flash */}
        <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-primary/5" />
    </div>
);
