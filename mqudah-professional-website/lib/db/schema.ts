import { pgTable, text, timestamp, boolean, uuid, integer, jsonb, serial, pgEnum, primaryKey, unique, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'instructor']);
export const courseLevelEnum = pgEnum('course_level', ['beginner', 'intermediate', 'advanced']);
export const enrollmentStatusEnum = pgEnum('enrollment_status', ['active', 'completed', 'dropped']);

// Auth v2 Enums
export const mfaTypeEnum = pgEnum('mfa_type', ['TOTP', 'EMAIL']);
export const auditActionEnum = pgEnum('audit_action', [
    'LOGIN', 'LOGOUT', 'REFRESH', 'MFA_ENABLE', 'MFA_DISABLE', 'PASSWORD_CHANGE', 'SENSITIVE_ACCESS',
    'IMPERSONATE', 'UPDATE_USER_ROLE', 'UPDATE_USER_PERMISSIONS'
]);
export const auditStatusEnum = pgEnum('audit_status', ['SUCCESS', 'FAILURE']);
export const socialProviderEnum = pgEnum('social_provider', ['GOOGLE', 'GITHUB']);

// 3.2. Table-by-Table Breakdown from Professional Blueprint

// Users Table
export const users = pgTable('users', {
    id: text('id').primaryKey(), // Using text to match DB legacy
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: userRoleEnum('role').default('user'),
    isVerified: boolean('is_verified').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    currentHashedRefreshToken: text('currentHashedRefreshToken'), // Legacy Phase 1 column

    // Auth v2
    isMfaEnabled: boolean('is_mfa_enabled').default(false),
}, (t) => ({
    emailIdx: index('users_email_idx').on(t.email),
}));

// Auth v2 Tables

// Refresh Tokens
export const refreshTokens = pgTable('refresh_tokens', {
    id: uuid('id').primaryKey(),
    userId: text('user_id').references(() => users.id).notNull(),
    tokenHash: text('token_hash').notNull(),
    deviceInfo: text('device_info'),
    expiresAt: timestamp('expires_at').notNull(),
    revokedAt: timestamp('revoked_at'),
    replacedByTokenId: text('replaced_by_token_id'), // Use text for self-ref UUID to avoid cirular ref issues in definition sometimes, or uuid is fine.
    createdAt: timestamp('created_at').defaultNow(),
});

