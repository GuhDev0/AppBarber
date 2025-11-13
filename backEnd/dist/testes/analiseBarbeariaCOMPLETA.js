"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analise_1 = require("../repository/analise");
const prisma_1 = require("../prisma"); // importa a instância única do Prisma
const analiseDB = new analise_1.Analise();
async function main() {
    try {
        await analiseDB.analiseCompletaDoEstabelecimento(1);
        console.log("✅ Análise concluída com sucesso!");
    }
    catch (error) {
        console.error("❌ Erro ao realizar análise:", error.message);
    }
    finally {
        await prisma_1.prisma.$disconnect(); // encerra a conexão com o banco
        console.log("🔒 Conexão com o banco encerrada.");
    }
}
main();
