import { PrismaClient } from "@prisma/client";

declare global {
  // Allow global `var` declarations in TypeScript
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