// MFA Settings
export const mfaSettings = pgTable('mfa_settings', {
    id: uuid('id').primaryKey(),
    userId: text('user_id').references(() => users.id).notNull().unique(),
    isEnabled: boolean('is_enabled').default(false),
    secret: text('secret').notNull(),
    backupCodes: text('backup_codes').array(),
    type: mfaTypeEnum('type').default('TOTP'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Audit Logs
export const auditLogs = pgTable('audit_logs', {
    id: uuid('id').primaryKey(),
    userId: text('user_id').references(() => users.id), // Nullable
    action: auditActionEnum('action').notNull(),
    status: auditStatusEnum('status').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    details: jsonb('details'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Social Accounts
export const socialAccounts = pgTable('social_accounts', {
    id: uuid('id').primaryKey(),
    userId: text('user_id').references(() => users.id).notNull(),
    provider: socialProviderEnum('provider').notNull(),
    providerId: text('provider_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
    uniqueProvider: unique('social_accounts_provider_provider_id_key').on(t.provider, t.providerId),
}));

// Courses Table
export const courses = pgTable('courses', {
    id: uuid('id').primaryKey(), // Match Prisma String ID
    title: text('title').notNull(),
    // titleAr: text('title_ar'), // localized - REMOVED for Prod Match
    slug: text('slug').notNull().unique(),
    description: text('description').notNull(),
    // descriptionAr: text('description_ar'), // localized - REMOVED for Prod Match
    coverImageUrl: text('cover_image_url'),
    duration: text('duration').notNull(),
    level: courseLevelEnum('level').notNull().default('beginner'),
    price: integer('price').notNull().default(0),
    currency: text('currency').default('USD'),
    instructorId: text('instructor_id').references(() => users.id),
    isPublished: boolean('is_published').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
    instructorIdx: index('courses_instructor_idx').on(t.instructorId),
    slugIdx: index('courses_slug_idx').on(t.slug),
}));

// Workshops Table (New)
export const workshops = pgTable('workshops', {
    id: uuid('id').primaryKey(),
    title: text('title').notNull(),
    // titleAr: text('title_ar'), // localized - REMOVED for Prod Match
    slug: text('slug').notNull().unique(),
    description: text('description').notNull(),
    // descriptionAr: text('description_ar'), // localized - REMOVED for Prod Match
    startTime: timestamp('start_time').notNull(),
    durationMinutes: integer('duration_minutes').notNull(),
    price: integer('price').notNull().default(0),
    currency: text('currency').default('USD'),
    isFree: boolean('is_free').default(false),
    coverImageUrl: text('cover_image_url'),
    isPublished: boolean('is_published').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// ... (skipping payments, enrollments, etc for brevity in this replacement block if possible, but replace_file_content needs contiguous block. I will just replace the specific tables separately or a large block if they are close. They are somewhat close. I will do separate replace calls or one large one.
// Let's do `blogPosts` separate as it's further down.
// I will do `courses` and `workshops` first since they are adjacent.

// Actually, let's look at the line numbers again.
// courses: 26-40
// workshops: 43-57
// blogPosts: 128-140
// I'll do two calls. One for courses/workshops, one for blogPosts.

// Wait, I can do a multi_replace? Yes, I have `multi_replace_file_content`.
// That is much better.



// Payments Table (New)
export const payments = pgTable('payments', {
    id: uuid('id').primaryKey(),
    userId: text('user_id').references(() => users.id).notNull(),
    amount: integer('amount').notNull(),
    currency: text('currency').notNull(),
    status: text('status').notNull(), // 'pending', 'succeeded', 'failed'
    provider: text('provider').notNull(), // 'stripe'
    providerPaymentId: text('provider_payment_id'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Enrollments Table (Updated with payment_id)
export const enrollments = pgTable('enrollments', {
    id: uuid('id').primaryKey(),
    userId: text('user_id').references(() => users.id).notNull(),
    courseId: uuid('course_id').references(() => courses.id).notNull(),
    paymentId: uuid('payment_id').references(() => payments.id),
    status: enrollmentStatusEnum('status').default('active'),
    enrolledAt: timestamp('enrolled_at').defaultNow(),
    completedAt: timestamp('completed_at'),
});

// Workshop Registrations Table (New)
export const workshopRegistrations = pgTable('workshop_registrations', {
    id: uuid('id').primaryKey(),
    userId: text('user_id').references(() => users.id).notNull(),
    workshopId: uuid('workshop_id').references(() => workshops.id).notNull(),
    paymentId: uuid('payment_id').references(() => payments.id), // Nullable for free workshops
    registeredAt: timestamp('registered_at').defaultNow(),
});

// Course Workshops Junction Table (New)
export const courseWorkshops = pgTable('course_workshops', {
    courseId: uuid('course_id').references(() => courses.id).notNull(),
    workshopId: uuid('workshop_id').references(() => workshops.id).notNull(),
}, (t) => ({
    pk: primaryKey({ columns: [t.courseId, t.workshopId] }),
}));

// Content Modules (New)
export const contentModules = pgTable('content_modules', {
    id: uuid('id').primaryKey(),
    courseId: uuid('course_id').references(() => courses.id).notNull(),
    title: text('title').notNull(),
    orderIndex: integer('order_index').notNull(),
}, (t) => ({
    courseIdx: index('modules_course_idx').on(t.courseId),
}));

// Lessons (New)
export const lessons = pgTable('lessons', {
    id: uuid('id').primaryKey(),
    moduleId: uuid('module_id').references(() => contentModules.id).notNull(),
    title: text('title').notNull(),
    contentText: text('content_text'),
    videoUrl: text('video_url'),
    orderIndex: integer('order_index').notNull(),
}, (t) => ({
    moduleIdx: index('lessons_module_idx').on(t.moduleId),
}));

// Attachment Files (New - Polymorphic)
export const attachmentFiles = pgTable('attachment_files', {
    id: uuid('id').primaryKey(),
    entityId: uuid('entity_id').notNull(), // Polymorphic ID (Text to support both)
    entityType: text('entity_type').notNull(), // 'course' or 'workshop'
    fileName: text('file_name').notNull(),
    fileUrl: text('file_url').notNull(),
    isPublic: boolean('is_public').default(false),
});

// Blog Posts (Kept for Blog feature)
// Blog Posts (Kept for Blog feature)
export const blogPosts = pgTable('blog_posts', {
    id: uuid('id').primaryKey(),
    title: text('title').notNull(),
    // titleAr: text('title_ar'), // localized - REMOVED for Prod Match
    slug: text('slug').notNull().unique(),
    content: text('content').notNull(),
    // contentAr: text('content_ar'), // localized - REMOVED for Prod Match
    excerpt: text('excerpt'),
    // excerptAr: text('excerpt_ar'), // localized - REMOVED for Prod Match

    // SEO & Metadata (ZEUS Protocol)
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    tags: text('tags').array(), // Low-level tags array
    readingTime: integer('reading_time'), // AI-calculated
    authorId: text('author_id').references(() => users.id).notNull(),
    // blogPosts (new) can keep uuid or switch to text. Switching to avoid mix?
    // references categories.id (now text) implies categoryId must be text.
    categoryId: text('category_id').references(() => categories.id),
    isPublished: boolean('is_published').default(false),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
    authorIdx: index('blog_posts_author_idx').on(t.authorId),
    slugIdx: index('blog_posts_slug_idx').on(t.slug),
}));


// Site Content (CMS)
export const siteContent = pgTable('site_content', {
    id: uuid('id').primaryKey(),
    key: text('key').notNull(), // e.g. 'hero.title'
    language: text('language').notNull(), // 'en' or 'ar'
    value: text('value').notNull(),
    section: text('section').notNull(), // 'home', 'about', etc.
    type: text('type').notNull().default('text'), // 'text', 'textarea', 'image'
    updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
    uniqueKeyLang: unique('key_lang_idx').on(t.key, t.language),
}));

// Categories (Kept)
export const categories = pgTable('categories', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    type: text('type').notNull(),
});


// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
    enrollments: many(enrollments),
    registrations: many(workshopRegistrations),
    instructedCourses: many(courses),
    blogPosts: many(blogPosts),
    payments: many(payments),
    // Auth v2 relations
    refreshTokens: many(refreshTokens),
    mfaSettings: one(mfaSettings),
    auditLogs: many(auditLogs),
    socialAccounts: many(socialAccounts),
    lessonProgress: many(lessonProgress),
}));

// Lesson Progress (Phase 3)
export const lessonProgress = pgTable('lesson_progress', {
    id: uuid('id').primaryKey(),
    userId: text('user_id').references(() => users.id).notNull(),
    lessonId: uuid('lesson_id').references(() => lessons.id).notNull(),
    isCompleted: boolean('is_completed').default(false),
    lastWatchedPosition: integer('last_watched_position').default(0), // in seconds
    updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
    pk: unique('user_lesson_progress_idx').on(t.userId, t.lessonId),
}));

export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
    user: one(users, {
        fields: [lessonProgress.userId],
        references: [users.id],
    }),
    lesson: one(lessons, {
        fields: [lessonProgress.lessonId],
        references: [lessons.id],
    }),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
    user: one(users, {
        fields: [enrollments.userId],
        references: [users.id],
    }),
    course: one(courses, {
        fields: [enrollments.courseId],
        references: [courses.id],
    }),
    payment: one(payments, {
        fields: [enrollments.paymentId],
        references: [payments.id],
    }),
}));

