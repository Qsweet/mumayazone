import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/private/', '/wp-content/uploads/wpforms/'],
            }
        ],
        sitemap: [
            'https://mumayazone.com/sitemap/en.xml',
            'https://mumayazone.com/sitemap/ar.xml',
        ],
    };
}
