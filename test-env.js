require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
try {
  const prisma = new PrismaClient({ url: process.env.DATABASE_URL });
  console.log("SUCCESS!");
} catch (e) {
  console.log(e.message);
}