// Auth v2 Relations
export const socialAccountsRelations = relations(socialAccounts, ({ one }) => ({
    user: one(users, {
        fields: [socialAccounts.userId],
        references: [users.id],
    }),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
    user: one(users, {
        fields: [refreshTokens.userId],
        references: [users.id],
    }),
}));

export const mfaSettingsRelations = relations(mfaSettings, ({ one }) => ({
    user: one(users, {
        fields: [mfaSettings.userId],
        references: [users.id],
    }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
    user: one(users, {
        fields: [auditLogs.userId],
        references: [users.id],
    }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
    author: one(users, {
        fields: [blogPosts.authorId],
        references: [users.id],
    }),
    category: one(categories, {
        fields: [blogPosts.categoryId],
        references: [categories.id],
    }),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
    instructor: one(users, {
        fields: [courses.instructorId],
        references: [users.id],
    }),
    modules: many(contentModules),
    enrollments: many(enrollments),
    workshops: many(courseWorkshops),
    attachments: many(attachmentFiles, { relationName: 'courseAttachments' }), // Polymorphic logic handled in query usually
}));

export const workshopsRelations = relations(workshops, ({ many }) => ({
    registrations: many(workshopRegistrations),
    courses: many(courseWorkshops),
}));

export const contentModulesRelations = relations(contentModules, ({ one, many }) => ({
    course: one(courses, {
        fields: [contentModules.courseId],
        references: [courses.id],
    }),
    lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    module: one(contentModules, {
        fields: [lessons.moduleId],
        references: [contentModules.id],
    }),
    progress: many(lessonProgress),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
    user: one(users, {
        fields: [payments.userId],
        references: [users.id],
    }),
}));
