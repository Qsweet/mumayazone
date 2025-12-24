"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

export function Testimonials() {
    const testimonials = [
        {
            name: "Ahmed Salem",
            role: "Digital Marketing Manager",
            quote: "Mohammad's course completely transformed my understanding of SEO. Highly recommended!",
            rating: 5,
        },
        {
            name: "Sarah Jordan",
            role: "Entrepreneur",
            quote: "The strategies I learned helped me scale my business by 300% in just 6 months.",
            rating: 5,
        },
        {
            name: "Omar Farooq",
            role: "Content Creator",
            quote: "Practical, actionable, and up-to-date. The best investment I made for my career.",
            rating: 5,
        },
    ];

    return (
        <section className="py-24 bg-card/50 relative overflow-hidden backdrop-blur-sm border-y border-border/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                        Success Stories
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Hear from our students and clients.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="rounded-2xl border border-border bg-background/50 p-8 shadow-sm transition-colors hover:border-accent/40"
                        >
                            <Quote className="mb-4 h-8 w-8 text-accent/20" />

                            <div className="flex gap-1 mb-6">
                                {[...Array(item.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-current text-yellow-500" />
                                ))}
                            </div>

                            <p className="mb-6 leading-relaxed text-muted-foreground italic">
                                "{item.quote}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent p-[1px]">
                                    <div className="h-full w-full rounded-full bg-background flex items-center justify-center text-xs font-bold">
                                        {item.name.charAt(0)}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{item.name}</h4>
                                    <p className="text-xs text-muted-foreground">{item.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
