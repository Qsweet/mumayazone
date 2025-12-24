"use server";

import { db } from "@/lib/db";
import { workshops } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateWorkshop(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const dateStr = formData.get("date") as string;
    const timeStr = formData.get("time") as string;
    const startTime = new Date(`${dateStr}T${timeStr}:00Z`); // Simple UTC assumption
    const price = parseInt(formData.get("price") as string || "0") * 100;
    const isFree = formData.get("isFree") === "on";
    const isPublished = formData.get("isPublished") === "on";

    await db.update(workshops).set({
        title,
        description: formData.get("description") as string,
        startTime,
        durationMinutes: parseInt(formData.get("duration") as string),
        price: isFree ? 0 : price,
        isFree,
        isPublished,
    }).where(eq(workshops.id, id));

    revalidatePath("/workshops");
    revalidatePath("/admin/workshops");
    revalidatePath(`/admin/workshops/${id}`);
}

export async function deleteWorkshop(id: string) {
    await db.delete(workshops).where(eq(workshops.id, id));
    revalidatePath("/workshops");
    revalidatePath("/admin/workshops");
    redirect("/admin/workshops");
}
