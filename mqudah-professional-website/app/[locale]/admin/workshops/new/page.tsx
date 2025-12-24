import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/navigation";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { workshops } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function NewWorkshopPage({ params }: PageProps) {
    const { locale } = await params;

    async function createWorkshop(formData: FormData) {
        "use server";

        const title = formData.get("title") as string;
        const locale = formData.get("locale") as string;
        // console.log("CreateWorkshop Debug:", { locale, keys: Array.from(formData.keys()) });
        const slug = formData.get("slug") as string || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const dateStr = formData.get("date") as string;
        const timeStr = formData.get("time") as string;
        const startTime = new Date(`${dateStr}T${timeStr}:00Z`);
        const price = parseInt(formData.get("price") as string || "0") * 100;
        const isFree = formData.get("isFree") === "on";

        if (!title || !dateStr) return;

        // Auth Check
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) throw new Error("Unauthorized");

        // Simple decode to verify structure/existence (verification done by middleware/API usually)
        try {
            JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        } catch (e) {
            throw new Error("Invalid Token");
        }

        const [newWorkshop] = await db.insert(workshops).values({
            title,
            slug,
            description: formData.get("description") as string || "New workshop description",
            startTime,
            durationMinutes: parseInt(formData.get("duration") as string || "60"),
            price: isFree ? 0 : price,
            currency: "USD",
            isFree,
            isPublished: false,
        }).returning();

        redirect(`/${locale}/admin/workshops`);
    }

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8">
            <Link href="/admin/workshops" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Workshops
            </Link>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold font-serif text-white">Schedule New Workshop</h1>
                <p className="text-muted-foreground">Set up a live event or webinar.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-8">
                <form action={createWorkshop} className="space-y-6">
                    <input type="hidden" name="locale" value={locale} />
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Event Title</label>
                        <input name="title" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" placeholder="e.g. Q1 Strategy Session" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Date</label>
                            <input type="date" name="date" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Time (UTC)</label>
                            <input type="time" name="time" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Duration (Minutes)</label>
                            <input type="number" name="duration" defaultValue={60} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Price (USD)</label>
                            <input type="number" name="price" defaultValue={0} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="isFree" id="free" className="w-4 h-4 rounded bg-white/5 border-white/10" />
                        <label htmlFor="free" className="text-sm">This is a free event</label>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Description</label>
                        <textarea name="description" rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-4">
                        <Link href="/admin/workshops">
                            <Button variant="ghost" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit" className="rounded-full bg-accent hover:bg-accent/90 min-w-[120px]">
                            Schedule Event
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
