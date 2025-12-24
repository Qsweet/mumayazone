
"use client";

import { motion } from "framer-motion";

interface TrustSectionProps {
    content: {
        title: string;
        companies: string;
    };
}

export default function TrustSection({ content }: TrustSectionProps) {
    if (!content.companies) return null;

    const companyList = content.companies.split(',').map(c => c.trim());

    return (
        <section className="py-12 border-y border-white/5 bg-black/20 backdrop-blur-sm">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-muted-foreground uppercase tracking-widest mb-8 font-mono">
                    {content.title || "Trusted By Leaders At"}
                </p>

                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
                    {companyList.map((company, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-xl md:text-2xl font-bold text-white/50 hover:text-white transition-colors cursor-default"
                        >
                            {company}
                        </motion.span>
                    ))}
                </div>
            </div>
        </section>
    );
}
