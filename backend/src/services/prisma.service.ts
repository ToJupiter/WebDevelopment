import { PrismaClient } from '@/generated/prisma/client';
import * as dotenv from 'dotenv';
import {PrismaMariaDb} from '@prisma/adapter-mariadb';

dotenv.config();

const parsed_mysql = parseMySQLEnv();
const mysql_adapter = new PrismaMariaDb({
    host: parsed_mysql.host,
    port: parsed_mysql.port,
    connectionLimit: 10
});

export const prisma = new PrismaClient({
    adapter: mysql_adapter
});

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

export default prisma;