
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, signToken } from "@/lib/auth-server";
import { logEvent } from "@/lib/services/audit";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;



        if (!email || !password) {

            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) {

            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }




        const isValid = await verifyPassword(password, user.passwordHash);


        if (!isValid) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const token = await signToken({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        // Audit Log
        await logEvent(user.id, 'LOGIN', {
            method: 'credentials'
        });

        const response = NextResponse.json({
            accessToken: token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            mfaRequired: false // Simplify for now
        });

        response.cookies.set("refresh_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400, // 1 day
        });

        return response;

    } catch (e: any) {
        console.error("Login Error:", e);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
