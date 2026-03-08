import {User, PrismaClient} from '@/generated/prisma/client';
import bcrypt from 'bcryptjs';
import { RegisterInput, LoginInput } from './auth.validation';
import prisma from '@/services/prisma.service';

export async function createUser(input: RegisterInput): Promise<User> {
    const { email, password, full_name } = input;
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    return prisma.user.create({
        data: {
            email,
            password_hash,
            full_name
        },
    });
}

export async function validateUser(input: LoginInput): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: { email: input.email }
    });

    if (!user) return null;

    const isValid = await bcrypt.compare(input.password, user.password_hash);
    if (!isValid) return null;

    return user;
}