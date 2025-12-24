
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Globe, Smartphone, Database, Users, Check, ArrowRight, Zap } from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";

export default function ServicesPage() {
    const t = useTranslations();
    const tServices = useTranslations('services');

    const servicesList = [
        {
            icon: <Globe className="h-10 w-10 text-primary" />,
            id: 'web',
            features: ['Next.js / React', 'SEO Optimization', 'High Performance']
        },
        {
            icon: <Smartphone className="h-10 w-10 text-accent" />,
            id: 'mobile',
            features: ['React Native', 'iOS & Android', 'Native Performance']
        },
        {
            icon: <Database className="h-10 w-10 text-primary" />,
            id: 'cloud',
            features: ['AWS / Azure', 'Scalable Arch', 'DevOps CI/CD']
        },
        {
            icon: <Users className="h-10 w-10 text-accent" />,
            id: 'consulting',
            features: ['Tech Strategy', 'Team Leadership', 'Code Audits']
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            {/* Hero */}
            <section className="relative py-32 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-400 uppercase tracking-widest backdrop-blur-md">
                        <Zap className="mr-2 h-3.5 w-3.5 text-accent" />
                        Professional Solutions
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        {tServices('title')}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {tServices('subtitle')}
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="pb-32">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8">
                        {servicesList.map((service) => (
                            <div key={service.id} className="group relative bg-card border border-white/10 p-8 rounded-3xl hover:border-accent/40 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{tServices(`items.${service.id}.title`)}</h3>
                                    <p className="text-muted-foreground mb-6 min-h-[3rem]">
                                        {tServices(`items.${service.id}.desc`)}
                                    </p>

                                    <ul className="space-y-3 mb-8">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center text-sm text-gray-300">
                                                <Check className="w-4 h-4 text-accent mr-2" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href="/contact">
                                        <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-black border-white/10">
                                            {t('Common.readMore')} <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-muted/20 border-y border-white/5">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">{tServices('cta_title')}</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto mb-10">
                        {tServices('cta_desc')}
                    </p>
                    <Link href="/contact">
                        <Button size="lg" className="px-8 text-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                            {t('Common.contact')} <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
