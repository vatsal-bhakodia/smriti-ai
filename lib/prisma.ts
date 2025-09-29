import { PrismaClient } from "@prisma/client";

declare global {
  interface Global {
    prisma?: PrismaClient;
  }
}

const globalForPrisma = global as typeof global & { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") globalForPrisma.prisma = prisma;
if (process.env.NODE_ENV === "development")
  (global as typeof global & { prisma?: PrismaClient }).prisma = prisma;

export default prisma;
