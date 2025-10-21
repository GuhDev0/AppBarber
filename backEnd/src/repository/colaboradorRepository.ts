import { PrismaClient } from "../../generated/prisma/index.js";
import type { ColaboradorDto } from "../Dtos/colaboradorDto.js";

const prisma = new PrismaClient();

export class ColaboradorDB {
  saveColaborador = async (colaboradorDto: ColaboradorDto, empresaId: number) => {
  console.log("🧾 Dados recebidos no Repository:", colaboradorDto);

  const save = await prisma.colaborador.create({
    data: {
      nomeCompleto: colaboradorDto.nome,
      email: colaboradorDto.email,
      dataDeNascimento: new Date(colaboradorDto.dataNascimento),
      tel: colaboradorDto.tel,
      senha:colaboradorDto.senha,
      empresaId: empresaId,
      avatar:colaboradorDto.avatar

      
    },
  });

  return save;
};


  buscarColaborador = async (empresaId: number) => {
    const data = await prisma.colaborador.findMany({
      where: { empresaId: empresaId },
    });
    return data;
  };
}
