import { db } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Globe, Save, LayoutTemplate, Search, Info } from "lucide-react";
import { revalidatePath } from "next/cache";
import { invalidateContentCache } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ContentManagerPage() {
    const allContent = await db.query.siteContent.findMany();

    async function updateContent(formData: FormData) {
        "use server";
        const keys = Array.from(formData.keys()).filter(k => k.startsWith('content-'));

        for (const keyInput of keys) {
            // content-en-hero.title
            const [_, lang, ...keyParts] = keyInput.split('-');
            const key = keyParts.join('-');
            const value = formData.get(keyInput) as string;

            // Find existing
            const existing = await db.query.siteContent.findFirst({
                where: and(eq(siteContent.key, key), eq(siteContent.language, lang))
            });

            if (existing) {
                if (existing.value !== value) {
                    await db.update(siteContent)
                        .set({ value, updatedAt: new Date() })
                        .where(eq(siteContent.id, existing.id));

                    // V2: Invalidate Cache
                    await invalidateContentCache(key, lang);
                }
            } else {
                await db.insert(siteContent).values({
                    key,
                    language: lang,
                    value,
                    section: key.split('.')[0] || 'general',
                    type: value.length > 100 ? 'textarea' : 'text'
                });
                await invalidateContentCache(key, lang);
            }
        }
        revalidatePath('/');
        revalidatePath('/admin/content');
    }

    // Helper to get value
    const getValue = (key: string, lang: string) =>
        allContent.find(c => c.key === key && c.language === lang)?.value || "";

    // Helper to get type (fallback to config)
    const getType = (key: string, configType?: string) => {
        const item = allContent.find(c => c.key === key && c.language === 'en');
        return item?.type || configType || 'text';
    };

    const sections = [
        {
            id: 'hero', label: 'Hero (V2 Content Hub)', icon: LayoutTemplate, fields: [
                { key: 'hero.headline_benefit', label: 'Benefit Headline (e.g. Master AI Leadership)', type: 'textarea' },
                { key: 'hero.subhead_social_proof', label: 'Social Proof Subhead (e.g. Join 5000+ Students)' },
                { key: 'hero.cta_primary', label: 'Primary CTA (e.g. Start Learning Free)' },
                { key: 'hero.cta_secondary', label: 'Secondary CTA (e.g. Explore Services)' },
                // Legacy support (optional)
                { key: 'hero.title_prefix', label: 'Legacy: Title Prefix' },
                { key: 'hero.name', label: 'Legacy: Name' },
            ]
        },
        {
            id: 'trust', label: 'Trust Bar', icon: Info, fields: [
                { key: 'trust.title', label: 'Trust Title (e.g. Trusted By)' },
                { key: 'trust.companies', label: 'Company Names/Logos (Comma Separated)', type: 'textarea' },
            ]
        },
        {
            id: 'bio', label: 'Bio & Stats', icon: Info, fields: [
                { key: 'bio.title', label: 'Section Title' },
                { key: 'bio.description1', label: 'Bio Header' },
                { key: 'bio.description2', label: 'Bio Body', type: 'textarea' },
                { key: 'bio.stat1', label: 'Stat 1 Label' },
                { key: 'bio.stat1_val', label: 'Stat 1 Value (e.g. 50+)' }, // Added value key
                { key: 'bio.stat2', label: 'Stat 2 Label' },
                { key: 'bio.stat3', label: 'Stat 3 Label' },
            ]
        },
        {
            id: 'newsletter', label: 'Newsletter', icon: Globe, fields: [
                { key: 'newsletter.title', label: 'Newsletter Title' },
                { key: 'newsletter.desc', label: 'Newsletter Description', type: 'textarea' },
                { key: 'newsletter.cta', label: 'Subscribe Button Text' },
            ]
        },
        {
            id: 'services', label: 'Services', icon: LayoutTemplate, fields: [
                { key: 'services.title', label: 'Section Title' },
                { key: 'services.description', label: 'Section Desc', type: 'textarea' },
                { key: 'services.cta_title', label: 'CTA Title' },
                { key: 'services.cta_desc', label: 'CTA Desc', type: 'textarea' },
                { key: 'services.cta_button', label: 'CTA Button' },
            ]
        },
        {
            id: 'seo', label: 'SEO Settings', icon: Search, fields: [
                { key: 'seo.title', label: 'Site Title Default' },
                { key: 'seo.description', label: 'Site Description Default', type: 'textarea' },
                { key: 'seo.keywords', label: 'Keywords' },
            ]
        }
    ];

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 pb-32">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-serif text-white mb-2">Content Manager (V2 Cache-First)</h1>
                <p className="text-muted-foreground">Manage website text. Updates are instant via Redis Cache Invalidation.</p>
            </div>

            <form action={updateContent}>
                <div className="flex justify-end mb-6 sticky top-4 z-10">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 shadow-xl">
                        <Save className="w-5 h-5 mr-2" />
                        Save All Changes
                    </Button>
                </div>

                <div className="grid gap-8">
                    {sections.map(section => (
                        <div key={section.id} className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-accent">
                                <section.icon className="w-6 h-6" />
                                {section.label}
                            </h2>

                            <div className="space-y-6">
                                {section.fields.map(field => {
                                    const fieldType = getType(field.key, field.type);
                                    return (
                                        <div key={field.key} className="grid md:grid-cols-2 gap-6 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                            {/* English */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center justify-between">
                                                    {field.label} (EN)
                                                    <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[10px]">English</span>
                                                </label>
                                                {fieldType === 'textarea' ? (
                                                    <textarea
                                                        name={`content-en-${field.key}`}
                                                        defaultValue={getValue(field.key, 'en')}
                                                        rows={3}
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none font-sans"
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        name={`content-en-${field.key}`}
                                                        defaultValue={getValue(field.key, 'en')}
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none font-sans"
                                                    />
                                                )}
                                            </div>

                                            {/* Arabic */}
                                            <div className="space-y-2" dir="rtl">
                                                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center justify-between">
                                                    {field.label} (AR)
                                                    <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-[10px]">العربية</span>
                                                </label>
                                                {fieldType === 'textarea' ? (
                                                    <textarea
                                                        name={`content-ar-${field.key}`}
                                                        defaultValue={getValue(field.key, 'ar')}
                                                        rows={3}
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none font-sans"
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        name={`content-ar-${field.key}`}
                                                        defaultValue={getValue(field.key, 'ar')}
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none font-sans"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
}
