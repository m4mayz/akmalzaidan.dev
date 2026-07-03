"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import type { ContactData, Locale } from "@/types/content";

function TextField({
  id,
  label,
  placeholder,
  multiline = false,
}: {
  id: keyof ContactData["labels"];
  label: string;
  placeholder: string;
  multiline?: boolean;
}) {
  const inputClassName =
    "peer w-full border-0 border-b border-border bg-transparent px-0 pb-4 pt-8 text-[16px] leading-[1.5] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground";

  return (
    <div className="group relative">
      <label
        className="absolute left-0 top-0 text-[11px] font-medium uppercase leading-none tracking-[0.16em] text-muted-foreground transition-colors group-focus-within:text-foreground"
        htmlFor={id}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          autoComplete="off"
          className={`${inputClassName} min-h-32 resize-none`}
          id={id}
          name={id}
          placeholder={placeholder}
          rows={4}
        />
      ) : (
        <input
          autoComplete={id === "email" ? "email" : "on"}
          className={inputClassName}
          id={id}
          name={id}
          placeholder={placeholder}
          type={id === "email" ? "email" : "text"}
        />
      )}
    </div>
  );
}

export function ContactForm({
  contact,
  locale,
}: {
  contact: ContactData;
  locale: Locale;
}) {
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          company: formData.get("company"),
        }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Message could not be sent.");
      }

      form.reset();
      toast.success(locale === "id" ? "Pesan terkirim." : "Message sent.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : locale === "id"
            ? "Pesan gagal dikirim."
            : "Message could not be sent.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form action="/api/contact" method="post" onSubmit={handleSubmit}>
      <div className="grid gap-y-10 md:grid-cols-2 md:gap-x-10">
        <TextField
          id="name"
          label={contact.labels.name}
          placeholder={contact.placeholders.name}
        />
        <TextField
          id="email"
          label={contact.labels.email}
          placeholder={contact.placeholders.email}
        />
      </div>

      <div className="mt-10">
        <TextField
          id="subject"
          label={contact.labels.subject}
          placeholder={contact.placeholders.subject}
        />
      </div>

      <div className="mt-10">
        <TextField
          id="message"
          label={contact.labels.message}
          multiline
          placeholder={contact.placeholders.message}
        />
      </div>

      <div className="hidden">
        <label htmlFor="company">{contact.labels.company}</label>
        <input
          autoComplete="off"
          id="company"
          name="company"
          tabIndex={-1}
          type="text"
        />
      </div>

      <div className="mt-12">
        <button
          className="inline-flex h-11 items-center rounded-full border border-white bg-white px-5 text-[14px] text-black transition-colors hover:bg-transparent hover:text-white active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
          data-cursor="pointer"
          disabled={isSending}
          type="submit"
        >
          {isSending
            ? locale === "id"
              ? "Mengirim..."
              : "Sending..."
            : contact.submitLabel}
        </button>
      </div>
    </form>
  );
}
