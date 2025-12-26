const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Attempting to create user...');
        // Mimic the AuthService.register call
        // AuthService uses:
        // ...createUserDto,
        // password: hashedPassword,
        // role: UserRole.STUDENT (default)
        const user = await prisma.user.create({
            data: {
                email: 'debug.repro.v1@mumayazone.com',
                name: 'Debug Repro',
                password_hash: '$2b$12$PcXS...', // Dummy hash
                role: 'STUDENT',
                is_verified: false,
                // The service doesn't set other fields explicitly, relying on defaults
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
