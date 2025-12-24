
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === 'ar' ? 'سياسة الخصوصية | مقداح' : 'Privacy Policy | Mqudah',
    };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const isAr = locale === 'ar';

    return (
        <div className="min-h-screen bg-background pt-24 pb-20" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold font-serif mb-8">
                    {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </h1>

                <div className="prose prose-invert prose-lg max-w-none bg-card/50 p-8 rounded-2xl border border-border">
                    <p className="lead">
                        {isAr
                            ? 'نحن في منصة مقداح نأخذ خصوصيتك على محمل الجد. توضح هذه الوثيقة كيفية جمعنا واستخدامنا لبياناتك.'
                            : 'At Mqudah Platform, we take your privacy seriously. This document outlines how we collect and use your data.'
                        }
                    </p>

                    <h3>1. {isAr ? 'جمع البيانات' : 'Data Collection'}</h3>
                    <p>
                        {isAr
                            ? 'نقوم بجمع البيانات التي تقدمها لنا طواعية عند التسجيل في الدورات أو الاشتراك في النشرة البريدية.'
                            : 'We collect data that you voluntarily provide when enrolling in courses or subscribing to our newsletter.'
                        }
                    </p>

                    <h3>2. {isAr ? 'استخدام المعلومات' : 'Use of Information'}</h3>
                    <p>
                        {isAr
                            ? 'نستخدم معلوماتك لتحسين خدماتنا وتخصيص تجربتك التعليمية.'
                            : 'We use your information to improve our services and personalize your learning experience.'
                        }
                    </p>

                    <h3>3. {isAr ? 'حماية البيانات' : 'Data Protection'}</h3>
                    <p>
                        {isAr
                            ? 'نطبق تدابير أمنية صارمة لحماية بياناتك من الوصول غير المصرح به.'
                            : 'We implement strict security measures to protect your data from unauthorized access.'
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
