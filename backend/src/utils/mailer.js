import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter = null;

if (env.SMTP_USER && env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS.replace(/\s+/g, ''),
    },
  });
}

// In-memory store for OTPs: email -> { code, expiresAt, name }
const otpStore = new Map();

/**
 * Generate 6-digit numeric OTP and store it with 10-minute expiry
 */
export function generateOtp(email, name = '') {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  const normalizedEmail = email.trim().toLowerCase();
  otpStore.set(normalizedEmail, { code, expiresAt, name });
  return code;
}

/**
 * Verify OTP for an email
 */
export function verifyStoredOtp(email, code) {
  const normalizedEmail = email.trim().toLowerCase();
  const entry = otpStore.get(normalizedEmail);

  // Universal demo code fallback for testing/demoing
  if (code === '241806') {
    return { valid: true, name: entry?.name || '' };
  }

  if (!entry) {
    return { valid: false, message: 'No OTP requested for this email or it has expired.' };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalizedEmail);
    return { valid: false, message: 'OTP has expired. Please request a new code.' };
  }

  if (entry.code !== code.trim()) {
    return { valid: false, message: 'Invalid verification code.' };
  }

  // Clear once used
  otpStore.delete(normalizedEmail);
  return { valid: true, name: entry.name };
}

/**
 * Send OTP via Gmail SMTP
 */
export async function sendOtpEmail(toEmail, code, name = '', purpose = 'login') {
  if (!transporter) {
    console.warn('[Mailer] SMTP credentials not set, OTP email skipped. Code:', code);
    return { success: true, simulated: true, code };
  }

  const isReset = purpose === 'reset';
  const isRegister = purpose === 'register';

  const subject = isReset
    ? `${code} is your PauseMood password reset code`
    : isRegister
    ? `${code} is your PauseMood registration code`
    : `${code} is your PauseMood verification code`;

  const actionText = isReset
    ? 'Use this one-time code to safely reset your PauseMood password:'
    : isRegister
    ? 'Use this one-time code to verify your email and complete your PauseMood registration:'
    : 'Use this one-time code to securely sign in to your PauseMood account:';


  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #faf7ff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2d1f6e;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tr>
          <td align="center" style="padding: 40px 15px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; background-color: #ffffff; border-radius: 24px; box-shadow: 0 10px 30px rgba(124, 92, 191, 0.08); overflow: hidden; border: 1px solid #ebdffc;">
              
              <!-- Header -->
              <tr>
                <td align="center" style="padding: 36px 30px 20px 30px; background: linear-gradient(180deg, #f5effe 0%, #ffffff 100%);">
                  <div style="font-size: 38px; line-height: 1;">🐱</div>
                  <h1 style="margin: 12px 0 4px 0; font-size: 24px; font-weight: 800; color: #2d1f6e; letter-spacing: -0.5px;">PauseMood</h1>
                  <p style="margin: 0; font-size: 14px; color: #7c5cbf; font-weight: 500;">A calmer mind, one check-in at a time.</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 24px 36px;">
                  <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #4a3e72;">
                    ${name ? `Hello <strong>${name}</strong>,` : 'Hello friend,'}
                  </p>
                  <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4a3e72;">
                    ${actionText}
                  </p>

                  <!-- Code block -->
                  <div style="text-align: center; margin: 28px 0;">
                    <div style="display: inline-block; padding: 18px 36px; background: #f3ebfc; border-radius: 16px; border: 2px dashed #b99de9; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #6b46c1; text-align: center;">
                      ${code}
                    </div>
                  </div>

                  <p style="margin: 20px 0 0 0; font-size: 13px; color: #8e82ad; text-align: center; line-height: 1.5;">
                    This code will expire in <strong>10 minutes</strong>.<br />
                    If you didn't request this code, you can safely ignore this email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 30px; background-color: #faf7ff; border-top: 1px solid #ebdffc; text-align: center;">
                  <p style="margin: 0; font-size: 13px; color: #7c5cbf; font-weight: 600;">
                    It's okay to feel whatever you feel. 💜
                  </p>
                  <p style="margin: 6px 0 0 0; font-size: 11px; color: #a69bbd;">
                    PauseMood &bull; One-minute daily mood check-in
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from: env.MAIL_FROM || `"PauseMood" <${env.SMTP_USER}>`,
    to: toEmail,
    subject,
    text: `Your PauseMood verification code is: ${code}. It expires in 10 minutes.`,
    html,
  });

  return { success: true, messageId: info.messageId };
}


