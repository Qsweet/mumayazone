'use server';

import { getUserById, updateUserPermissions } from "@/lib/db/access/users";
import { getAuditLogsForUser } from "@/lib/db/access/audit";
import { signToken } from "@/lib/auth-server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Helper to check Super Admin permission
// In a real app, we'd use a robust verifySession() here.
// For checked speed, we decode the cookie directly or assume middleware has done some checks,
// but for sensitive actions we MUST double check.
import { verifyToken } from "@/lib/auth-server";
import { logEvent } from "@/lib/services/audit";

async function requireSuperAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('refresh_token')?.value;
    if (!token) throw new Error("Unauthorized");

    const payload = await verifyToken(token);
    if (!payload) throw new Error("Invalid Token");

    // Fetch fresh user from DB to catch permission changes immediately
    const user = await getUserById(payload.sub);
    if (!user) throw new Error("User not found");

    // Check for Wildcard Capability
    const permissions = user.permissions as string[];
    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('*');

    // Also allow the hardcoded Owner email as fallback
    if (!isSuperAdmin && user.email !== 'qudah@mumayazone.com') {
        throw new Error("Forbidden: Super Admin Access Required");
    }

    return user;
}

export async function togglePermissionAction(targetUserId: string, capability: string, enable: boolean) {
    try {
        await requireSuperAdmin();
        const targetUser = await getUserById(targetUserId);
        if (!targetUser) throw new Error("Target user not found");

        let currentPerms = (targetUser.permissions as string[]) || [];

        // Normalize array
        if (!Array.isArray(currentPerms)) currentPerms = [];

        if (enable) {
            if (!currentPerms.includes(capability)) {
                currentPerms.push(capability);
            }
        } else {
            currentPerms = currentPerms.filter(p => p !== capability);
        }


        await updateUserPermissions(targetUserId, currentPerms);

        // Audit Log
        const adminUser = await requireSuperAdmin();
        await logEvent(adminUser.id, 'UPDATE_USER_PERMISSIONS', {
            target_user_id: targetUserId,
            capability,
            action: enable ? 'grant' : 'revoke',
            diff: {
                permissions: {
                    old: enable ? currentPerms.filter(p => p !== capability) : [...currentPerms, capability],
                    new: currentPerms
                }
            }
        });

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function impersonateUserAction(targetUserId: string) {
    try {
        const adminUser = await requireSuperAdmin(); // Audit log: Admin X impersonated Y

        const targetUser = await getUserById(targetUserId);
        if (!targetUser) throw new Error("Target user not found");

        // Generate Token for the TARGET user
        const token = await signToken({
            sub: targetUser.id,
            email: targetUser.email,
            role: targetUser.role,
            impersonator_id: adminUser.id // Audit trail in token
        });

        // Set the cookie
        const cookieStore = await cookies();
        cookieStore.set("refresh_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600, // 1 hour impersonation limit
        });

        await logEvent(adminUser.id, 'IMPERSONATE', {
            target_user_id: targetUserId,
            target_email: targetUser.email
        });

        return { success: true, redirectUrl: '/en/dashboard' };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function revokeSessionAction(targetUserId: string) {
    // In a stateless JWT setup, this usually means adding the user to a "blacklist" or rotating a version counter.
    // For this MVP, we might just delete the user's refresh tokens from the DB if we had a table, 
    // BUT our current simple auth is stateless cookie only.
    // To truly revoke, we'd need to change the 'token_version' in the user record and check it in middleware.
    // Let's implement a 'token_version' bump.
    return { success: false, error: "Not implemented: Requires token_version column migration" };
}

export async function getUserAuditLogsAction(userId: string) {
    try {
        await requireSuperAdmin();
        const logs = await getAuditLogsForUser(userId);
        return { success: true, data: logs };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
