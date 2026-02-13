import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config(); 

const datasourceUrl =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL
    : process.env.DIRECT_URL;

const prisma = new PrismaClient({
  datasourceUrl,
});

export { prisma };
