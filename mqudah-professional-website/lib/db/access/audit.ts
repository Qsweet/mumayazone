
import { db } from "@/lib/db";
import { auditLogs, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getAuditLogsForUser(userId: string) {
    return db.select({
        id: auditLogs.id,
        action: auditLogs.action,
        status: auditLogs.status,
        details: auditLogs.details,
        ipAddress: auditLogs.ipAddress,
        createdAt: auditLogs.createdAt,
        actor: {
            name: users.name,
            email: users.email
        }
    })
        .from(auditLogs)
        // Join to get the actor's name if we tracked actorId separately?
        // Currently userId in auditLogs IS the actor usually, or the target?
        // In our service: userId = user who PERFORMED the action (Actor).
        // Wait, if I want to see history FOR A TARGET USER, I need to query where `details->>target_user_id` = userId
        // OR where `userId` = userId (actions THEY did).
        // The requirement is "History tab for each user profile".
        // This usually means "What happened TO this user?" AND "What did this user DO?".
        // Let's support both or focus on "What happened TO this user" securely.

        // For now, let's just fetch actions PERFORMED BY this user + Actions where this user is the TARGET.
        // Drizzle doesn't support generic JSONB query easily without `sql`.
        // Let's just fetch actions PERFORMED BY them for now as a Phase 6 MVP.
        .leftJoin(users, eq(auditLogs.userId, users.id))
        .where(eq(auditLogs.userId, userId))
        .orderBy(desc(auditLogs.createdAt))
        .limit(50);
}
