
import { Link } from "@/navigation";
import { cn } from "@/lib/utils";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, MapPin, Sparkles } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function Footer() {
    const t = await getTranslations();
    const locale = await getLocale();
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    const currentYear = new Date().getFullYear();

    // Fetch Dynamic Content (Latest 3 Valid Courses)
    const latestCourses = await db.query.courses.findMany({
        orderBy: [desc(courses.createdAt)],
        limit: 3,
        where: eq(courses.isPublished, true),
        columns: {
            id: true,
            title: true,
            slug: true,
        }
    });

    const socialLinks = [
        { icon: Linkedin, href: "https://linkedin.com/in/mqudah", label: "LinkedIn" },
        { icon: Twitter, href: "https://x.com/mqudah", label: "X (Twitter)" },
        { icon: Instagram, href: "https://instagram.com/mqudah", label: "Instagram" },
        { icon: Youtube, href: "https://youtube.com/@mqudah", label: "YouTube" }
    ];

    return (
        <footer className="bg-background border-t border-white/10 pt-20 pb-10 relative overflow-hidden" dir={dir}>
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
                                <span className="font-bold text-white text-lg">M</span>
                            </div>
                            <span className="font-serif text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Mqudah</span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            {t('Hero.description')}
                        </p>
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/5 hover:bg-accent/20 hover:border-accent/50 flex items-center justify-center transition-all group/icon"
                                >
                                    <social.icon className="w-4 h-4 text-gray-400 group-hover/icon:text-accent group-hover/icon:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Column */}
                    <div>
                        <h4 className="font-bold mb-6 text-white text-lg">{t('Footer.quick_links')}</h4>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-sm text-muted-foreground hover:text-accent hover:translate-x-1 transition-all inline-block">{t('Common.about')}</Link></li>
                            <li><Link href="/services" className="text-sm text-muted-foreground hover:text-accent hover:translate-x-1 transition-all inline-block">{t('Common.services')}</Link></li>
                            <li><Link href="/workshops" className="text-sm text-muted-foreground hover:text-accent hover:translate-x-1 transition-all inline-block">{t('Common.workshops')}</Link></li>
                            <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-accent hover:translate-x-1 transition-all inline-block">{t('Common.blog')}</Link></li>
                        </ul>
                    </div>

                    {/* Dynamic Courses Column (Replaces Legal) */}
                    <div>
                        <h4 className="font-bold mb-6 text-white text-lg flex items-center gap-2">
                            {locale === 'ar' ? 'أحدث الدورات' : 'Latest Courses'}
                            <Sparkles className="w-3 h-3 text-accent" />
                        </h4>
                        <ul className="space-y-4">
                            {latestCourses.length > 0 ? latestCourses.map(course => {
                                const title = course.title;
                                return (
                                    <li key={course.id}>
                                        <Link href={`/courses/${course.slug}`} className="group block">
                                            <span className="text-sm text-gray-300 group-hover:text-accent transition-colors line-clamp-1">
                                                {title}
                                            </span>
                                            <span className="text-xs text-muted-foreground/50 group-hover:text-accent/70 transition-colors">
                                                {locale === 'ar' ? 'مشاهدة الآن' : 'View Course'}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            }) : (
                                <li className="text-sm text-muted-foreground italic">
                                    {locale === 'ar' ? 'قريباً...' : 'Coming soon...'}
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="font-bold mb-6 text-white text-lg">{t('Footer.legal')} & {t('Common.contact')}</h4>
                        <ul className="space-y-3 mb-6">
                            <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-accent hover:translate-x-1 transition-all inline-block">{t('Footer.privacy')}</Link></li>
                            <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-accent hover:translate-x-1 transition-all inline-block">{t('Footer.terms')}</Link></li>
                            <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-accent hover:translate-x-1 transition-all inline-block">{t('Common.contact')}</Link></li>
                        </ul>

                        <div className="pt-4 border-t border-white/5 space-y-3">
                            <a href="mailto:m.qudah@mumayazone.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-white transition-colors group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                    <Mail className="w-4 h-4 text-accent" />
                                </div>
                                <span className="font-mono">m.qudah@mumayazone.com</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                    <p>{t('Footer.rights').replace('{year}', currentYear.toString())}</p>
                    <div className="flex items-center gap-6">
                        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono">v3.1.5</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

