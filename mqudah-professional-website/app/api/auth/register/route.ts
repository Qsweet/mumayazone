
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, signToken } from "@/lib/auth-server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const existing = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (existing) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password);


        const [newUser] = await db.insert(users).values({
            id: crypto.randomUUID(), // Manually generate ID for text column compatibility
            name,
            email,
            passwordHash: hashedPassword,
            role: "user",
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        const token = await signToken({
            sub: newUser.id,
            email: newUser.email,
            role: newUser.role,
        });

        const response = NextResponse.json({
            accessToken: token,
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
        }, { status: 201 });

        response.cookies.set("refresh_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400, // 1 day
        });

        return response;

    } catch (e: any) {
        console.error("Register Error:", e);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
