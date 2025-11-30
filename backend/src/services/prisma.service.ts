import { PrismaClient } from '@/generated/prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

export interface MySQLConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

export function parseMySQLEnv(): MySQLConfig {
  const connectionString = process.env.MYSQL_CONNECTION_STRING;
  
  if (!connectionString) {
    throw new Error('MYSQL_CONNECTION_STRING environment variable is required');
  }
  
  const cleanString = connectionString.replace(/^mysql:\/\//, '');
  
  const [credentials, rest] = cleanString.split('@');
  const [hostPort, database] = rest.split('/');
  const [host, port] = hostPort.split(':');
  const [user, password] = credentials.split(':');
  
  return {
    user: decodeURIComponent(user),
    password: decodeURIComponent(password),
    host,
    port: parseInt(port, 10),
    database
  };
}
