
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
    try {
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@mqudah.com' },
        });
        console.log('Admin User:', admin);
    } catch (error) {
        console.error('Error checking admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAdmin();
