import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "Mensagem é obrigatória" }, { status: 400 });
  }

  const token = process.env.PUSHOVER_TOKEN;
  const user = process.env.PUSHOVER_USER;

  if (!token || !user) {
    return NextResponse.json({ error: "Pushover não configurado" }, { status: 500 });
  }

  const body = new URLSearchParams({
    token,
    user,
    title: `Contato${name ? `: ${name}` : ""}`,
    message: `${message}${email ? `\n\nE-mail: ${email}` : ""}`,
  });

  const res = await fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    body,
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Falha ao enviar notificação" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
