export type SmsResult = "sent" | "dev"

export async function sendSms(to: string, message: string): Promise<SmsResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !from) {
    console.log(`[DEV SMS] To: ${to} | ${message}`)
    return "dev"
  }

  const body = new URLSearchParams({
    To: to,
    From: from,
    Body: message,
  })

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })

  if (!response.ok) {
    console.error(`[SMS ERROR] ${response.status} ${await response.text()}`)
    return "dev"
  }

  return "sent"
}
