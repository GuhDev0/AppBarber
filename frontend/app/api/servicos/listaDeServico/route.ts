import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("userToken")?.value;

        if (!token) {
            return NextResponse.json(
                { mensagem: "Token não encontrado" },
                { status: 401 }
            );
        }

        const response = await fetch(
            "https://gestorappbarber.onrender.com/appBarber/findListServices",
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

        return NextResponse.json(data?.services);

    } catch (error:any) {
        return NextResponse.json(
            { mensagem: error.message },
            { status: 500 }
        );
    }
}


