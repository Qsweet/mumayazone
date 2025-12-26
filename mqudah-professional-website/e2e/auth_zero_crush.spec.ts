import { test, expect } from '@playwright/test';
import { randomBytes } from 'crypto';

test.describe('Authentication System "Zero Crush" Test', () => {
    const uniqueId = randomBytes(4).toString('hex');
    const userEmail = `test.user.${uniqueId}@mumayazone.com`;
    const userPassword = 'StrongPassword123!';
    const userName = `Test User ${uniqueId}`;

    test('Complete User Journey: Register -> Login -> Dashboard -> Logout', async ({ page }) => {
        // 1. Navigate to Register
        console.log(`Starting Auth Test for ${userEmail}`);
        await page.goto('https://mumayazone.com/en/register');

        // Check if we are on the register page
        await expect(page).toHaveURL(/.*\/register/);
        await expect(page.locator('h1, h2')).toContainText(/Create Account|Join/i);

        // 2. Fill Registration Form
        await page.fill('input[name="name"]', userName);
        await page.fill('input[name="email"]', userEmail);
        await page.fill('input[name="password"]', userPassword);

        // Submit
        await page.click('button[type="submit"]');

        // 3. Verify Redirect to Dashboard (or Login then Dashboard)
        // Adjust timeout for production latency
        await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
        console.log('Registration successful, redirected to Dashboard');

        // 4. Logout
        await page.click('[data-testid="user-menu-button"], .user-menu-trigger'); // Adjust selector based on UI
        await page.click('text=Sign out', { timeout: 5000 });

        // Verify redirect to home or login
        await expect(page).toHaveURL(/.*\/login|.*\/$/);
        console.log('Logout successful');

        // 5. Login again to verify persistence
        await page.goto('https://mumayazone.com/en/login');
        await page.fill('input[name="email"]', userEmail);
        await page.fill('input[name="password"]', userPassword);
        await page.click('button[type="submit"]');

        // Verify Dashboard again
        await expect(page).toHaveURL(/.*\/dashboard/);
        console.log('Re-login successful. System is stable.');
    });
});
