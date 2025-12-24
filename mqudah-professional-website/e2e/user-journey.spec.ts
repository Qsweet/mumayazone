import { test, expect } from '@playwright/test';

test.describe('User Journey & Content Verification', () => {

    test('Guest Path: Navigation Flow', async ({ page }) => {
        // 1. Home
        console.log(' Visiting Home...');
        await page.goto('/en');
        await expect(page).toHaveTitle(/Qudah|Mohammad/i);

        // 2. Services
        console.log(' Visiting Services...');
        await page.goto('/en/services');
        // "Professional Services"
        await expect(page.getByRole('heading', { name: 'Professional Services' })).toBeVisible();

        // 3. Courses (Content Module)
        console.log(' Visiting Courses...');
        await page.goto('/en/courses');
        // "Professional Training Programs"
        await expect(page.getByRole('heading', { name: 'Professional Training Programs' })).toBeVisible();

        // Check if either course grid or empty state is visible
        const courseGrid = page.locator('.grid');
        const emptyState = page.getByText('New Courses Launching Soon');
        await expect(courseGrid.or(emptyState).first()).toBeVisible();

        // 4. Workshops (Content Module)
        console.log(' Visiting Workshops...');
        await page.goto('/en/workshops');
        // Expect header "Workshops" or H1
        await expect(page.locator('h1')).toBeVisible();

        // 5. Login
        console.log(' Visiting Login...');
        await page.goto('/en/login');
        // "Sign in to your account"
        await expect(page.getByRole('heading', { name: /Sign in|Login/i })).toBeVisible();
        await expect(page.locator('input[type="email"]')).toBeVisible();
    });

    test('RBAC: Guest Access to Admin Blocked', async ({ page }) => {
        await page.context().clearCookies(); // Force clear
        await page.goto('/en/admin');
        // Should redirect to login
        await expect(page).toHaveURL(/.*login.*/);
    });

    test('RBAC: Admin Access Allowed', async ({ page }) => {
        // Use the Smoke Test Admin credentials
        const ADMIN_EMAIL = 'admin_e2e@mqudah.com'; // From smoke.spec.ts
        const ADMIN_PASS = 'MqudahAdmin2025!';

        console.log(' Logging in as Admin...');
        await page.goto('/en/login');
        await page.fill('input[type="email"]', ADMIN_EMAIL);
        await page.fill('input[type="password"]', ADMIN_PASS);
        await page.click('button[type="submit"]');

        await page.waitForURL(/\/dashboard/);

        // Go to Admin
        console.log(' Visiting Admin Dashboard...');
        await page.goto('/en/admin/dashboard');

        // "Dashboard Overview"
        await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();
    });

});
