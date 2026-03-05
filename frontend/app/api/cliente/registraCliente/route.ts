import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("userToken")?.value;

        if (!token) {
            return NextResponse.json(
                { mensagem: "Token não encontrado" },
                { status: 401 }
            );
        }
        const body = await request.json();

        const response = await fetch("https://gestorappbarber.onrender.com/appBarber/cadastroDeCliente",
            {
                method: "POST",
                headers: {
                     "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            })
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });

    } catch (error: any) {
        return NextResponse.json(
      { erro: error.message },
      { status: 500 }
    );
    }
}