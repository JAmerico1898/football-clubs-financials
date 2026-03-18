"use client";

import { useState, FormEvent } from "react";
import BackButton from "@/components/BackButton";

export default function ContatoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error("Falha ao enviar");

      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="max-w-[960px] mx-auto px-4 py-12">
      <BackButton />
      <h1 className="text-3xl font-bold tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>
        Dúvidas, Sugestões, Bugs
      </h1>
      <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
        Envie sua mensagem e entraremos em contato.
      </p>

      <div className="card-surface">
        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
              Nome (opcional)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="select-themed w-full"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
              E-mail (opcional)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="select-themed w-full"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
              Mensagem
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="select-themed w-full"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-all active:shadow-none active:scale-[0.98] disabled:opacity-50"
            style={{ backgroundColor: "var(--brand-blue)" }}
          >
            {status === "sending" ? "Enviando..." : "Enviar"}
          </button>

          {status === "sent" && (
            <div className="alert-success">Mensagem enviada com sucesso!</div>
          )}
          {status === "error" && (
            <div className="alert-error">Erro ao enviar. Tente novamente.</div>
          )}
        </form>
      </div>
    </main>
  );
}
