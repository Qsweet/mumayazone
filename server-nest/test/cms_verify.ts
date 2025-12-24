
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3001/api';

async function main() {
    console.log('Starting CMS Verification...');

    // 0. Setup Test User
    const email = `instructor_${Date.now()}@test.com`;
    const password = 'password123';
    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name: 'Test Instructor',
            email,
            password_hash: hash,
            role: 'INSTRUCTOR',
            isVerified: true
        }
    });
    console.log(`Created Instructor: ${email}`);

    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const loginData = await loginRes.json();
        const accessToken = loginData.accessToken; // Check response structure (token or access_token)

        if (!accessToken) throw new Error('No access token in login response');

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

        // 2. Create Course
        console.log('Creating Course...');
        const courseSlug = `test-course-${Date.now()}`;
        const createRes = await fetch(`${BASE_URL}/courses`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                title: 'Test CMS Course',
                slug: courseSlug,
                description: 'Testing CMS features',
                price: 1000
            })
        });
        if (!createRes.ok) throw new Error(`Create Course failed: ${createRes.status}`);
        const course = await createRes.json();
        console.log('Course ID:', course.id);

        // 3. Add Modules
        console.log('Adding Modules...');
        const m1Res = await fetch(`${BASE_URL}/courses/${course.id}/modules`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ title: 'Module 1', order_index: 0 })
        });
        const m1 = await m1Res.json();

        const m2Res = await fetch(`${BASE_URL}/courses/${course.id}/modules`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ title: 'Module 2', order_index: 1 })
        });
        const m2 = await m2Res.json();

        // 4. Add Lesson to M1
        console.log('Adding Lesson...');
        await fetch(`${BASE_URL}/courses/modules/${m1.id}/lessons`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ title: 'Lesson 1', order_index: 0, content_text: 'Content' })
        });

        // 5. Reorder Modules (Swap)
        console.log('Reordering Modules...');
        const reorderRes = await fetch(`${BASE_URL}/courses/${course.id}/modules/reorder`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ ids: [m2.id, m1.id] })
        });
        if (!reorderRes.ok) throw new Error(`Reorder failed: ${reorderRes.status}`);

        // 6. Publish
        console.log('Publishing Course...');
        const pubRes = await fetch(`${BASE_URL}/courses/${course.id}/publish`, {
            method: 'PATCH',
            headers
        });
        if (!pubRes.ok) {
            const err = await pubRes.json();
            throw new Error(`Publish failed: ${JSON.stringify(err)}`);
        }
        console.log('Published successfully');

        // 7. Verify Public Access (Optional, if public API exists)
        // const publicRes = await fetch(`${BASE_URL}/courses/${courseSlug}`);
        // if (!publicRes.ok) throw new Error('Public access failed');

        console.log('✅ CMS Verification Passed!');

    } catch (e) {
        console.error('❌ Verification Failed:', e);
        process.exit(1);
    } finally {
        await prisma.user.delete({ where: { id: user.id } }); // Cleanup
        await prisma.$disconnect();
    }
}

main();
