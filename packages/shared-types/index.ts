// Shared Types and Interfaces

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    INSTRUCTOR = 'instructor'
}

export enum CourseLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced'
}

export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
