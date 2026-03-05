import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "ID não informado" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("userToken")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token não encontrado" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `https://gestorappbarber.onrender.com/appBarber/deleteColaborador/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Erro ao deletar cliente" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "Cliente deletado com sucesso",
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