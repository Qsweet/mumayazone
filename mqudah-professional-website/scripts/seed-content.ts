
import { db } from "../lib/db";
import { blogPosts, users } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import * as dotenv from 'dotenv';
dotenv.config();

const contentAI = `
<h2>The Rise of Agentic AI</h2>
<p>Artificial Intelligence is shifting from passive tools (Chatbots) to active agents that can plan, execute, and verify tasks. This "Agentic Workflow" is the future of software development.</p>
<h3>Key Characteristics</h3>
<ul>
<li><strong>Autonomy:</strong> Agents can make decisions without constant human oversight.</li>
<li><strong>Tool Use:</strong> They can access terminals, browsers, and file systems.</li>
<li><strong>Memory:</strong> Long-term context retention allows for complex projects.</li>
</ul>
<p>At Mqudah, we are leveraging these technologies to build the next generation of educational tools.</p>
`;

const contentAI_Ar = `
<h2>صعود الذكاء الاصطناعي الوكيل</h2>
<p>يتحول الذكاء الاصطناعي من أدوات سلبية (روبوتات الدردشة) إلى وكلاء نشطين يمكنهم التخطيط والتنفيذ والتحقق من المهام. هذا "سير العمل الوكيل" هو مستقبل تطوير البرمجيات.</p>
<h3>الخصائص الرئيسية</h3>
<ul>
<li><strong>الاستقلالية:</strong> يمكن للوكلاء اتخاذ القرارات دون إشراف بشري مستمر.</li>
<li><strong>استخدام الأدوات:</strong> يمكنهم الوصول إلى المحطات والمتصفحات وأنظمة الملفات.</li>
<li><strong>الذاكرة:</strong> يسمح الاحتفاظ بالسياق طويل المدى بمشاريع معقدة.</li>
</ul>
<p>في مقداح، نحن نستفيد من هذه التقنيات لبناء الجيل القادم من الأدوات التعليمية.</p>
`;

const posts = [
    {
        slug: 'agentic-ai-future',
        title: 'Agentic AI: The Future of Coding',
        titleAr: 'الذكاء الاصطناعي الوكيل: مستقبل البرمجة',
        excerpt: 'How AI agents are transforming software engineering from chat-based assistance to autonomous execution.',
        excerptAr: 'كيف يقوم وكلاء الذكاء الاصطناعي بتحويل هندسة البرمجيات من المساعدة القائمة على الدردشة إلى التنفيذ المستقل.',
        content: contentAI,
        contentAr: contentAI_Ar,
        isPublished: true,
        categoryName: 'Artificial Intelligence'
    },
    {
        slug: 'nextjs-15-deep-dive',
        title: 'Deep Dive into Next.js 15',
        titleAr: 'غوص عميق في Next.js 15',
        excerpt: 'Exploring the new features of Next.js 15, including Partial Prerendering and enhanced caching strategies.',
        excerptAr: 'استكشاف الميزات الجديدة لـ Next.js 15، بما في ذلك العرض المسبق الجزئي واستراتيجيات التخزين المؤقت المحسنة.',
        content: '<p>Next.js 15 brings stability and performance...</p>',
        contentAr: '<p>يجلب Next.js 15 الاستقرار والأداء...</p>',
        isPublished: true,
        categoryName: 'Web Development'
    },
    {
        slug: 'arabic-nlp-challenges',
        title: 'Challenges in Arabic NLP',
        titleAr: 'تحديات معالجة اللغة الطبيعية العربية',
        excerpt: 'Why Arabic poses unique challenges for Large Language Models and how we are solving them.',
        excerptAr: 'لماذا تشكل اللغة العربية تحديات فريدة لنماذج اللغة الكبيرة وكيف نقوم بحلها.',
        content: '<p>Arabic morphology is complex...</p>',
        contentAr: '<p>الصرف العربي معقد...</p>',
        isPublished: true,
        categoryName: 'Data Science'
    },
    {
        slug: 'mqudah-vision-2025',
        title: 'The Mqudah Vision 2025',
        titleAr: 'رؤية مقداح 2025',
        excerpt: 'Our roadmap for bridging the gap between academic theory and professional industry standards.',
        excerptAr: 'خارطة طريقنا لسد الفجوة بين النظرية الأكاديمية ومعايير الصناعة المهنية.',
        content: '<p>We aim to empower 1 million developers...</p>',
        contentAr: '<p>نهدف لتمكين مليون مطور...</p>',
        isPublished: true,
        categoryName: 'Company News'
    },
    {
        slug: 'mastering-typescript',
        title: 'Mastering TypeScript Generics',
        titleAr: 'إتقان أنواع TypeScript العامة',
        excerpt: 'A comprehensive guide to understanding and using Generics in TypeScript for type-safe code.',
        excerptAr: 'دليل شامل لفهم واستخدام Generics في TypeScript للحصول على كود آمن النوع.',
        content: '<p>Generics allow needed flexibility...</p>',
        contentAr: '<p>تسمح Generics بالمرونة المطلوبة...</p>',
        isPublished: true,
        categoryName: 'Programming'
    }
];

async function main() {
    console.log("🌱 Seeding Content...");

    // Ensure author exists
    let author = await db.query.users.findFirst();
    if (!author) {
        // Create Admin user
        const result = await db.insert(users).values({
            email: "admin@mqudah.com",
            name: "Mohammad Al-Qudah",
            passwordHash: "$2a$10$placeholder", // bcrypt placeholder
            role: "admin",
            isVerified: true
        }).returning();
        author = result[0];
        console.log("Created Admin User");
    }

    for (const post of posts) {
        // Upsert logic (check if exists)
        const existing = await db.query.blogPosts.findFirst({
            where: eq(blogPosts.slug, post.slug)
        });

        if (!existing) {
            await db.insert(blogPosts).values({
                title: post.title,
                titleAr: post.titleAr,
                slug: post.slug,
                excerpt: post.excerpt,
                excerptAr: post.excerptAr,
                content: post.content,
                contentAr: post.contentAr,
                isPublished: post.isPublished,
                authorId: author.id,
                publishedAt: new Date(),
            });
            console.log(`+ Created: ${post.title}`);
        } else {
            await db.update(blogPosts).set({
                title: post.title,
                titleAr: post.titleAr,
                excerpt: post.excerpt,
                excerptAr: post.excerptAr,
                content: post.content,
                contentAr: post.contentAr,
            }).where(eq(blogPosts.id, existing.id));
            console.log(`~ Updated: ${post.title}`);
        }
    }

    console.log("✅ Seeding Complete");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
