import { NextResponse } from "next/server";

import { getSiteData } from "@/lib/content";

const RESEND_API_URL = "https://api.resend.com/emails";

type ContactPayload = Record<string, unknown>;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function readPayload(request: Request): Promise<ContactPayload> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return await request.json();
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = await readPayload(request);
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  if (clean(payload.company)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(payload.name);
  const email = clean(payload.email);
  const subject = clean(payload.subject);
  const message = clean(payload.message);

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { message: "Please fill in every required field." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { message: "Please use a valid email address." },
      { status: 400 },
    );
  }

  if (
    name.length > 120 ||
    email.length > 160 ||
    subject.length > 180 ||
    message.length > 4000
  ) {
    return NextResponse.json(
      { message: "Message is too long." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "Email service is not configured." },
      { status: 500 },
    );
  }

  const site = await getSiteData("en");
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: `[Portfolio] ${subject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Contact email failed:", error);
    return NextResponse.json(
      { message: "Message could not be sent." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
