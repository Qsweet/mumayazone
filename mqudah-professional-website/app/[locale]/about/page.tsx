
import { useTranslations } from "next-intl";
import { Users, Target, Zap, Shield, Globe, Award } from "lucide-react";
import { Header } from "@/components/layout/Header";

export default function AboutPage() {
    const t = useTranslations();
    const tAbout = useTranslations('about');
    const features = [
        {
            icon: <Users className="w-8 h-8 text-accent" />,
            title: tAbout('features.experts'),
            description: tAbout('features.experts_desc')
        },
        {
            icon: <Target className="w-8 h-8 text-primary" />,
            title: tAbout('features.vision'),
            description: tAbout('features.vision_desc')
        },
        {
            icon: <Zap className="w-8 h-8 text-accent" />,
            title: tAbout('features.speed'),
            description: tAbout('features.speed_desc')
        },
        {
            icon: <Shield className="w-8 h-8 text-primary" />,
            title: tAbout('features.quality'),
            description: tAbout('features.quality_desc')
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            {/* Hero Section */}
            <section className="relative py-32 overflow-hidden bg-muted/20">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-accent to-primary">
                            {tAbout('title')}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            {tAbout('description')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y border-border bg-card/50 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: "+500", label: "Students" },
                            { number: "+50", label: "Projects" },
                            { number: "+10", label: "Years Exp" },
                            { number: "24/7", label: "Support" }
                        ].map((stat, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="text-4xl font-bold text-accent">{stat.number}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="bg-card border border-border p-8 rounded-2xl hover:border-accent/30 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-accent/10 rounded-xl">
                                        <Globe className="w-8 h-8 text-accent" />
                                    </div>
                                    <h3 className="text-2xl font-bold">{tAbout('mission_title')}</h3>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    {tAbout('mission_desc')}
                                </p>
                            </div>

                            <div className="bg-card border border-border p-8 rounded-2xl hover:border-primary/30 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-primary/10 rounded-xl">
                                        <Award className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold">{tAbout('vision_title')}</h3>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    {tAbout('vision_desc')}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {features.map((feature, idx) => (
                                <div key={idx} className="text-center p-6 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors">
                                    <div className="flex justify-center mb-4">{feature.icon}</div>
                                    <h4 className="font-bold mb-2">{feature.title}</h4>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

