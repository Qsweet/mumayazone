
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { count, desc, eq, ilike, or, sql } from "drizzle-orm";

export async function getUsersPaginated(page: number = 1, limit: number = 10, search?: string) {
    const offset = (page - 1) * limit;

    const whereClause = search
        ? or(
            ilike(users.email, `%${search}%`),
            ilike(users.name, `%${search}%`)
        )
        : undefined;

    const [data, totalResult] = await Promise.all([
        db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            isVerified: users.isVerified,
            permissions: users.permissions,
            lastActive: users.updatedAt, // Using updatedAt as proxy for now
            createdAt: users.createdAt,
        })
            .from(users)
            .where(whereClause)
            .limit(limit)
            .offset(offset)
            .orderBy(desc(users.createdAt)),

        db.select({ count: count() })
            .from(users)
            .where(whereClause)
    ]);

    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
        data,
        metadata: {
            total,
            totalPages,
            currentPage: page,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
}

export async function getUserById(userId: string) {
    return db.query.users.findFirst({
        where: eq(users.id, userId)
    });
}

export async function updateUserRole(userId: string, role: 'user' | 'admin' | 'instructor') {
    return db.update(users)
        .set({ role })
        .where(eq(users.id, userId))
        .returning();
}

export async function updateUserPermissions(userId: string, permissions: any) {
    return db.update(users)
        .set({ permissions })
        .where(eq(users.id, userId))
        .returning();
}

export async function deleteUser(userId: string) {
    // Soft delete implementation
    return db.update(users)
        .set({ deletedAt: new Date() })
        .where(eq(users.id, userId));
}
