import { db } from "@/lib/db";
import { workshops } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditWorkshopForm from "./_components/EditWorkshopForm";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        workshopId: string;
    }>
}

export default async function EditWorkshopPage({ params }: PageProps) {
    const { workshopId } = await params;

    const workshop = await db.query.workshops.findFirst({
        where: eq(workshops.id, workshopId),
    });

    if (!workshop) {
        notFound();
    }

    return <EditWorkshopForm workshop={workshop} />;
}
