type SendEmailInput = {
  to?: string
  subject: string
  text: string
}

function isUsableEmail(value?: string) {
  return Boolean(value && value.includes("@") && value.includes("."))
}

export async function sendEmail({ to, subject, text }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || process.env.RESEND_FROM_EMAIL

  if (!isUsableEmail(to)) {
    return { status: "skipped", reason: "missing-recipient" as const }
  }

  if (!apiKey || !from) {
    console.log("Email skipped. Configure RESEND_API_KEY and EMAIL_FROM to send admin replies.")
    return { status: "skipped", reason: "missing-config" as const }
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        text,
      }),
    })

    if (!response.ok) {
      const message = await response.text()
      console.error("Failed to send email", message)
      return { status: "error", reason: "provider-error" as const }
    }

    return { status: "sent" as const }
  } catch (error) {
    console.error("Failed to send email", error)
    return { status: "error", reason: "network-error" as const }
  }
}
