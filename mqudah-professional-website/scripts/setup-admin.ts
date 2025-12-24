import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
    const email = "manual_admin@example.com";
    const password = "password123";

    console.log("Setting up admin user:", email);

    // Check if exists
    const existing = await db.query.users.findFirst({ where: eq(users.email, email) });

    if (existing) {
        console.log("User exists. Updating role to admin.");
        await db.update(users).set({ role: 'admin' }).where(eq(users.email, email));
        // Reset password just in case
        const hash = await bcrypt.hash(password, 10);
        await db.update(users).set({ passwordHash: hash }).where(eq(users.email, email));
        console.log("Password reset to:", password);
    } else {
        const hash = await bcrypt.hash(password, 10);
        await db.insert(users).values({
            email,
            name: "Manual Admin",
            passwordHash: hash,
            role: "admin",
            isVerified: true
        });
        console.log("Created Manual Admin user.");
    }
    process.exit(0);
}

main().catch(err => {
    console.error("Error setting up admin:", err);
    process.exit(1);
});
