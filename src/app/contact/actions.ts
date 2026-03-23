"use server";

import { z } from "zod";
import { Resend } from "resend";

import { siteConfig } from "@/config/site";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export interface ContactFormState {
  success: boolean;
  message: string;
  errors?: Partial<Record<keyof ContactFormData, string[]>>;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const parsed = contactSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form for errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, subject, message } = parsed.data;

  // Check for Resend API key
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");

    return {
      success: false,
      message: "Email service is not configured. Please try again later.",
    };
  }

  try {
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: siteConfig.contactEmail,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `.trim(),
    });

    return {
      success: true,
      message: "Thank you for your message. We will get back to you soon!",
    };
  } catch (error) {
    console.error("Failed to send email:", error);

    return {
      success: false,
      message: "Failed to send message. Please try again later.",
    };
  }
}
