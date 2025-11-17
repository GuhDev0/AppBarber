import { prisma } from "../prisma";
import type { ColaboradorDto } from "../Dtos/colaboradorDto";

export class ColaboradorDB {
  saveColaborador = async (colaboradorDto: ColaboradorDto) => {
    return await prisma.colaborador.create({
      data: {
        nomeCompleto: colaboradorDto.nomeCompleto,
        email: colaboradorDto.email,
        dataDeNascimento: new Date(colaboradorDto.dataNascimento),
        tel: colaboradorDto.tel,
        senha: colaboradorDto.senha,
        empresaId: colaboradorDto.empresaId,
        avatar: colaboradorDto.avatar,
      },
    });
  };

  buscarListaDeColaboradores = async (empresaId: number) => {
    return await prisma.colaborador.findMany({
      where: { empresaId },
      include: { servicos: true },
    });
  };

  buscarColaboradorId = async (id: number) => {
    return await prisma.colaborador.findUnique({
      where: { id },
      include: { servicos: true },
    });
  };

  deleteColaboradorId = async (empresaId: number, id: number) => {
    // Verifica se o colaborador existe
    const colaborador = await prisma.colaborador.findFirst({
      where: { id, empresaId },
    });

    if (!colaborador) throw new Error("Usuário não pertence a essa empresa");

    console.log("Colaborador deletado com sucesso", id);

  
    return await prisma.$transaction(async (tx) => {
     
      await tx.servico.deleteMany({
        where: { colaboradorId: id },
      });

      
      const deleted = await tx.colaborador.delete({
        where: { id },
      });

      return deleted;
    });
  };
}
