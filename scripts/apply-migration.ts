import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import fs from "fs";

async function main() {
  const prisma = new PrismaClient();
  const sql = fs.readFileSync("/tmp/growth_plan_safe.sql", "utf8");

  // Split into individual statements and execute each
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Executing ${statements.length} statements...`);

  for (const stmt of statements) {
    try {
      await prisma.$executeRawUnsafe(stmt + ";");
      console.log(`OK: ${stmt.slice(0, 60)}...`);
    } catch (err: any) {
      if (err.code === "P2010" || err.message.includes("already exists")) {
        console.log(`SKIP: ${stmt.slice(0, 60)}...`);
      } else {
        console.error(`FAIL: ${stmt.slice(0, 60)}... ${err.message}`);
      }
    }
  }

  console.log("\nMigration complete.");
  await prisma.$disconnect();
}

main().catch(console.error);
