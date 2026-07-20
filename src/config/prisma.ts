import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const baseRuntimeDatabaseUrl = isProduction
  ? process.env.DATABASE_URL
  : process.env.DIRECT_URL || process.env.DATABASE_URL;

const runtimeDatabaseUrl = isProduction
  ? baseRuntimeDatabaseUrl
  : withLocalSslFallback(baseRuntimeDatabaseUrl);

export const prisma = isProduction
  ? new PrismaClient({
      datasources: runtimeDatabaseUrl ? { db: { url: runtimeDatabaseUrl } } : undefined,
      log: ["error"]
    })
  : new PrismaClient({
      adapter: runtimeDatabaseUrl ? new PrismaPg({ connectionString: runtimeDatabaseUrl }) : undefined,
      log: ["error", "warn"]
    });

function withLocalSslFallback(url: string | undefined) {
  if (!url) return url;
  const parsed = new URL(url);
  parsed.searchParams.set("sslmode", "no-verify");
  parsed.searchParams.delete("sslaccept");
  return parsed.toString();
}
