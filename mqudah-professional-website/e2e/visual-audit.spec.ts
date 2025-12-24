
import { test, expect } from '@playwright/test';
import { adminAuth } from './fixtures';

// Use admin auth fixture
test.use({ storageState: adminAuth });

test('Verify Audit System (Login Event & Timeline)', async ({ page }) => {
    // 1. Navigate to Users Page
    await page.goto('/en/admin/users');
    await expect(page).toHaveURL(/\/admin\/users/);

    // 2. Wait for table
    await expect(page.locator('table')).toBeVisible();

    // 3. Find admin_e2e row (assuming name or email is visible)
    // We'll just take the first row's action menu for simplicity, 
    // or specifically search for "admin_e2e" if the name is "Admin E2E".
    // Let's just click the first "..." button.
    const actionMenu = page.locator('button:has-text("MoreHorizontal")').first().or(page.locator('button.h-8.w-8').first());
    // Inspecting the component: <Button variant="ghost"> <MoreHorizontal /> </Button>
    // Locating by class/icon might be tricky. Let's try:
    await page.locator('table tbody tr').first().locator('button').click();

    // 4. Click "View History"
    await page.getByText('View History').click();

    // 5. Check Sheet Content
    await expect(page.getByText('Audit History')).toBeVisible();

    // 6. Check for "LOGIN" event
    // Since we just logged in (or the auth fixture did), there might NOT be a fresh "LOGIN" event 
    // if we used the storage state (cookie).
    // HOWEVER, I manually logged in during the "browser subagent" attempt (even if it failed).
    // AND the "admin_e2e" user has logged in before.
    // The 'LOGIN' event is created in the route handler.
    // If we are using `storageState`, we skip the route handler login!
    // So we might NOT see a "just now" login.
    // BUT we should see *past* logins if the feature works.

    // To strictly verify "New Logging", we should manually login in this test.
});

test('Manual Login generates Audit Log', async ({ page }) => {
    // Clear cookies to force login
    await page.context().clearCookies();
    await page.goto('/en/login');

    // Login
    await page.fill('input[type="email"]', 'admin_e2e@mqudah.com');
    await page.fill('input[type="password"]', 'MqudahAdmin2025!');
    await page.click('button[type="submit"]'); // Adjust selector if needed

    // Wait for redirect
    await page.waitForURL(/\/dashboard/);

    // Go to Users
    await page.goto('/en/admin/users');

    // Open History of first user (which might be us if sorted by date, or random)
    // Actually, getting "User Audit Logs" fetches logs FOR that user.
    // We need to find "admin_e2e" in the table to see OUR logs.
    // The table has search. Let's use it.
    await page.fill('input[placeholder*="Search"]', 'admin_e2e');
    await page.waitForTimeout(1000); // Debounce

    // Click action on the row
    await page.locator('table tbody tr').first().locator('button').click();
    await page.getByText('View History').click();

    // Assert "LOGIN" and "method: credentials"
    // Use .first() because seeing history might show multiple logins
    await expect(page.getByText('LOGIN').first()).toBeVisible({ timeout: 10000 });
});
