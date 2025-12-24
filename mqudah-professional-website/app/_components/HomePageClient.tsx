import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Code, Globe, Shield, Star, Users, Briefcase, ChevronRight, Play, Brain, Cloud } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface HomePageClientProps {
    dbContent: {
        en: Record<string, string>;
        ar: Record<string, string>;
    }
}

export default function HomePageClient({ dbContent }: HomePageClientProps) {
    const { t, dir, language } = useLanguage(); // Still use context for direction/language state
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isRtl = dir === 'rtl';

    // Helper to get dynamic content with fallback to dictionary (for smooth transition)
    const getContent = (key: string) => {
        const dbVal = dbContent[language as 'en' | 'ar']?.[key];
        if (dbVal) return dbVal;

        // Fallbacks (Dictionary access simulation)
        // This part is messy because 't' is structured object strings.
        // We will try to rely on DB content mostly.
        return key; // Fallback to key name cleanly
    };

    // Improved Helper that accepts a fallback string
    const getC = (key: string, fallback: string) => {
        return dbContent[language as 'en' | 'ar']?.[key] || fallback;
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden" dir={dir}>

            {/* HER0 SECTION */}
            <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-background">
                    <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.03]" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="container relative z-10 px-4 mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Text Content */}
                        <div className={cn("space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100",
                            isRtl ? "text-right" : "text-left")}>

                            <div className="inline-flex items-center rounded-full bg-accent/5 border border-accent/20 px-4 py-1.5 text-sm font-medium text-accent backdrop-blur-sm">
                                <Star className={cn("w-4 h-4 text-accent", isRtl ? "ml-2" : "mr-2")} />
                                {getC('hero.tag', t.hero.tag)}
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold font-serif leading-tight tracking-tight">
                                {getC('hero.title_prefix', t.hero.title_prefix)} <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-accent">
                                    {getC('hero.name', t.hero.name)}
                                </span>
                            </h1>

                            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                                {getC('hero.description', t.hero.description)}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-4">
                                <Link href="/courses">
                                    <Button size="lg" className="rounded-full px-8 text-lg h-14 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                                        {getC('hero.explore', t.hero.explore)}
                                        <ArrowRight className={cn("w-5 h-5", isRtl ? "mr-2 rotate-180" : "ml-2")} />
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button size="lg" variant="outline" className="rounded-full px-8 text-lg h-14 border-white/20 hover:bg-white/5 backdrop-blur-sm">
                                        {getC('hero.contact', t.hero.contact)}
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                                <div>
                                    <div className="text-3xl font-bold font-mono text-white">25{getC('hero.plus', '+')}</div>
                                    <div className="text-sm text-muted-foreground">{getC('hero.years_exp', t.hero.years_exp)}</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold font-mono text-accent">50K{getC('hero.plus', '+')}</div>
                                    <div className="text-sm text-muted-foreground">{getC('hero.students', t.hero.students)}</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold font-mono text-primary">100{getC('hero.plus', '+')}</div>
                                    <div className="text-sm text-muted-foreground">{getC('bio.stat1', t.bio.stat1)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative animate-in fade-in zoom-in duration-1000 delay-300">
                            <div className="relative z-10 aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm p-4">
                                <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary/20 opacity-50 mix-blend-overlay" />
                                <Image
                                    src="/images/mq-profile.jpg"
                                    alt={getC('hero.name', t.hero.name)}
                                    fill
                                    priority
                                    className="object-cover rounded-3xl transition-transform duration-700 hover:scale-105 filter grayscale hover:grayscale-0"
                                />

                                {/* Floating Badge */}
                                <div className={cn("absolute bottom-8 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl flex items-center gap-4 max-w-[280px]",
                                    isRtl ? "left-8" : "right-8")}>
                                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">{getC('bio.highlight', t.bio.highlight)}</div>
                                        <div className="text-xs text-muted-foreground">Est. 2000</div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Blur */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl -z-10 rounded-[3rem]" />
                        </div>
                    </div>
                </div>
            </section>

            {/* BIO SECTION */}
            <section className="py-32 relative bg-muted/5">
                <div className="container px-4 mx-auto">
                    <div className="max-w-4xl mx-auto text-center space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-sm font-bold tracking-widest text-accent uppercase">
                                {getC('bio.title', t.bio.title)}
                            </h2>
                            <h3 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                                {getC('bio.description1', t.bio.description1)}
                            </h3>
                        </div>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            {getC('bio.description2', t.bio.description2)}
                        </p>
                        <div className="flex justify-center">
                            <Image
                                src="/logo-icon.png"
                                alt="Signature"
                                width={64}
                                height={64}
                                className="h-16 w-auto opacity-50"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES PREVIEW */}
            <section className="py-32 relative">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div>
                            <h2 className="text-4xl font-bold font-serif mb-4">{getC('services.title', t.services.title)}</h2>
                            <p className="text-lg text-muted-foreground max-w-xl">{getC('services.description', t.services.description)}</p>
                        </div>
                        <Link href="/services">
                            <Button variant="outline" className="rounded-full">
                                {language === 'ar' ? 'عرض جميع الخدمات' : 'View All Services'}
                                <ArrowRight className={cn("w-4 h-4", isRtl ? "mr-2 rotate-180" : "ml-2")} />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Code, key: 'web' },
                            { icon: Brain, key: 'data' },
                            { icon: Cloud, key: 'cloud' }
                        ].map((item, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-6 h-6 text-accent" />
                                </div>
                                {/* Note: Services items are complex objects in dictionary, might need specific keys if dynamic */}
                                <h3 className="text-xl font-bold mb-3">{(t.services.items as any)[item.key].title}</h3>
                                <p className="text-muted-foreground mb-6">{(t.services.items as any)[item.key].desc}</p>
                                <div className="flex items-center text-sm font-medium text-accent cursor-pointer">
                                    {language === 'ar' ? 'اعرف المزيد' : 'Learn more'}
                                    <ChevronRight className={cn("w-4 h-4 transition-transform", isRtl ? "mr-1 rotate-180 group-hover:-translate-x-1" : "ml-1 group-hover:translate-x-1")} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5">
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
                </div>
                <div className="container relative z-10 px-4 mx-auto text-center">
                    <h2 className="text-5xl md:text-7xl font-bold font-serif mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                        {getC('services.cta_title', t.services.cta_title)}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                        {getC('services.cta_desc', t.services.cta_desc)}
                    </p>
                    <Link href="/contact">
                        <Button size="lg" className="rounded-full px-12 py-8 text-xl h-auto shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                            {getC('services.cta_button', t.services.cta_button)}
                        </Button>
                    </Link>
                </div>
            </section>

        </div>
    );
}
