import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assuming PrismaService is global or imported
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        return this.prisma.user.create({
            data: {
                name: createUserDto.name,
                email: createUserDto.email,
                password_hash: createUserDto.password, // Ideally hashed before calling this, or hash here. 
                // We will hash in AuthService to keep this service focused on DB.
                role: createUserDto.role || 'STUDENT',
            },
        });
    }

    async findOne(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async setCurrentRefreshToken(refreshToken: string, userId: string) {
        // Determine if we should hash here. The plan said "currentHashedRefreshToken".
        // We will assume the passed token is ALREADY hashed by AuthService for separation of concerns.
        await this.update(userId, {
            currentHashedRefreshToken: refreshToken,
        });
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, userId: string): Promise<User | null> {
        const user = await this.findById(userId);
        if (!user || !user.currentHashedRefreshToken) return null;

        // Comparison should happen in AuthService using bcrypt.compare
        // This method just returns the user for the AuthService to validate.
        return user;
    }
}
