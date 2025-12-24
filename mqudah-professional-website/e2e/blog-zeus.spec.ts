
import { test, expect } from '@playwright/test';

test.describe('ZEUS Blog System', () => {

    // We assume the admin user exists from previous setup or seeds
    // For specific test isolation, we might usually create a fresh user, 
    // but here we use the global admin state if available or login.

    test('Admin can create post with SEO metadata and it appears on public page', async ({ page }) => {
        // 1. Login


        await page.goto('/en/login');
        await page.fill('input[name="email"]', 'admin_e2e@mqudah.com');
        await page.fill('input[name="password"]', 'MqudahAdmin2025!');
        await page.click('button[type="submit"]');
        await page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 });
        await expect(page).toHaveURL(/.*\/admin.*/);

        // 2. Create Post
        await page.goto('/en/admin/blog/new');

        const timestamp = Date.now();
        const postTitle = `ZEUS Test ${timestamp}`;
        const seoTitle = `ZEUS SEO Title ${timestamp}`;
        const seoDesc = `ZEUS Description for test ${timestamp}`;

        // 3. Fill Creation Form
        await page.fill('input[name="title"]', postTitle);
        await page.getByRole('button', { name: "Create Draft & Open Editor" }).click();

        // Wait for redirect to edit page (UUID pattern)
        await expect(page).toHaveURL(/\/admin\/blog\/[a-zA-Z0-9-]+/);


        // 3. Verify Title persisted
        await expect(page.locator('input[name="title"]')).toHaveValue(postTitle);


        // 4. Go to SEO Tab
        await page.getByRole('tab', { name: 'ZEUS SEO & AI' }).click();

        // 5. Fill SEO Fields
        await page.getByPlaceholder("Optimized title...").fill(seoTitle);
        await page.getByPlaceholder("Meta description...").fill(seoDesc);

        // 6. Add Tag
        const tagInput = page.getByPlaceholder("Add tag and press Enter...");
        await tagInput.fill('zeus-tag');
        await tagInput.press('Enter');

        // 7. Publish
        // Switch back to Content tab to access Publishing settings
        await page.getByRole('tab', { name: "Content Editor" }).click();

        // 7. Publish
        // Switch is a button with role switch
        await page.getByRole('switch', { name: 'Published' }).click();

        // 8. Save
        // Submit via Enter key to avoid button click issues
        await page.locator('input[name="title"]').press('Enter');
        await expect(page.getByText('Post updated!')).toBeVisible({ timeout: 15000 });

        // 9. Verify Public Page
        // Construct slug from title (simple slugify logic used in app)
        const slug = postTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await page.goto(`/en/blog/${slug}`);

        // Check Title
        await expect(page).toHaveTitle(seoTitle);

        // Check Meta Description
        const metaDesc = page.locator('meta[name="description"]');
        await expect(metaDesc).toHaveAttribute('content', seoDesc);

        // Check JSON-LD
        const jsonLd = page.locator('script[id="json-ld-article"]');
        await expect(jsonLd).toBeAttached(); // Wait for it
        const jsonContent = await jsonLd.innerText();
        const parsedJson = JSON.parse(jsonContent);

        expect(parsedJson.headline).toBe(seoTitle);
        expect(parsedJson.description).toBe(seoDesc);
        expect(parsedJson['@type']).toBe('BlogPosting');
    });
});

