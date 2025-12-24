
import { test as setup, expect } from '@playwright/test';

const adminFile = '.auth/admin.json';
const userFile = '.auth/user.json'; // We will add user later if needed

setup('authenticate as admin', async ({ page }) => {
    // 1. Perform Login
    await page.goto('/en/login');

    // Using robust ID selectors found during manual verification
    await page.fill('#email-address', 'admin_e2e@mqudah.com'); // Validated Seed User
    await page.fill('#password', 'MqudahAdmin2025!');

    await page.click('button[type="submit"]');

    // 2. Wait for Redirect
    await page.waitForURL(/\/dashboard/);
    await expect(page.getByText('Dashboard Overview')).toBeVisible();

    // 3. Save State
    await page.context().storageState({ path: adminFile });
});
