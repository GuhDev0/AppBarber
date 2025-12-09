// prisma.ts
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: "c:/Users/Guh/Desktop/appBarber/backEnd/.env" });

const datasourceUrl =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL
    : process.env.DIRECT_URL;

// Opcional: garantir ssl desativado no local (se sua DIRECT_URL não tiver sslmode)
const prisma = new PrismaClient({
  datasourceUrl,
});

export { prisma };
