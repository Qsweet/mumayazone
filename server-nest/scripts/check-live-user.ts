
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
    try {
        const count = await prisma.user.count();
        console.log('Total users in DB:', count);

        const allUsers = await prisma.user.findMany({
            take: 5,
            select: { id: true, email: true, role: true }
        });
        console.log('All Users:', JSON.stringify(allUsers, null, 2));

    } catch (error) {
        console.error('Error checking user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
