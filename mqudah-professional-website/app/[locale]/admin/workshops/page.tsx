import Image from "next/image";
import { getAllWorkshops } from "@/lib/data/workshops";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { Plus, Calendar, Clock, MapPin, Edit, Users } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminWorkshopsPage() {
    const allWorkshops = await getAllWorkshops();


    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-serif text-white">Workshops</h1>
                    <p className="text-muted-foreground mt-1">Schedule and manage live events.</p>
                </div>
                <Link href="/admin/workshops/new">
                    <Button className="rounded-full bg-accent hover:bg-accent/90 gap-2 text-white">
                        <Plus className="w-4 h-4" />
                        Schedule Workshop
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allWorkshops.map((ws) => (
                    <div key={ws.id} className="group relative flex flex-col rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden hover:border-accent/50 transition-colors">
                        <div className="aspect-[2/1] bg-white/5 relative">
                            {ws.coverImageUrl ? (
                                <Image
                                    src={ws.coverImageUrl}
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    alt={ws.title || "Workshop cover"}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    <Calendar className="w-8 h-8 opacity-20" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${ws.isPublished ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-amber-500/20 text-amber-400 border border-amber-500/20'}`}>
                                    {ws.isPublished ? 'Live' : 'Draft'}
                                </span>
                            </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1 space-y-4">
                            <div>
                                <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-accent transition-colors">{ws.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{ws.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {format(new Date(ws.startTime), "MMM d, yyyy")}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {format(new Date(ws.startTime), "h:mm a")}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>24 Registered</span>
                                </div>
                                <div className="flex items-center gap-1.5 font-medium text-white">
                                    {ws.isFree ? "Free" : `$${(ws.price / 100).toFixed(0)}`}
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                                <Link href={`/admin/workshops/${ws.id}`} className="w-full">
                                    <Button variant="outline" size="sm" className="w-full border-white/10 hover:bg-white/5">
                                        <Edit className="w-3 h-3 mr-2" />
                                        Edit
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {allWorkshops.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl">
                        <Calendar className="w-10 h-10 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No Workshops Scheduled</h3>
                        <p className="text-muted-foreground mb-6">Create your first event to start accepting registrations.</p>
                        <Link href="/admin/workshops/new">
                            <Button variant="outline">Schedule Workshop</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
