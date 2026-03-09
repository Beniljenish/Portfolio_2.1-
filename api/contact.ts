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
<body style="margin:0;padding:0;background:#f0ede8;font-family:'Helvetica Neue',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede8;padding:36px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;border-radius:6px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);" cellpadding="0" cellspacing="0">

          <!-- Dark Header -->
          <tr>
            <td style="background:#111110;padding:26px 32px 22px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:Georgia,serif;font-size:16px;color:#ffffff;letter-spacing:0.02em;">Benil Jenish</td>
                  <td align="right">
                    <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#555;border:1px solid #2a2a28;padding:3px 10px;border-radius:20px;">Notification</span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:16px;">
                    <p style="margin:0 0 5px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#555;">New enquiry received</p>
                    <h1 style="margin:0;font-family:Georgia,serif;font-size:24px;font-weight:400;color:#ffffff;line-height:1.25;">You've got a new message.</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Light Body -->
          <tr>
            <td style="background:#ffffff;padding:28px 32px 10px;">

              <!-- Name + Email side by side -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td width="48%" style="vertical-align:top;padding-right:10px;">
                    <p style="margin:0 0 4px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#a09a90;">Name</p>
                    <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#111110;font-weight:600;background:#f7f5f2;padding:9px 12px;border-radius:0 2px 2px 0;">{{name}}</p>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="vertical-align:top;">
                    <p style="margin:0 0 4px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#a09a90;">Email</p>
                    <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#111110;font-weight:600;background:#f7f5f2;padding:9px 12px;border-radius:0 2px 2px 0;word-break:break-all;">{{email}}</p>
                  </td>
                </tr>
              </table>

              <!-- Subject -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#a09a90;">Subject</p>
                    <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#111110;font-weight:600;background:#f7f5f2;padding:9px 12px;border-radius:0 2px 2px 0;">{{subject}}</p>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#a09a90;">Message</p>
                    <p style="margin:0;font-family:Georgia,serif;font-size:13px;color:#444;line-height:1.8;background:#f7f5f2;padding:14px 16px;border:1px solid #ebe7e0;border-radius:0 2px 2px 0;">{{message}}</p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr><td style="height:1px;background:#ebe7e0;"></td></tr>
              </table>

              <!-- Reply CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td>
                    <a href="mailto:{{email}}" style="display:inline-block;background:#111110;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;text-decoration:none;padding:11px 28px;border-radius:3px;">
                      Reply to {{name}} &rarr;
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Dark Footer -->
          <tr>
            <td style="background:#111110;padding:18px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <a href="https://www.linkedin.com/in/benil-jenish/" style="display:inline-block;text-decoration:none;background:#0077B5;border-radius:3px;padding:5px 11px;margin-right:6px;">
                      <table cellpadding="0" cellspacing="0"><tr>
                        <td style="vertical-align:middle;padding-right:5px;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </td>
                        <td style="vertical-align:middle;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:#fff;letter-spacing:0.06em;font-weight:600;">LinkedIn</td>
                      </tr></table>
                    </a>
                    <a href="https://github.com/Beniljenish" style="display:inline-block;text-decoration:none;background:#2a2a28;border-radius:3px;padding:5px 11px;">
                      <table cellpadding="0" cellspacing="0"><tr>
                        <td style="vertical-align:middle;padding-right:5px;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        </td>
                        <td style="vertical-align:middle;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:#fff;letter-spacing:0.06em;font-weight:600;">GitHub</td>
                      </tr></table>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:14px;border-top:1px solid #222220;margin-top:14px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="padding-top:12px;">
                      <tr>
                        <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:#555;">
                          Submitted via <a href="https://beniljenish.dev" style="color:#777;text-decoration:none;">beniljenish.dev</a>
                        </td>
                        <td align="right" style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:#444;white-space:nowrap;">
                          &copy; 2026 Benil Jenish. All rights reserved.
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
<body style="margin:0;padding:0;background:#f0ede8;font-family:'Helvetica Neue',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede8;padding:36px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;border-radius:6px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);" cellpadding="0" cellspacing="0">

          <!-- Dark Header -->
          <tr>
            <td style="background:#111110;padding:26px 32px 22px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:Georgia,serif;font-size:16px;color:#ffffff;letter-spacing:0.02em;">Benil Jenish</td>
                  <td align="right">
                    <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#555;border:1px solid #2a2a28;padding:3px 10px;border-radius:20px;">Auto Reply</span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:16px;">
                    <p style="margin:0 0 5px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#555;">Message received</p>
                    <h1 style="margin:0;font-family:Georgia,serif;font-size:24px;font-weight:400;color:#ffffff;line-height:1.25;">Thank you, {{name}}.</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Light Body -->
          <tr>
            <td style="background:#ffffff;padding:28px 32px 10px;">

              <!-- Intro text -->
              <p style="margin:0 0 20px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#555;line-height:1.8;font-weight:400;">
                Your message has been received. I'll get back to you as soon as possible — typically within <strong style="color:#111110;">24 hours</strong>.
              </p>

              <!-- Message recap -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;background:#f7f5f2;border:1px solid #ebe7e0;border-radius:0 3px 3px 0;">
                <tr>
                  <td style="padding:16px 18px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                      <tr><td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#a09a90;padding-bottom:4px;">Subject</td></tr>
                      <tr><td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#111110;font-weight:600;">{{subject}}</td></tr>
                    </table>
                    <table width="100%" cellpadding="0" cellspacing="0" style="padding-top:12px;border-top:1px solid #e5e0d8;">
                      <tr><td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#a09a90;padding-bottom:4px;">Your message</td></tr>
                      <tr><td style="font-family:Georgia,serif;font-size:13px;color:#555;line-height:1.8;">{{message}}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr><td style="height:1px;background:#ebe7e0;"></td></tr>
              </table>

              <!-- Sign off -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#777;font-weight:300;">Warm regards,</p>
                    <p style="margin:0 0 3px;font-family:Georgia,serif;font-size:17px;color:#111110;font-style:italic;">Benil Jenish</p>
                    <a href="https://beniljenish.dev" style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:#a09a90;text-decoration:none;letter-spacing:0.04em;">beniljenish.dev</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Dark Footer -->
          <tr>
            <td style="background:#111110;padding:18px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <a href="https://www.linkedin.com/in/benil-jenish/" style="display:inline-block;text-decoration:none;background:#0077B5;border-radius:3px;padding:5px 11px;margin-right:6px;">
                      <table cellpadding="0" cellspacing="0"><tr>
                        <td style="vertical-align:middle;padding-right:5px;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </td>
                        <td style="vertical-align:middle;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:#fff;letter-spacing:0.06em;font-weight:600;">LinkedIn</td>
                      </tr></table>
                    </a>
                    <a href="https://github.com/Beniljenish" style="display:inline-block;text-decoration:none;background:#2a2a28;border-radius:3px;padding:5px 11px;">
                      <table cellpadding="0" cellspacing="0"><tr>
                        <td style="vertical-align:middle;padding-right:5px;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        </td>
                        <td style="vertical-align:middle;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:#fff;letter-spacing:0.06em;font-weight:600;">GitHub</td>
                      </tr></table>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:14px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #222220;padding-top:12px;">
                      <tr>
                        <td style="padding-top:12px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:#555;">
                          Submitted via <a href="https://beniljenish.dev" style="color:#777;text-decoration:none;">beniljenish.dev</a>
                        </td>
                        <td align="right" style="padding-top:12px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:#444;white-space:nowrap;">
                          &copy; 2026 Benil Jenish. All rights reserved.

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
      from: 'Benil Jenish  <hello@beniljenish.dev>',
      to: 'beniljenish@gmail.com',
      replyTo: email,
      subject: `New message from ${name}: ${subject}`,
      html: buildNotificationHtml(data),
    });

    // 2. Auto-reply to the sender
    await resend.emails.send({
      from: 'Benil Jenish  <hello@beniljenish.dev>',
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
