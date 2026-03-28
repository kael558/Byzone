/**
 * Serverless handler — Byzone CONSTRUCTION quote request email
 *
 * Deployment options:
 *   - AWS Lambda (with API Gateway or Function URL)
 *   - Vercel Serverless Functions  (rename to /api/send-quote.js, Vercel auto-detects)
 *   - Netlify Functions            (move to /netlify/functions/send-quote.js)
 *
 * Required environment variables:
 *   AWS_REGION          e.g. "us-east-1"
 *   AWS_ACCESS_KEY_ID   IAM key with ses:SendEmail permission
 *   AWS_SECRET_ACCESS_KEY
 *   SES_FROM_EMAIL      Verified SES sender address  e.g. "quotes@byzoneconstruction.ca"
 *   SES_TO_EMAIL        Business inbox               e.g. "info@byzoneconstruction.ca"
 *
 * The sender address (SES_FROM_EMAIL) must be verified in AWS SES before use.
 * While in SES sandbox mode, SES_TO_EMAIL must also be verified.
 * Request production access in the AWS console to send to any address.
 */

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({ region: process.env.AWS_REGION || 'us-east-1' });

// ── helpers ──────────────────────────────────────────────────────────────────

function parseBody(event) {
  // Supports JSON body (fetch with Content-Type: application/json)
  // and URL-encoded body (plain HTML form POST)
  const raw = typeof event.body === 'string' ? event.body : JSON.stringify(event.body || {});
  const ct = (event.headers?.['content-type'] || '').toLowerCase();

  if (ct.includes('application/json')) {
    return JSON.parse(raw);
  }

  // URL-encoded
  return Object.fromEntries(new URLSearchParams(raw));
}

function buildEmailBody(fields) {
  const {
    name = '—',
    phone = '—',
    email = '—',
    service = '—',
    message = '—',
    preferredContact = '—',
  } = fields;

  return `
New quote request received via the Byzone CONSTRUCTION website.

──────────────────────────────
  Name:               ${name}
  Phone:              ${phone}
  Email:              ${email}
  Service requested:  ${service}
  Preferred contact:  ${preferredContact}
──────────────────────────────

Message:
${message}

──────────────────────────────
Sent automatically by the Byzone CONSTRUCTION website contact form.
  `.trim();
}

function buildHtmlBody(fields) {
  const {
    name = '—',
    phone = '—',
    email = '—',
    service = '—',
    message = '—',
    preferredContact = '—',
  } = fields;

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1B3A6B; padding: 24px 32px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #fff; margin: 0; font-size: 20px;">New Quote Request</h1>
    <p style="color: #a8c4e8; margin: 4px 0 0; font-size: 14px;">Byzone CONSTRUCTION</p>
  </div>
  <div style="background: #f9fafb; padding: 24px 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
      <tr><td style="padding: 8px 0; color: #6b7280; width: 160px;">Name</td>         <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b7280;">Phone</td>                      <td style="padding: 8px 0;"><a href="tel:${escapeHtml(phone)}" style="color: #1B3A6B;">${escapeHtml(phone)}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #6b7280;">Email</td>                      <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #1B3A6B;">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #6b7280;">Service</td>                    <td style="padding: 8px 0;">${escapeHtml(service)}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b7280;">Preferred contact</td>          <td style="padding: 8px 0;">${escapeHtml(preferredContact)}</td></tr>
    </table>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
    <p style="color: #6b7280; font-size: 13px; margin: 0 0 6px;">Message:</p>
    <p style="background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px; margin: 0; white-space: pre-wrap; font-size: 15px;">${escapeHtml(message)}</p>
    <p style="margin: 24px 0 0; font-size: 12px; color: #9ca3af;">
      Sent automatically from the Byzone CONSTRUCTION website contact form.
    </p>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function corsHeaders(origin) {
  const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim());
  const allowedOrigin = allowed.includes(origin) ? origin : allowed[0] || '*';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function respond(statusCode, body, origin) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    body: JSON.stringify(body),
  };
}

// ── handler ──────────────────────────────────────────────────────────────────

exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || '';

  // Preflight
  if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
    return respond(200, {}, origin);
  }

  const method =
    event.httpMethod ||
    event.requestContext?.http?.method ||
    'POST';

  if (method !== 'POST') {
    return respond(405, { error: 'Method not allowed' }, origin);
  }

  let fields;
  try {
    fields = parseBody(event);
  } catch {
    return respond(400, { error: 'Invalid request body' }, origin);
  }

  const { name, email } = fields;
  if (!name || !email) {
    return respond(400, { error: 'name and email are required' }, origin);
  }

  const from = process.env.SES_FROM_EMAIL;
  const to = process.env.SES_TO_EMAIL;

  if (!from || !to) {
    console.error('Missing SES_FROM_EMAIL or SES_TO_EMAIL environment variables');
    return respond(500, { error: 'Server misconfiguration' }, origin);
  }

  const command = new SendEmailCommand({
    Source: `Byzone CONSTRUCTION <${from}>`,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: {
        Data: `New Quote Request — ${name} (${fields.service || 'General inquiry'})`,
        Charset: 'UTF-8',
      },
      Body: {
        Text: { Data: buildEmailBody(fields), Charset: 'UTF-8' },
        Html: { Data: buildHtmlBody(fields), Charset: 'UTF-8' },
      },
    },
    // Reply-To the customer so you can hit Reply directly in your inbox
    ReplyToAddresses: [email],
  });

  try {
    await ses.send(command);
    return respond(200, { ok: true, message: 'Quote request sent successfully' }, origin);
  } catch (err) {
    console.error('SES send error:', err);
    return respond(500, { error: 'Failed to send email. Please try again.' }, origin);
  }
};
