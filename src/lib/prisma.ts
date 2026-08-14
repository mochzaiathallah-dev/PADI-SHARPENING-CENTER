import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

let prisma: PrismaClient;

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL is not set in environment variables");
  }

  try {
    // Parse the MySQL URL: mysql://user:password@host:port/database?options
    const url = new URL(dbUrl);
    
    const host = url.hostname || "127.0.0.1";
    const port = parseInt(url.port || "3306", 10);
    const user = url.username || "root";
    const password = decodeURIComponent(url.password || "");
    const database = url.pathname.replace(/^\//, "") || "padi_sharpening_center";
    
    // Parse connection limit option for connection pooling
    const connectionLimit = parseInt(url.searchParams.get("connection_limit") || "10", 10);

    const adapter = new PrismaMariaDb({
      host,
      port,
      user,
      password,
      database,
      connectionLimit,
      connectTimeout: 4000,
      acquireTimeout: 4000,
    });

    return new PrismaClient({ adapter });
  } catch (error) {
    console.error("Failed to initialize Prisma Client with MariaDB adapter:", error);
    throw error;
  }
}

if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  // Prevent multiple instances of Prisma Client in development (Hot Module Replacement)
  if (!(global as any).prisma) {
    (global as any).prisma = createPrismaClient();
  }
  prisma = (global as any).prisma;
}

export { prisma };
export default prisma;
