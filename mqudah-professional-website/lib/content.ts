
import { db } from "@/lib/db";
import { siteContent } from "@/lib/db/schema"; // Import table
import { redis } from "@/lib/redis";
import { and, eq, inArray } from "drizzle-orm";

// CACHE KEYS
const CACHE_PREFIX = 'content:';
const TTL = 60 * 60 * 24; // 24 hours

export async function getContents(keys: string[], lang: 'en' | 'ar'): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    const cacheKeys = keys.map(k => `${CACHE_PREFIX}${lang}:${k}`);

    // 1. Try Redis
    let cachedValues: (string | null)[] = [];
    try {
        cachedValues = await redis.mget(cacheKeys);
    } catch (e) {
        // Redis failure, fallback to empty array to force DB fetch
        console.error("Redis MGET failed", e);
        cachedValues = new Array(keys.length).fill(null);
    }

    const missingKeys: string[] = [];

    keys.forEach((key, index) => {
        const val = cachedValues[index];
        if (val !== null) {
            result[key] = val;
        } else {
            missingKeys.push(key);
        }
    });

    // 2. Fetch Missing from DB
    if (missingKeys.length > 0) {
        // Query Logic: Select * WHERE lang = lang AND key IN missingKeys
        const dbItems = await db.query.siteContent.findMany({
            where: and(
                eq(siteContent.language, lang),
                inArray(siteContent.key, missingKeys)
            )
        });

        // 3. Populate Cache
        if (dbItems.length > 0) {
            const pipeline = redis.pipeline();
            dbItems.forEach(item => {
                result[item.key] = item.value;
                pipeline.set(`${CACHE_PREFIX}${lang}:${item.key}`, item.value, 'EX', TTL);
            });
            await pipeline.exec();
        }

        // 4. Fallback Logic (if still missing, try EN)
        const stillMissing = missingKeys.filter(k => !result[k]);
        if (stillMissing.length > 0 && lang !== 'en') {
            const fallbackValues = await getContents(stillMissing, 'en');
            Object.assign(result, fallbackValues);
        }

        // 5. Final Fallback (Placeholder)
        stillMissing.forEach(k => {
            if (!result[k]) {
                result[k] = `[MISSING: ${k}]`;
            }
        });
    }

    return result;
}

export async function invalidateContentCache(key: string, lang: string) {
    const cacheKey = `${CACHE_PREFIX}${lang}:${key}`;
    await redis.del(cacheKey);
}

export async function invalidateAllContent() {
    // Invalidate pattern content:*
    const keys = await redis.keys(`${CACHE_PREFIX}*`);
    if (keys.length > 0) {
        await redis.del(keys);
    }
}
