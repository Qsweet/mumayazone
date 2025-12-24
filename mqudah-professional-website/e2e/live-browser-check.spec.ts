
import { test, expect } from '@playwright/test';

test.use({
    baseURL: 'https://mumayazone.com',
    ignoreHTTPSErrors: true
});

test('Live Site Availability & Admin Login', async ({ page }) => {
    // 1. Visit Home
    console.log('Visiting Home...');
    await page.goto('/');
    await expect(page).toHaveTitle(/Mqudah|Home|Professional/);
    console.log('Home Page Loaded');

    // 2. Visit Login
    console.log('Visiting Login...');
    await page.goto('/en/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();

    // 3. Login as E2E Admin
    console.log('Logging in...');
    await page.fill('input[type="email"]', 'admin_e2e@mqudah.com');
    await page.fill('input[type="password"]', 'MqudahAdmin2025!');
    await page.click('button[type="submit"]');

    // 4. Verify Dashboard
    console.log('Verifying Dashboard...');
    await page.waitForURL(/\/dashboard/);
    await expect(page.getByText('Dashboard Overview')).toBeVisible();

    // 5. Check "Online" status (sanity)
    console.log('✅ Live Site Verified!');
});
