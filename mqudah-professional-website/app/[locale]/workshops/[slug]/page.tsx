import { db } from "@/lib/db";
import { workshops } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, CheckCircle, ArrowLeft, Share2 } from "lucide-react";
import { Link } from "@/navigation";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function WorkshopDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch workshop by slug
    const workshop = await db.query.workshops.findFirst({
        where: eq(workshops.slug, slug)
    });

    if (!workshop) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            {/* Back Navigation */}
            <div className="container mx-auto px-4 mb-8">
                <Link href="/workshops" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Workshops
                </Link>
            </div>

            {/* Hero Section */}
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Content */}
                    <div className="space-y-8">
                        <div>
                            <div className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent mb-4">
                                {workshop.isFree ? "Free Workshop" : "Premium Masterclass"}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight text-white mb-6">
                                {workshop.title}
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {workshop.description}
                            </p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-6 p-6 rounded-2xl border border-white/5 bg-white/5">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" /> Date
                                </div>
                                <div className="font-semibold text-white">
                                    {format(new Date(workshop.startTime), "MMMM d, yyyy")}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4" /> Time
                                </div>
                                <div className="font-semibold text-white">
                                    {format(new Date(workshop.startTime), "h:mm a")}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4" /> Location
                                </div>
                                <div className="font-semibold text-white">
                                    {"Online (Zoom)"}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Share2 className="w-4 h-4" /> Capacity
                                </div>
                                <div className="font-semibold text-white">
                                    {"Unlimited"}
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="rounded-full px-8 text-lg w-full sm:w-auto">
                                Register Now • {workshop.isFree ? "Free" : `$${(workshop.price / 100).toFixed(0)}`}
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full px-8 w-full sm:w-auto">
                                Add to Calendar
                            </Button>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-muted/10">
                        {workshop.coverImageUrl ? (
                            <img
                                src={workshop.coverImageUrl}
                                alt={workshop.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/10">
                                <Calendar className="w-20 h-20 text-white/20" />
                            </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-sm font-bold text-white">
                            {workshop.isPublished ? "Open for Registration" : "Closed"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Agenda / What to expect */}
            <div className="container mx-auto px-4 mt-20">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold font-serif mb-8 text-center">What You'll Learn</h2>
                    <div className="grid gap-4">
                        {/* Placeholder Agenda Items since we don't have them in DB yet */}
                        {[
                            "Core principles and best practices",
                            "Real-world case studies and examples",
                            "Interactive Q&A session with the instructor",
                            "Networking opportunities with peers"
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                <span className="text-muted-foreground">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
