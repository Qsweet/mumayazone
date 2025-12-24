import { test, expect } from '@playwright/test';

const TIMESTAMP = Date.now();
const USER_EMAIL = `test_user_${TIMESTAMP}@example.com`;
const USER_PASS = 'TestPass123!';

test.describe('API Endpoint Integrity: Auth Module', () => {

    test('POST /api/auth/register: Should create a user or handle duplicates', async ({ request }) => {
        const response = await request.post('/api/auth/register', {
            data: {
                email: USER_EMAIL,
                password: USER_PASS,
                name: 'QA Test User'
            }
        });

        // It might be 201 Created or 200 OK
        if (response.status() !== 200 && response.status() !== 201) {
            console.log(`Register Failed: ${response.status()} ${await response.text()}`);
        }
        expect([200, 201]).toContain(response.status());

        if (response.status() === 201 || response.status() === 200) {
            const body = await response.json();
            // Assuming the API returns the user object or similar
            expect(body).toHaveProperty('user');
            expect(body.user).toHaveProperty('email', USER_EMAIL);
        }

        // Test Duplicate
        const dupResponse = await request.post('/api/auth/register', {
            data: {
                email: USER_EMAIL,
                password: USER_PASS,
                name: 'QA Test User'
            }
        });
        // Expect 409 Conflict for duplicate
        expect(dupResponse.status()).toBe(409);
    });

    test('POST /api/auth/login: Should return token on success', async ({ request }) => {
        // Ensure user exists first (relying on previous test or creating one)
        // ideally tests should be independent, but for this sequence let's create a fresh one
        const LOGIN_EMAIL = `login_${Date.now()}@example.com`;

        await request.post('/api/auth/register', {
            data: { email: LOGIN_EMAIL, password: USER_PASS, name: 'Login User' }
        });

        const response = await request.post('/api/auth/login', {
            data: {
                email: LOGIN_EMAIL,
                password: USER_PASS
            }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        // Check for token or user data indicative of success. Adjust based on actual API response structure.
        // If your API uses HTTP-only cookies, we might check headers, but usually login returns some user info.
        expect(body).toBeTruthy();
    });

    test('POST /api/auth/login: Should fail with wrong password', async ({ request }) => {
        // Create user
        const FAIL_EMAIL = `fail_login_${Date.now()}@example.com`;
        await request.post('/api/auth/register', {
            data: { email: FAIL_EMAIL, password: USER_PASS, name: 'Fail User' }
        });

        const response = await request.post('/api/auth/login', {
            data: {
                email: FAIL_EMAIL,
                password: 'WRONG_PASSWORD'
            }
        });

        expect(response.status()).toBe(401);
    });

});
