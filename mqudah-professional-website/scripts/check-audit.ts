
import "dotenv/config";
import { db } from "../lib/db";
import { users, auditLogs } from "../lib/db/schema";
import { eq, desc } from "drizzle-orm";

async function check() {
    const targetEmail = "admin_e2e@mqudah.com";
    console.log("Checking logs for:", targetEmail);

    const user = await db.query.users.findFirst({
        where: eq(users.email, targetEmail)
    });

    if (!user) {
        console.log("User not found!");
        return;
    }

    console.log("User ID:", user.id);
    console.log("User Permissions:", user.permissions);

    const logs = await db.query.auditLogs.findMany({
        where: eq(auditLogs.userId, user.id),
        orderBy: [desc(auditLogs.createdAt)],
        limit: 5
    });

    console.log("Audit Logs Found:", logs.length);
    console.log(logs);
}

check().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
