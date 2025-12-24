
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function updatePassword() {
    const email = 'admin@mqudah.com';
    const newPassword = 'MqudahAdmin2025!';

    try {
        const hash = await bcrypt.hash(newPassword, 10);
        console.log('Generated Hash:', hash);

        const user = await prisma.user.update({
            where: { email },
            data: { password_hash: hash }
        });

        console.log('Password updated for:', user.email);
    } catch (error) {
        console.error('Error updating password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updatePassword();
