import type { IncomingMessage, ServerResponse } from 'node:http'
import process from 'node:process'
import nodemailer from 'nodemailer'

export interface ContactBriefPayload {
  name: string
  email: string
  phone: string
  brand?: string
  discipline: string
  timeline: string
  budget: string
  referenceLink?: string
  message: string
  referenceId: string
}

interface ApiRequest extends IncomingMessage {
  body?: unknown
}

interface ApiResponse extends ServerResponse {
  status?: (code: number) => ApiResponse
  json?: (body: unknown) => void
}

const DEFAULT_RECIPIENT_EMAIL = 'businessgroupikasle@gmail.com'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function sendJson(res: ApiResponse, statusCode: number, body: unknown): void {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    const statusRes = res.status(statusCode)
    if (typeof statusRes.json === 'function') {
      statusRes.json(body)
      return
    }
  }
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

async function readJsonBody(req: ApiRequest): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') {
    return req.body as Record<string, unknown>
  }
  if (typeof req.body === 'string') {
    return JSON.parse(req.body) as Record<string, unknown>
  }

  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
}

function getString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export async function sendBriefEmails(
  rawPayload: Record<string, unknown>,
  env: Record<string, string | undefined> = process.env
): Promise<{ statusCode: number; body: { success: boolean; message: string } }> {
  const name = getString(rawPayload.name)
  const email = getString(rawPayload.email)
  const phone = getString(rawPayload.phone)
  const brand = getString(rawPayload.brand) || 'Not specified'
  const discipline = getString(rawPayload.discipline) || 'Production Inquiry'
  const timeline = getString(rawPayload.timeline) || 'Flexible / In Planning'
  const budget = getString(rawPayload.budget) || "Let's Discuss Scope"
  const referenceLink = getString(rawPayload.referenceLink) || 'None provided'
  const message = getString(rawPayload.message)
  const referenceId = getString(rawPayload.referenceId) || `IKL-2026-${Math.floor(1000 + Math.random() * 9000)}`

  if (!name || name.length < 2 || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone || phone.length < 7 || !message || message.length < 10) {
    return {
      statusCode: 400,
      body: {
        success: false,
        message: 'Please fill in all required fields before submitting.',
      },
    }
  }

  const gmailUser = (env.GMAIL_USER || DEFAULT_RECIPIENT_EMAIL).trim()
  const gmailAppPassword = (env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '')
  const recipientEmail = (env.BRIEF_RECIPIENT_EMAIL || DEFAULT_RECIPIENT_EMAIL).trim()

  if (!gmailAppPassword) {
    return {
      statusCode: 500,
      body: {
        success: false,
        message: `Email delivery is missing GMAIL_APP_PASSWORD configuration. Please email ${recipientEmail} directly.`,
      },
    }
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  })

  const fromHeader = `"IKASLÉ Productions" <${gmailUser}>`

  // 1. Send full production brief to businessgroupikasle@gmail.com
  await transporter.sendMail({
    from: fromHeader,
    to: recipientEmail,
    replyTo: email,
    subject: `New Production Brief (${referenceId}) - ${discipline}`,
    text: [
      `New Production Brief Received`,
      `Reference ID: ${referenceId}`,
      `Primary Discipline: ${discipline}`,
      `Target Timeline: ${timeline}`,
      `Estimated Budget: ${budget}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone / WhatsApp: ${phone}`,
      `Brand / Studio: ${brand}`,
      `Reference Link: ${referenceLink}`,
      ``,
      `Project Narrative & Creative Brief:`,
      message,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #0d0d14; color: #f4f2fa; border: 1px solid #2b263d; border-radius: 12px; overflow: hidden;">
        <div style="background: #171326; padding: 20px 24px; border-bottom: 1px solid #2b263d;">
          <p style="margin: 0; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #a78bfa;">IKASLÉ Productions // New Brief</p>
          <h2 style="margin: 6px 0 0; font-size: 20px; color: #ffffff;">Production Brief — ${escapeHtml(referenceId)}</h2>
        </div>
        <div style="padding: 20px 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #9a95ab; width: 170px;">Primary Discipline</td><td style="padding: 8px 0; color: #ffffff; font-weight: 600;">${escapeHtml(discipline)}</td></tr>
            <tr><td style="padding: 8px 0; color: #9a95ab;">Target Timeline</td><td style="padding: 8px 0; color: #ffffff;">${escapeHtml(timeline)}</td></tr>
            <tr><td style="padding: 8px 0; color: #9a95ab;">Estimated Budget</td><td style="padding: 8px 0; color: #ffffff;">${escapeHtml(budget)}</td></tr>
            <tr><td style="padding: 8px 0; color: #9a95ab;">Client Name</td><td style="padding: 8px 0; color: #ffffff;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding: 8px 0; color: #9a95ab;">Email Address</td><td style="padding: 8px 0; color: #c4a2ff;">${escapeHtml(email)}</td></tr>
            <tr><td style="padding: 8px 0; color: #9a95ab;">Phone / WhatsApp</td><td style="padding: 8px 0; color: #ffffff;">${escapeHtml(phone)}</td></tr>
            <tr><td style="padding: 8px 0; color: #9a95ab;">Brand / Studio</td><td style="padding: 8px 0; color: #ffffff;">${escapeHtml(brand)}</td></tr>
            <tr><td style="padding: 8px 0; color: #9a95ab;">Reference Link</td><td style="padding: 8px 0; color: #c4a2ff;">${escapeHtml(referenceLink)}</td></tr>
          </table>
          <div style="margin-top: 18px; padding: 14px 16px; background: #14121f; border: 1px solid #2b263d; border-radius: 8px;">
            <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #a78bfa;">Project Narrative &amp; Creative Brief</p>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.55; color: #e6e2f0;">${escapeHtml(message)}</p>
          </div>
        </div>
      </div>
    `,
  })

  // 2. Send thank-you confirmation email to the client
  await transporter.sendMail({
    from: fromHeader,
    to: email,
    replyTo: recipientEmail,
    subject: `Thank you for contacting IKASLÉ Productions (${referenceId})`,
    text: [
      `Hi ${name},`,
      ``,
      `Thank you for reaching out to IKASLÉ Productions!`,
      `We have received your ${discipline} production brief (Reference ID: ${referenceId}).`,
      ``,
      `Our executive producer is reviewing your project details and will get back to you within 24 hours.`,
      ``,
      `Summary:`,
      `- Discipline: ${discipline}`,
      `- Timeline: ${timeline}`,
      `- Budget Tier: ${budget}`,
      ``,
      `Warm regards,`,
      `IKASLÉ Productions`,
      `Coimbatore, Tamil Nadu`,
      `${recipientEmail}`,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0d14; color: #f4f2fa; border: 1px solid #2b263d; border-radius: 12px; overflow: hidden;">
        <div style="background: #171326; padding: 20px 24px; border-bottom: 1px solid #2b263d;">
          <p style="margin: 0; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #34d399;">✓ Brief Received</p>
          <h2 style="margin: 6px 0 0; font-size: 20px; color: #ffffff;">Thank You, ${escapeHtml(name)}</h2>
        </div>
        <div style="padding: 20px 24px; line-height: 1.6; font-size: 14px; color: #d6d1e3;">
          <p style="margin-top: 0;">Thank you for contacting <strong>IKASLÉ Productions</strong>. We have received your production brief and logged it under reference <strong>${escapeHtml(referenceId)}</strong>.</p>
          <p>Our executive producer is reviewing your creative requirements and will respond within 24 hours.</p>
          <div style="margin: 18px 0; padding: 14px 16px; background: #14121f; border: 1px solid #2b263d; border-radius: 8px;">
            <p style="margin: 0 0 6px;"><strong style="color: #a78bfa;">Discipline:</strong> ${escapeHtml(discipline)}</p>
            <p style="margin: 0 0 6px;"><strong style="color: #a78bfa;">Timeline:</strong> ${escapeHtml(timeline)}</p>
            <p style="margin: 0;"><strong style="color: #a78bfa;">Budget Tier:</strong> ${escapeHtml(budget)}</p>
          </div>
          <p style="margin-bottom: 0; color: #9a95ab; font-size: 13px;">Warm regards,<br/><strong style="color: #ffffff;">IKASLÉ Productions</strong><br/>Coimbatore, Tamil Nadu</p>
        </div>
      </div>
    `,
  })

  return {
    statusCode: 200,
    body: {
      success: true,
      message: 'Brief transmitted successfully.',
    },
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    sendJson(res, 405, { success: false, message: 'Method not allowed.' })
    return
  }

  try {
    const payload = await readJsonBody(req)
    const result = await sendBriefEmails(payload)
    sendJson(res, result.statusCode, result.body)
  } catch (error) {
    console.error('Contact brief email error:', error)
    sendJson(res, 500, {
      success: false,
      message: `Unable to send email right now. Please email ${DEFAULT_RECIPIENT_EMAIL} directly.`,
    })
  }
}

