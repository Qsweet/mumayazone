
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    timeout: 60000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'line',
    use: {
        baseURL: 'http://localhost:3000', // Local Development
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    // We don't need webServer if testing against live site
    // webServer: { ... }, 
    projects: [
        {
            name: 'setup',
            testMatch: /.*\.setup\.ts/,
        },
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: '.auth/admin.json',
            },
            dependencies: ['setup'],
        },
    ],
});
