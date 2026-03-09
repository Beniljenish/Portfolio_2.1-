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
<body style="margin:0;padding:0;background:#edecea;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#edecea;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:580px;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#1a1a1a;padding:18px 40px;border-radius:4px 4px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-family:Georgia,serif;font-size:17px;color:#ffffff;letter-spacing:0.04em;font-weight:400;">Benil Jenish</span>
                    <span style="font-family:Arial,sans-serif;font-size:11px;color:#888;letter-spacing:0.1em;margin-left:10px;text-transform:uppercase;">· beniljenish.dev</span>
                  </td>
                  <td align="right">
                    <span style="font-family:Arial,sans-serif;font-size:10px;color:#666;letter-spacing:0.12em;text-transform:uppercase;">Notification</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:44px 40px 36px;border-left:1px solid #e4e1dc;border-right:1px solid #e4e1dc;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;padding-bottom:28px;border-bottom:2px solid #f0ede8;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#b0a898;">New Enquiry Received</p>
                    <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#1a1a1a;line-height:1.25;">You've received a new message.</h1>
                  </td>
                </tr>
              </table>
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
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td>
                    <p style="margin:0 0 5px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#b0a898;">Subject</p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a;font-weight:600;padding:10px 14px;background:#f9f8f6;border-left:3px solid #1a1a1a;border-radius:0 3px 3px 0;">{{subject}}</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td>
                    <p style="margin:0 0 5px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#b0a898;">Message</p>
                    <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:#444;line-height:1.85;padding:18px 20px;background:#f9f8f6;border:1px solid #ede9e3;border-left:3px solid #1a1a1a;border-radius:0 3px 3px 0;">{{message}}</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr><td style="height:1px;background:#f0ede8;"></td></tr>
              </table>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a href="mailto:{{email}}" style="display:inline-block;background:#1a1a1a;color:#ffffff;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;padding:14px 36px;border-radius:2px;font-weight:600;">Reply to {{name}} &rarr;</a>
                  </td>
                  <td style="padding-left:20px;">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#b0a898;line-height:1.6;">Sent from your website<br/>contact form</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#1a1a1a;padding:22px 40px;border-radius:0 0 4px 4px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <a href="https://www.linkedin.com/in/benil-jenish/" style="display:inline-block;text-decoration:none;background:#0077B5;border-radius:3px;padding:6px 12px;margin-right:8px;"><table cellpadding="0" cellspacing="0"><tr><td style="vertical-align:middle;padding-right:6px;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#ffffff"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></td><td style="vertical-align:middle;font-family:Arial,sans-serif;font-size:10px;color:#ffffff;letter-spacing:0.07em;font-weight:600;">LinkedIn</td></tr></table></a>
                    <a href="https://github.com/Beniljenish" style="display:inline-block;text-decoration:none;background:#333;border-radius:3px;padding:6px 12px;"><table cellpadding="0" cellspacing="0"><tr><td style="vertical-align:middle;padding-right:6px;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></td><td style="vertical-align:middle;font-family:Arial,sans-serif;font-size:10px;color:#ffffff;letter-spacing:0.07em;font-weight:600;">GitHub</td></tr></table></a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:16px;border-top:1px solid #2e2e2e;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                      <tr>
                        <td style="font-family:Arial,sans-serif;font-size:10px;color:#666;">This message was submitted via <a href="https://beniljenish.dev" style="color:#888;text-decoration:none;">beniljenish.dev</a></td>
                        <td align="right" style="font-family:Arial,sans-serif;font-size:10px;color:#555;">&copy; 2025 Benil Jenish. All rights reserved.</td>
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
</html>`;
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
<body style="margin:0;padding:0;background:#edecea;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#edecea;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:580px;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#1a1a1a;padding:18px 40px;border-radius:4px 4px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-family:Georgia,serif;font-size:17px;color:#ffffff;letter-spacing:0.04em;font-weight:400;">Benil Jenish</span>
                    <span style="font-family:Arial,sans-serif;font-size:11px;color:#888;letter-spacing:0.1em;margin-left:10px;text-transform:uppercase;">· beniljenish.dev</span>
                  </td>
                  <td align="right">
                    <span style="font-family:Arial,sans-serif;font-size:10px;color:#666;letter-spacing:0.12em;text-transform:uppercase;">Auto Reply</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:44px 40px 36px;border-left:1px solid #e4e1dc;border-right:1px solid #e4e1dc;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;padding-bottom:28px;border-bottom:2px solid #f0ede8;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#b0a898;">Message Received</p>
                    <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#1a1a1a;line-height:1.25;">Thank you for reaching out, {{name}}.</h1>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td>
                    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;color:#555;line-height:1.85;font-weight:400;">I appreciate you taking the time to get in touch. Your message has been received and I will respond as soon as possible — typically within <strong style="color:#1a1a1a;">24 hours</strong>.</p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#555;line-height:1.85;font-weight:400;">For your reference, here is a summary of your submission:</p>
                  </td>
                </tr>
              </table>
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
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr><td style="height:1px;background:#f0ede8;"></td></tr>
              </table>
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
          <tr>
            <td style="background:#1a1a1a;padding:22px 40px;border-radius:0 0 4px 4px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <a href="https://www.linkedin.com/in/benil-jenish/" style="display:inline-block;text-decoration:none;background:#0077B5;border-radius:3px;padding:6px 12px;margin-right:8px;"><table cellpadding="0" cellspacing="0"><tr><td style="vertical-align:middle;padding-right:6px;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#ffffff"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></td><td style="vertical-align:middle;font-family:Arial,sans-serif;font-size:10px;color:#ffffff;letter-spacing:0.07em;font-weight:600;">LinkedIn</td></tr></table></a>
                    <a href="https://github.com/Beniljenish" style="display:inline-block;text-decoration:none;background:#333;border-radius:3px;padding:6px 12px;"><table cellpadding="0" cellspacing="0"><tr><td style="vertical-align:middle;padding-right:6px;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></td><td style="vertical-align:middle;font-family:Arial,sans-serif;font-size:10px;color:#ffffff;letter-spacing:0.07em;font-weight:600;">GitHub</td></tr></table></a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #2e2e2e;padding-top:16px;margin-top:0;">
                      <tr>
                        <td style="padding-top:14px;font-family:Arial,sans-serif;font-size:10px;color:#666;">You're receiving this because you submitted the contact form on <a href="https://beniljenish.dev" style="color:#888;text-decoration:none;">beniljenish.dev</a></td>
                        <td align="right" style="padding-top:14px;font-family:Arial,sans-serif;font-size:10px;color:#555;white-space:nowrap;">&copy; 2025 Benil Jenish. All rights reserved.</td>
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
</html>`;
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
