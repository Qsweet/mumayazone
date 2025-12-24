export default function JsonLd({ locale }: { locale: string }) {
    const baseUrl = 'https://mumayazone.com';
    const enName = 'Mqudah Academy';
    const arName = 'أكاديمية القضاة';

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: locale === 'ar' ? arName : enName,
        url: baseUrl,
        logo: `${baseUrl}/images/mq-profile.jpg`,
        sameAs: [
            'https://linkedin.com/in/mohammad-qudah',
            // Add other social links here
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: 'admin@mumayazone.com',
        },
    };

    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: locale === 'ar' ? 'محمد القضاة' : 'Mohammad Qudah',
        url: baseUrl,
        jobTitle: locale === 'ar' ? 'مهندس رقمي' : 'Digital Architect',
        image: `${baseUrl}/images/mq-profile.jpg`,
        sameAs: [
            'https://linkedin.com/in/mohammad-qudah',
            'https://github.com/mqudah',
        ],
    };

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: locale === 'ar' ? arName : enName,
        url: baseUrl,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/${locale}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <section>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
        </section>
    );
}
