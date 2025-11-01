require('dotenv').config();
const { PrismaClient } = require('./prisma/node_modules/.prisma/client');

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

module.exports = prisma;
