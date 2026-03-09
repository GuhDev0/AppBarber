import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
){
     const { id } = await params;
    try {
       
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
                { mensagem: "Token não encontrado" },
                { status: 401 }
            );
        }

        const response = await fetch(
            `https://appbarber-analise.onrender.com/analise/colaborador/${id}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (!response.ok) {
            return NextResponse.json(
                { mensagem: "Erro ao buscar dados da API externa" },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(data?.analise);
    } catch (error: any) {
        console.log(error.message)
    }
}