import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    const body = await request.json();
    const { loginEmail, loginSenha } = body;

    const response = await fetch(
      "https://gestorappbarber.onrender.com/appBarber/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginEmail, loginSenha }),
      }
    );

    


    if (!response.ok) {
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const data = await response.json();
    if(!data.token){
      return NextResponse.json(
        {error:"Token não fornecido"},
        {status:500}
      )
    }

    const res = NextResponse.json(data);

    res.cookies.set("userToken", data?.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24
    });

    res.cookies.set("role", data?.usuario?.tipoDaConta, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24
    });

    return res;
  } catch (error) {
    console.error("ERRO LOGIN:", error);

    return NextResponse.json(
      { error: "Erro interno no login." },
      { status: 500 }
    );
  }
}
