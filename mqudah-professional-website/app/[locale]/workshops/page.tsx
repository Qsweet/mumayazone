import { db } from "@/lib/db";
import { workshops } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function WorkshopsPage() {
    const allWorkshops = await db.query.workshops.findMany({
        orderBy: [desc(workshops.startTime)],
        where: (workshops, { eq }) => eq(workshops.isPublished, true)
    });

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4">
                <div className="mb-16 text-center">
                    <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                        Live Workshops & Events
                    </h1>
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        Interactive sessions and masterclasses to accelerate your career growth.
                    </p>
                </div>

                {allWorkshops.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {allWorkshops.map((workshop) => (
                            <div
                                key={workshop.id}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
                            >
                                <div className="aspect-[1.8] w-full relative overflow-hidden">
                                    {workshop.coverImageUrl ? (
                                        <img
                                            src={workshop.coverImageUrl}
                                            alt={workshop.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/10" />
                                    )}
                                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-border">
                                        {workshop.isFree ? "FREE" : `$${(workshop.price / 100).toFixed(0)}`}
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col p-6">
                                    <div className="mb-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center text-accent">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            {format(new Date(workshop.startTime), "MMM d, yyyy")}
                                        </span>
                                        <span className="flex items-center">
                                            <Clock className="mr-1 h-3 w-3" />
                                            {format(new Date(workshop.startTime), "h:mm a")}
                                        </span>
                                    </div>

                                    <h3 className="mb-3 text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                                        {workshop.title}
                                    </h3>

                                    <p className="mb-6 line-clamp-2 text-sm text-muted-foreground flex-1">
                                        {workshop.description}
                                    </p>

                                    <Link href={`/workshops/${workshop.slug}`} className="mt-auto">
                                        <Button className="w-full rounded-xl gap-2 group-hover:bg-primary/90">
                                            Register Now
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 py-32 text-center">
                        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                            <Calendar className="h-8 w-8" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold">No Upcoming Workshops</h3>
                        <p className="max-w-md text-muted-foreground">
                            Check back soon for our next scheduled live sessions.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
