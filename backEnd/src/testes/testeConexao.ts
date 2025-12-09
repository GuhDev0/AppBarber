import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config({ path: "c:/Users/Guh/Desktop/appBarber/backEnd/.env" });

console.log("URL local:", process.env.DIRECT_URL);

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
  ssl: false // força sem SSL no local
});

async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Conexão OK! Hora do servidor:", res.rows[0].now);
  } catch (err) {
    console.error("Erro de conexão:", err);
  } finally {
    await pool.end();
  }
}

testConnection();
