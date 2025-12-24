
import { test } from '@playwright/test';

export function useGuestSession() {
    test.use({ storageState: { cookies: [], origins: [] } });
}
