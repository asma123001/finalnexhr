import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const baseRuntimeDatabaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL
    : process.env.DIRECT_URL || process.env.DATABASE_URL;

const runtimeDatabaseUrl =
  process.env.NODE_ENV === "production"
    ? baseRuntimeDatabaseUrl
    : withLocalSslFallback(baseRuntimeDatabaseUrl);

export const prisma = new PrismaClient({
  adapter: runtimeDatabaseUrl ? new PrismaPg({ connectionString: runtimeDatabaseUrl }) : undefined,
  log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"]
});

function withLocalSslFallback(url: string | undefined) {
  if (!url) return url;
  const parsed = new URL(url);
  parsed.searchParams.set("sslmode", "no-verify");
  parsed.searchParams.delete("sslaccept");
  return parsed.toString();
}
