
import { Metadata } from "next";
import HeroSectionV3 from "@/app/_components/HeroSectionV3";
import NewsletterSection from "@/app/_components/NewsletterSection";
import { CourseGrid } from "@/app/_components/CourseGrid";
import { BlogGrid } from "@/app/_components/BlogGrid";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { Code2, Globe, Database, Smartphone, Users, Sparkles } from "lucide-react";
import { getTranslations } from 'next-intl/server';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords')?.split(',').map(k => k.trim()) || [],
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      images: ['/images/mq-profile.jpg'],
    }
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isRtl = locale === 'ar';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Mohammad Al-Qudah',
    url: 'https://mumayazone.com',
    jobTitle: t('Hero.headline_benefit'),
    sameAs: ['https://linkedin.com/in/mqudah']
  };

  const heroData = {
    headline: t('Hero.headline_benefit'),
    subhead: t('Hero.subhead_social_proof'),
    ctaPrimary: t('Hero.cta_primary'),
    ctaSecondary: t('Hero.cta_secondary'),
  };

  const newsletterData = {
    title: t('newsletter.title'),
    desc: t('newsletter.desc'),
    cta: t('newsletter.cta')
  };

  // Bento Content Definition
  const features = [
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      name: t('services.items.web.title'),
      description: t('services.items.web.desc'),
      href: "/services",
      cta: t('Common.readMore'),
      background: <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-50" />,
      className: "lg:col-span-2",
    },
    {
      icon: <Smartphone className="h-8 w-8 text-primary" />,
      name: t('services.items.mobile.title'),
      description: t('services.items.mobile.desc'),
      href: "/services",
      cta: t('Common.readMore'),
      background: <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 opacity-50" />,
      className: "lg:col-span-1",
    },
    {
      icon: <Database className="h-8 w-8 text-primary" />,
      name: t('services.items.cloud.title'),
      description: t('services.items.cloud.desc'),
      href: "/services",
      cta: t('Common.readMore'),
      background: <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 opacity-50" />,
      className: "lg:col-span-1",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      name: t('services.items.consulting.title'),
      description: t('services.items.consulting.desc'),
      href: "/contact",
      cta: t('Common.contact'),
      background: <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 opacity-50" />,
      className: "lg:col-span-2",
    },
  ];


  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white overflow-x-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Aurora Hero (V3) */}
      <HeroSectionV3 content={heroData} />

      {/* 2. Bento Grid Showcase */}
      <section className="py-32 container mx-auto px-4 relative z-10">
        <div className="absolute inset-0 bg-primary/5 blur-[300px] pointer-events-none" />

        <div className="flex flex-col items-center mb-20 text-center relative z-10">
          <span className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-neutral-300 uppercase tracking-[0.2em] backdrop-blur-md shadow-2xl">
            <Sparkles className="mr-2 h-3.5 w-3.5 text-accent animate-pulse" />
            Core Expertise
          </span>
          <h2 className="text-4xl md:text-6xl font-bold font-serif mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            {t('Home.bento_title')}
          </h2>
          <p className="text-neutral-400 max-w-2xl text-lg leading-relaxed">
            {t('Hero.subhead_social_proof')}
          </p>
        </div>
        <BentoGrid className="lg:grid-rows-2 gap-6">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </section>

      {/* 3. Featured Courses - V3 Style */}
      <section className="py-32 bg-black/40 border-y border-white/5 relative backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="space-y-4">
              <span className="text-accent font-mono text-xs tracking-widest uppercase">Academy</span>
              <h2 className="text-3xl md:text-5xl font-bold font-serif text-white">
                {t('Home.featured_courses')}
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                {t('Home.featured_courses_subtitle')}
              </p>
            </div>
            <a
              href="/courses"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-white/10 hover:border-accent/50"
            >
              {t('Home.courses_link')}
              <Sparkles className="w-4 h-4 ml-1 transition-transform group-hover:scale-125 text-accent" />
            </a>
          </div>
          <CourseGrid />
        </div>
      </section>

      {/* 4. Latest Insights - V3 Style */}
      <section className="py-32 container mx-auto px-4 relative">
        <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 relative z-10">
          <div className="space-y-4">
            <span className="text-primary font-mono text-xs tracking-widest uppercase">Intel</span>
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-white">
              {t('Home.latest_insights')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              {t('Home.latest_insights_subtitle')}
            </p>
          </div>
          <a
            href="/blog"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-white/10 hover:border-primary/50"
          >
            {t('Home.blog_link')}
            <Globe className="w-4 h-4 ml-1 transition-transform group-hover:rotate-12 text-primary" />
          </a>
        </div>
        <BlogGrid />
      </section>

      {/* 5. Newsletter (Client) */}
      <NewsletterSection content={newsletterData} />
    </main>
  );
}

