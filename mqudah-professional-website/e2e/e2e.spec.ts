
import { test, expect } from '@playwright/test';

// Credentials for UI check within the test if needed (though fixture handles session)
const USER_EMAIL = 'admin_e2e@mqudah.com';

test.describe('E2E Production Suite', () => {

    // Scenario A: Public Homepage
    test('Scenario A: Homepage Loads & Redirects', async ({ page }) => {
        // Clear cookies for this test to simulate public user
        await page.context().clearCookies();
        await page.goto('/');

        // Should redirect to /[locale]
        await expect(page).toHaveURL(/\/en|\/ar/);
        await expect(page).toHaveTitle(/Qudah/i);
        await expect(page.locator('text=Login').first()).toBeVisible();
    });

    // Scenario B: Admin Dashboard (Using Auth Fixture)
    test('Scenario B: Admin Access (Authenticated)', async ({ page }) => {
        // Because of 'storageState: .auth/admin.json', we are already logged in
        await page.goto('/en/admin/dashboard');

        // Verify Dashboard Elements
        await expect(page.locator('h1', { hasText: 'Dashboard Overview' })).toBeVisible({ timeout: 15000 });
        await expect(page.getByText('Total Revenue', { exact: true })).toBeVisible();

        // Verify RBAC: Can see "Settings" or sensitive area
        // await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
    });

    // Scenario C: Register Page Availability
    test('Scenario C: Register Page Loads', async ({ page }) => {
        await page.context().clearCookies();
        await page.goto('/en/register');
        await expect(page).toHaveURL(/register/);
        // Check for email input which is definitely there
        await expect(page.locator('input[type="email"], #email, #email-address').first()).toBeVisible();
    });
});
