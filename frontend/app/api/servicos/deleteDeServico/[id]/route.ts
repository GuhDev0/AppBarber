import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ obrigatório no Next 15

    const cookieStore = await cookies();
    const token = cookieStore.get("userToken")?.value;

    if (!token) {
      return NextResponse.json(
        { mensagem: "Token não encontrado" },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { message: "ID não informado" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://gestorappbarber.onrender.com/appBarber/deleteService/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Erro ao deletar serviço" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "Serviço deletado com sucesso",
    });

  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro interno",
        error: String(error),
      },
      { status: 500 }
    );
  }
}