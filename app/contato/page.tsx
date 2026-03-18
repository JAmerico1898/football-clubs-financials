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
    <>
      <div className="h-1 w-full bg-gradient-to-r from-brand-blue via-brand-gold to-brand-green" />
      <main className="max-w-[960px] mx-auto px-4 py-12">
        <BackButton />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Dúvidas, Sugestões, Bugs
        </h1>
        <p className="text-gray-500 mb-8">
          Envie sua mensagem e entraremos em contato.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome (opcional)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail (opcional)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Mensagem
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-md bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {status === "sending" ? "Enviando..." : "Enviar"}
          </button>

          {status === "sent" && (
            <p className="text-green-600 text-sm">Mensagem enviada com sucesso!</p>
          )}
          {status === "error" && (
            <p className="text-red-600 text-sm">Erro ao enviar. Tente novamente.</p>
          )}
        </form>
      </main>
    </>
  );
}
