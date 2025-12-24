
import { db } from "@/lib/db";
import { auditLogs, auditActionEnum } from "@/lib/db/schema";
import { headers } from "next/headers";

type AuditAction = typeof auditActionEnum.enumValues[number];

interface AuditDetails {
    [key: string]: any;
    diff?: {
        [field: string]: {
            old: any;
            new: any;
        };
    };
    impersonator_id?: string;
}

export async function logEvent(
    userId: string | null,
    action: AuditAction,
    details: AuditDetails,
    status: 'SUCCESS' | 'FAILURE' = 'SUCCESS'
) {
    try {
        console.log(`[AUDIT_DEBUG] logEvent called for user ${userId}, action ${action}`);
        const headerStore = await headers();
        const ipAddress = headerStore.get("x-forwarded-for") || "unknown";
        const userAgent = headerStore.get("user-agent") || "unknown";

        console.log(`[AUDIT_DEBUG] Inserting into DB... IP: ${ipAddress}`);
        await db.insert(auditLogs).values({
            userId,
            action,
            status,
            details,
            ipAddress,
            userAgent,
        });
        console.log(`[AUDIT_DEBUG] Insert success!`);
    } catch (error) {
        console.error("[AUDIT_DEBUG] Failed to write audit log:", error);
        // We don't throw here to avoid breaking the main user flow if logging fails
    }
}
