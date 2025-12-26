const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Attempting to create user with CORRECT params...');

        // Check if user exists first to clean up
        const email = 'debug.repro.v2@mumayazone.com';
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            console.log('Deleting existing test user...');
            await prisma.user.delete({ where: { email } });
        }

        const user = await prisma.user.create({
            data: {
                email: email,
                name: 'Debug Repro 2',
                password_hash: '$2b$12$PcXS.7...',
                role: 'STUDENT',
                // rely on defaults for isVerified, isMfaEnabled
                // currentHashedRefreshToken is optional
            }
        });
        console.log('User created successfully:', user);
    } catch (e) {
        console.error('---------------- ERROR DETIALS ----------------');
        console.error(e);
        console.error('-----------------------------------------------');
    } finally {
        await prisma.$disconnect();
    }
}

main();
