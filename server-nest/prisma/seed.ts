
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@mqudah.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                id: 'f67b3d25-5c75-4e02-91a2-d73cf10d4892',
                name: 'Admin User',
                email: adminEmail,
                password_hash: '$2b$10$sG5mdmBcgpeAypCwZpaNye7Dref0tswIbQ7JRGJ61/A6cNF2dNyoe',
                role: UserRole.ADMIN,
                isVerified: true,
            },
        });
        console.log('Admin user seeded');
    } else {
        console.log('Admin user already exists');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
