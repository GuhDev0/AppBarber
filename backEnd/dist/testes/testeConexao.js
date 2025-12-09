"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config({ path: "c:/Users/Guh/Desktop/appBarber/backEnd/.env" });
console.log("URL local:", process.env.DIRECT_URL);
const pool = new pg_1.Pool({
    connectionString: process.env.DIRECT_URL,
    ssl: false // força sem SSL no local
});
async function testConnection() {
    try {
        const res = await pool.query("SELECT NOW()");
        console.log("Conexão OK! Hora do servidor:", res.rows[0].now);
    }
    catch (err) {
        console.error("Erro de conexão:", err);
    }
    finally {
        await pool.end();
    }
}
testConnection();
