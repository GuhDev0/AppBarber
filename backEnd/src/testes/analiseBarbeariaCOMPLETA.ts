import { Analise } from "../repository/analise";
import { prisma } from "../prisma"; // importa a instância única do Prisma

const analiseDB = new Analise();

async function main() {
  try {
    await analiseDB.analiseCompletaDoEstabelecimento(1);
    console.log("✅ Análise concluída com sucesso!");
  } catch (error:any) {
    console.error("❌ Erro ao realizar análise:", error.message);
  } finally {
    await prisma.$disconnect(); // encerra a conexão com o banco
    console.log("🔒 Conexão com o banco encerrada.");
  }
}

main();
