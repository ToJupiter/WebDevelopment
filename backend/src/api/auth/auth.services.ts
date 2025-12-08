import {User, PrismaClient} from '@/generated/prisma/client';
import bcrypt from 'bcryptjs';
import { RegisterInput, LoginInput } from './auth.validation';
import {PrismaMariaDb} from '@prisma/adapter-mariadb';
import {parseMySQLEnv} from '@/services/prisma.service';

const parsed_mysql = parseMySQLEnv();
const mysql_adapter = new PrismaMariaDb({
    host: parsed_mysql.host,
    port: parsed_mysql.port,
    connectionLimit: 10
});

const prisma = new PrismaClient({
    adapter: mysql_adapter
});

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