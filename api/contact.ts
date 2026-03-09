import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function fill(template: string, vars: Record<string, string>) {
  return template
    .replace(/\{\{name\}\}/g, vars.name)
    .replace(/\{\{email\}\}/g, vars.email)
    .replace(/\{\{subject\}\}/g, vars.subject)
    .replace(/\{\{message\}\}/g, vars.message.replace(/\n/g, '<br/>'));
}

const notificationTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Contact Message – Benil Jenish</title>
</head>
<body style="margin:0;padding:0;background:#f4f3f0;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3f0;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#ffffff;border-radius:4px;overflow:hidden;">
          <tr>
            <td style="padding:40px 48px 32px;border-bottom:1px solid #f0ede8;">
              <p style="margin:0 0 6px;font-family:'DM Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#b0a898;">New message</p>
              <h1 style="margin:0;font-family:'Georgia',serif;font-size:26px;font-weight:400;color:#1a1a1a;line-height:1.2;">You've got a message.</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 48px 8px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="font-family:'DM Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#b0a898;padding-bottom:6px;">Name</td></tr>
                <tr><td style="font-family:'DM Sans',Arial,sans-serif;font-size:15px;color:#1a1a1a;padding-bottom:12px;border-bottom:1px solid #f0ede8;">{{name}}</td></tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="font-family:'DM Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#b0a898;padding-bottom:6px;">Email</td></tr>
                <tr><td style="font-family:'DM Sans',Arial,sans-serif;font-size:15px;color:#1a1a1a;padding-bottom:12px;border-bottom:1px solid #f0ede8;">{{email}}</td></tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="font-family:'DM Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#b0a898;padding-bottom:6px;">Subject</td></tr>
                <tr><td style="font-family:'DM Sans',Arial,sans-serif;font-size:15px;color:#1a1a1a;padding-bottom:12px;border-bottom:1px solid #f0ede8;">{{subject}}</td></tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                <tr><td style="font-family:'DM Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#b0a898;padding-bottom:6px;">Message</td></tr>
                <tr><td style="font-family:'DM Sans',Arial,sans-serif;font-size:15px;color:#1a1a1a;line-height:1.75;padding:20px;background:#f9f8f6;border-radius:3px;">{{message}}</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 48px 40px;">
              <a href="mailto:{{email}}" style="display:inline-block;background:#1a1a1a;color:#ffffff;font-family:'DM Sans',Arial,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;padding:13px 32px;border-radius:2px;">Reply to {{name}}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 48px;border-top:1px solid #f0ede8;background:#faf9f7;">
              <p style="margin:0;font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:#b0a898;">This message was submitted via your website contact form.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const autoreplyTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Thanks for reaching out – Benil Jenish</title>
</head>
<body style="margin:0;padding:0;background:#f4f3f0;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3f0;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#ffffff;border-radius:4px;overflow:hidden;">
          <tr>
            <td style="padding:40px 48px 32px;border-bottom:1px solid #f0ede8;">
              <p style="margin:0 0 6px;font-family:'DM Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#b0a898;">Thank you</p>
              <h1 style="margin:0;font-family:'Georgia',serif;font-size:26px;font-weight:400;color:#1a1a1a;line-height:1.3;">Thanks for reaching out, {{name}}.</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 48px 8px;">
              <p style="margin:0 0 20px;font-family:'DM Sans',Arial,sans-serif;font-size:15px;color:#555;line-height:1.8;font-weight:300;">I've received your message and will get back to you as soon as possible — usually within 24 hours.</p>
              <p style="margin:0 0 32px;font-family:'DM Sans',Arial,sans-serif;font-size:15px;color:#555;line-height:1.8;font-weight:300;">In the meantime, here's a copy of what you sent:</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;border-left:2px solid #e0ddd8;">
                <tr>
                  <td style="padding:0 0 0 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                      <tr><td style="font-family:'DM Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.13em;text-transform:uppercase;color:#b0a898;padding-bottom:3px;">Subject</td></tr>
                      <tr><td style="font-family:'DM Sans',Arial,sans-serif;font-size:14px;color:#1a1a1a;">{{subject}}</td></tr>
                    </table>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="font-family:'DM Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.13em;text-transform:uppercase;color:#b0a898;padding-bottom:3px;">Message</td></tr>
                      <tr><td style="font-family:'DM Sans',Arial,sans-serif;font-size:14px;color:#555;line-height:1.75;">{{message}}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-family:'DM Sans',Arial,sans-serif;font-size:15px;color:#555;line-height:1.8;font-weight:300;">Looking forward to connecting.</p>
              <p style="margin:0 0 36px;font-family:'Georgia',serif;font-size:16px;color:#1a1a1a;font-style:italic;">— Benil</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 48px;border-top:1px solid #f0ede8;background:#faf9f7;">
              <p style="margin:0;font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:#b0a898;">You're receiving this because you submitted the contact form on my website.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const vars = { name, email, subject: subject || '—', message };

  try {
    await Promise.all([
      // Notification email → you
      resend.emails.send({
        from: 'Portfolio Contact <hello@beniljenish.dev>',
        to: 'beniljenish@gmail.com',
        replyTo: email,
        subject: `New message from ${name}${subject ? ` — ${subject}` : ''}`,
        html: fill(notificationTemplate, vars),
      }),
      // Auto-reply → sender
      resend.emails.send({
        from: 'Benil Jenish <hello@beniljenish.dev>',
        to: email,
        subject: `Thanks for reaching out, ${name}`,
        html: fill(autoreplyTemplate, vars),
      }),
    ]);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
