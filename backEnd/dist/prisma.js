"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// prisma.ts
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config({ path: "c:/Users/Guh/Desktop/appBarber/backEnd/.env" });
const datasourceUrl = process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL
    : process.env.DIRECT_URL;
// Opcional: garantir ssl desativado no local (se sua DIRECT_URL não tiver sslmode)
const prisma = new client_1.PrismaClient({
    datasourceUrl,
});
exports.prisma = prisma;
