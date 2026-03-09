import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Helper: replace {{placeholder}} tokens ────────────────────────────────
function fill(template: string, data: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = data[key] ?? '';
    // Basic XSS-safe escaping for HTML context
    return val
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  });
}

// ─── Notification email (sent to Benil) ───────────────────────────────────
function buildNotificationHtml(data: Record<string, string>): string {
  return fill(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Contact Message – Benil Jenish</title>
</head>
<body style="margin:0;padding:0;background:#edecea;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#edecea;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:580px;" cellpadding="0" cellspacing="0">

          <!-- Top Brand Bar -->
          <tr>
            <td style="background:#1a1a1a;padding:18px 40px;border-radius:4px 4px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-family:Georgia,serif;font-size:17px;color:#ffffff;letter-spacing:0.04em;font-weight:400;">Benil Jenish</span>
                    <span style="font-family:Arial,sans-serif;font-size:11px;color:#888;letter-spacing:0.1em;margin-left:10px;text-transform:uppercase;">· beniljenish.dev</span>
                  </td>
                  <td align="right">
                    <span style="font-family:Arial,sans-serif;font-size:10px;color:#aaa;letter-spacing:0.12em;text-transform:uppercase;">Notification</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background:#ffffff;padding:44px 40px 36px;border-left:1px solid #e4e1dc;border-right:1px solid #e4e1dc;">

              <!-- Header -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;padding-bottom:28px;border-bottom:2px solid #f0ede8;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#b0a898;">New Enquiry Received</p>
                    <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#1a1a1a;line-height:1.25;">You've received a new message.</h1>
                  </td>
                </tr>
              </table>

              <!-- Name + Email Row -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td width="48%" style="vertical-align:top;padding-right:16px;">
                    <p style="margin:0 0 5px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#b0a898;">Full Name</p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a;font-weight:600;padding:10px 14px;background:#f9f8f6;border-left:3px solid #1a1a1a;border-radius:0 3px 3px 0;">{{name}}</p>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="vertical-align:top;">
                    <p style="margin:0 0 5px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#b0a898;">Email Address</p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a;font-weight:600;padding:10px 14px;background:#f9f8f6;border-left:3px solid #1a1a1a;border-radius:0 3px 3px 0;">{{email}}</p>
                  </td>
                </tr>
              </table>

              <!-- Subject -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td>
                    <p style="margin:0 0 5px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#b0a898;">Subject</p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a;font-weight:600;padding:10px 14px;background:#f9f8f6;border-left:3px solid #1a1a1a;border-radius:0 3px 3px 0;">{{subject}}</p>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td>
                    <p style="margin:0 0 5px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#b0a898;">Message</p>
                    <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:#444;line-height:1.85;padding:18px 20px;background:#f9f8f6;border:1px solid #ede9e3;border-left:3px solid #1a1a1a;border-radius:0 3px 3px 0;">{{message}}</p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr><td style="height:1px;background:#f0ede8;"></td></tr>
              </table>

              <!-- Reply CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a href="mailto:{{email}}" style="display:inline-block;background:#1a1a1a;color:#ffffff;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;padding:14px 36px;border-radius:2px;font-weight:600;">
                      Reply to {{name}} &rarr;
                    </a>
                  </td>
                  <td style="padding-left:20px;">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#b0a898;line-height:1.6;">Sent from your website<br/>contact form</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1a1a1a;padding:22px 40px;border-radius:0 0 4px 4px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a href="https://www.linkedin.com/in/benil-jenish/" style="display:inline-block;text-decoration:none;background:#0077B5;border-radius:3px;padding:6px 12px;margin-right:8px;font-family:Arial,sans-serif;font-size:10px;color:#ffffff;letter-spacing:0.07em;font-weight:600;">LinkedIn</a>
                    <a href="https://github.com/Beniljenish" style="display:inline-block;text-decoration:none;background:#333;border:1px solid #555;border-radius:3px;padding:6px 12px;font-family:Arial,sans-serif;font-size:10px;color:#ffffff;letter-spacing:0.07em;font-weight:600;">GitHub</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:16px;border-top:1px solid #2e2e2e;margin-top:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                      <tr>
                        <td style="font-family:Arial,sans-serif;font-size:10px;color:#aaa;">
                          This message was submitted via <a href="https://beniljenish.dev" style="color:#ccc;text-decoration:none;">beniljenish.dev</a>
                        </td>
                        <td align="right" style="font-family:Arial,sans-serif;font-size:10px;color:#aaa;">
                          &copy; 2025 Benil Jenish. All rights reserved.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`, data);
}

// ─── Auto-reply email (sent to the person who contacted) ──────────────────
function buildAutoreplyHtml(data: Record<string, string>): string {
  return fill(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Thanks for reaching out – Benil Jenish</title>
</head>
<body style="margin:0;padding:0;background:#edecea;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#edecea;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:580px;" cellpadding="0" cellspacing="0">

          <!-- Top Brand Bar -->
          <tr>
            <td style="background:#1a1a1a;padding:18px 40px;border-radius:4px 4px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-family:Georgia,serif;font-size:17px;color:#ffffff;letter-spacing:0.04em;font-weight:400;">Benil Jenish</span>
                    <span style="font-family:Arial,sans-serif;font-size:11px;color:#888;letter-spacing:0.1em;margin-left:10px;text-transform:uppercase;">· beniljenish.dev</span>
                  </td>
                  <td align="right">
                    <span style="font-family:Arial,sans-serif;font-size:10px;color:#aaa;letter-spacing:0.12em;text-transform:uppercase;">Auto Reply</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background:#ffffff;padding:44px 40px 36px;border-left:1px solid #e4e1dc;border-right:1px solid #e4e1dc;">

              <!-- Header -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;padding-bottom:28px;border-bottom:2px solid #f0ede8;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#b0a898;">Message Received</p>
                    <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#1a1a1a;line-height:1.25;">Thank you for reaching out, {{name}}.</h1>
                  </td>
                </tr>
              </table>

              <!-- Body text -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td>
                    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;color:#555;line-height:1.85;font-weight:400;">
                      I appreciate you taking the time to get in touch. Your message has been received and I will respond as soon as possible — typically within <strong style="color:#1a1a1a;">24 hours</strong>.
                    </p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#555;line-height:1.85;font-weight:400;">
                      For your reference, here is a summary of your submission:
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Message Recap Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;background:#f9f8f6;border:1px solid #ede9e3;border-left:3px solid #1a1a1a;border-radius:0 3px 3px 0;">
                <tr>
                  <td style="padding:20px 24px;">

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                      <tr><td style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#b0a898;padding-bottom:4px;">Subject</td></tr>
                      <tr><td style="font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a;font-weight:600;">{{subject}}</td></tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="padding-top:14px;border-top:1px solid #ede9e3;">
                      <tr><td style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#b0a898;padding-bottom:6px;">Your Message</td></tr>
                      <tr><td style="font-family:Georgia,serif;font-size:13px;color:#555;line-height:1.85;">{{message}}</td></tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr><td style="height:1px;background:#f0ede8;"></td></tr>
              </table>

              <!-- Sign off -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:14px;color:#555;line-height:1.8;">Warm regards,</p>
                    <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:18px;color:#1a1a1a;font-style:italic;">Benil Jenish</p>
                    <a href="https://beniljenish.dev" style="font-family:Arial,sans-serif;font-size:11px;color:#b0a898;text-decoration:none;letter-spacing:0.06em;">beniljenish.dev</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1a1a1a;padding:22px 40px;border-radius:0 0 4px 4px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a href="https://www.linkedin.com/in/benil-jenish/" style="display:inline-block;text-decoration:none;background:#0077B5;border-radius:3px;padding:6px 12px;margin-right:8px;font-family:Arial,sans-serif;font-size:10px;color:#ffffff;letter-spacing:0.07em;font-weight:600;">LinkedIn</a>
                    <a href="https://github.com/Beniljenish" style="display:inline-block;text-decoration:none;background:#333;border:1px solid #555;border-radius:3px;padding:6px 12px;font-family:Arial,sans-serif;font-size:10px;color:#ffffff;letter-spacing:0.07em;font-weight:600;">GitHub</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #2e2e2e;padding-top:16px;">
                      <tr>
                        <td style="padding-top:14px;font-family:Arial,sans-serif;font-size:10px;color:#aaa;">
                          You're receiving this because you submitted the contact form on <a href="https://beniljenish.dev" style="color:#ccc;text-decoration:none;">beniljenish.dev</a>
                        </td>
                        <td align="right" style="padding-top:14px;font-family:Arial,sans-serif;font-size:10px;color:#aaa;white-space:nowrap;">
                          &copy; 2025 Benil Jenish. All rights reserved.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`, data);
}

// ─── Serverless handler ────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const data: Record<string, string> = { name, email, subject, message };

  try {
    // 1. Notification to Benil
    await resend.emails.send({
      from: 'Benil Jenish Portfolio <onboarding@resend.dev>',
      to: 'beniljenish@gmail.com',
      replyTo: email,
      subject: `New message from ${name}: ${subject}`,
      html: buildNotificationHtml(data),
    });

    // 2. Auto-reply to the sender
    await resend.emails.send({
      from: 'Benil Jenish <onboarding@resend.dev>',
      to: email,
      subject: `Thanks for reaching out, ${name} — Benil Jenish`,
      html: buildAutoreplyHtml(data),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
}
