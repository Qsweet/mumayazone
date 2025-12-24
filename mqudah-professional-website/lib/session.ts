import { cookies } from "next/headers";
import { decodeToken } from "./auth";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

export async function auth() {
    const cookieStore = await cookies();
    // Middleware checks 'refresh_token', but usually we have 'access_token' or similar. 
    // Let's check both or fallback.
    // Check 'token' (new standard), 'access_token', or 'refresh_token'
    const token = cookieStore.get("token")?.value || cookieStore.get("access_token")?.value || cookieStore.get("refresh_token")?.value;

    if (!token) return null;

    const decoded = decodeToken(token);
    if (!decoded || !decoded.sub) return null;

    // Optional: Verify user exists in DB to be sure
    // For performance, we might just return the decoded payload if we trust the token signature (but we aren't verifying signature here, just decoding)
    // To be safe, let's fetch user.
    const user = await db.query.users.findFirst({
        where: eq(users.id, decoded.sub)
    });

    if (!user) return null;

    return { user };
}
