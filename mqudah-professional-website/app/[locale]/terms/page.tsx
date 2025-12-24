
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === 'ar' ? 'شروط الخدمة | مقداح' : 'Terms of Service | Mqudah',
    };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const isAr = locale === 'ar';

    return (
        <div className="min-h-screen bg-background pt-24 pb-20" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold font-serif mb-8">
                    {isAr ? 'شروط الخدمة' : 'Terms of Service'}
                </h1>

                <div className="prose prose-invert prose-lg max-w-none bg-card/50 p-8 rounded-2xl border border-border">
                    <p className="lead">
                        {isAr
                            ? 'باستخدامك لمنصة مقداح، فإنك توافق على الالتزام بالشروط والأحكام التالية.'
                            : 'By using Mqudah Platform, you agree to be bound by the following terms and conditions.'
                        }
                    </p>

                    <h3>1. {isAr ? 'قبول الشروط' : 'Acceptance of Terms'}</h3>
                    <p>
                        {isAr
                            ? 'يعد وصولك إلى المنصة واستخدامها موافقة صريحة على هذه الشروط.'
                            : 'Accessing and using the platform constitutes your express agreement to these terms.'
                        }
                    </p>

                    <h3>2. {isAr ? 'الملكية الفكرية' : 'Intellectual Property'}</h3>
                    <p>
                        {isAr
                            ? 'جميع المحتويات الموجودة على المنصة هي ملك لمقداح أو مرخصيها.'
                            : 'All content on the platform is the property of Mqudah or its licensors.'
                        }
                    </p>

                    <h3>3. {isAr ? 'سلوك المستخدم' : 'User Conduct'}</h3>
                    <p>
                        {isAr
                            ? 'توافق على عدم استخدام المنصة لأي غرض غير قانوني أو محظور.'
                            : 'You agree not to use the platform for any unlawful or prohibited purpose.'
                        }
                    </p>

                    <p className="text-sm text-muted-foreground mt-8">
                        {isAr ? 'آخر تحديث: 2025/01/01' : 'Last Updated: Jan 1, 2025'}
                    </p>
                </div>
            </div>
        </div>
    );
}
