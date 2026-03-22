import nodemailer from "nodemailer"

// ── Transporter — Gmail SMTP ──────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// ── Send contact form notification ───────────────────────────────
export async function sendContactEmail(data: {
  name:     string
  email:    string
  phone?:   string
  subject?: string
  message:  string
}) {
  const { name, email, phone, subject, message } = data

  // ── Email to owner — notification ─────────────────────────────
  await transporter.sendMail({
    from:    `"Shyam Civil Construction Website" <${process.env.EMAIL_USER}>`,
    to:      process.env.EMAIL_TO,
    subject: `New Contact Form Submission — ${subject || "General Enquiry"}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body        { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
          .container  { max-width: 600px; margin: 0 auto; padding: 0; }
          .header     { background: #000; padding: 30px; text-align: center; }
          .header h1  { color: #C9A96E; margin: 0; font-size: 20px; letter-spacing: 2px; }
          .header p   { color: #888; margin: 8px 0 0; font-size: 13px; }
          .body       { padding: 32px; background: #ffffff; }
          .field      { margin-bottom: 20px; border-bottom: 1px solid #f0f0f0; padding-bottom: 20px; }
          .field:last-child { border-bottom: none; }
          .label      { font-size: 11px; font-weight: bold; color: #999;
                        text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
          .value      { font-size: 15px; color: #222; line-height: 1.6; }
          .message    { background: #f9f9f9; padding: 16px; border-radius: 8px;
                        font-size: 15px; line-height: 1.7; color: #444; }
          .footer     { background: #f5f5f5; padding: 20px 32px; text-align: center; }
          .footer p   { color: #999; font-size: 12px; margin: 4px 0; }
          .badge      { display: inline-block; background: #C9A96E; color: #000;
                        padding: 4px 12px; border-radius: 20px; font-size: 11px;
                        font-weight: bold; letter-spacing: 1px; margin-bottom: 16px; }
        </style>
      </head>
      <body>
        <div class="container">

          <div class="header">
            <h1>SHYAM CIVIL CONSTRUCTION</h1>
            <p>New message from your website</p>
          </div>

          <div class="body">
            <div class="badge">NEW ENQUIRY</div>

            <div class="field">
              <div class="label">Name</div>
              <div class="value">${name}</div>
            </div>

            <div class="field">
              <div class="label">Email</div>
              <div class="value">
                <a href="mailto:${email}" style="color: #C9A96E;">${email}</a>
              </div>
            </div>

            ${phone ? `
            <div class="field">
              <div class="label">Phone</div>
              <div class="value">
                <a href="tel:${phone}" style="color: #C9A96E;">${phone}</a>
              </div>
            </div>
            ` : ""}

            ${subject ? `
            <div class="field">
              <div class="label">Subject</div>
              <div class="value">${subject}</div>
            </div>
            ` : ""}

            <div class="field">
              <div class="label">Message</div>
              <div class="message">${message.replace(/\n/g, "<br>")}</div>
            </div>

          </div>

          <div class="footer">
            <p>This message was sent from contact form on your website.</p>
            <p>Reply directly to this email to respond to ${name}.</p>
            <p style="margin-top: 12px; color: #bbb;">
              Shyam Civil Construction — Kandivali (E), Mumbai 400101
            </p>
          </div>

        </div>
      </body>
      </html>
    `,
    // ── Reply-To set to sender's email so you can reply directly ─
    replyTo: email,
  })

  // ── Auto-reply to sender — confirmation ───────────────────────
  await transporter.sendMail({
    from:    `"Shyam Civil Construction" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: "We received your message — Shyam Civil Construction",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body        { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
          .container  { max-width: 600px; margin: 0 auto; }
          .header     { background: #000; padding: 30px; text-align: center; }
          .header h1  { color: #C9A96E; margin: 0; font-size: 20px; letter-spacing: 2px; }
          .body       { padding: 32px; background: #ffffff; }
          .body p     { line-height: 1.8; font-size: 15px; color: #444; }
          .highlight  { color: #000; font-weight: bold; }
          .details    { background: #f9f9f9; border-radius: 8px; padding: 20px;
                        margin: 24px 0; border-left: 3px solid #C9A96E; }
          .details p  { margin: 6px 0; font-size: 14px; }
          .cta        { text-align: center; margin: 32px 0; }
          .btn        { display: inline-block; background: #000; color: #fff !important;
                        padding: 14px 32px; border-radius: 50px; text-decoration: none;
                        font-weight: bold; font-size: 14px; letter-spacing: 1px; }
          .footer     { background: #f5f5f5; padding: 20px 32px; text-align: center; }
          .footer p   { color: #999; font-size: 12px; margin: 4px 0; }
        </style>
      </head>
      <body>
        <div class="container">

          <div class="header">
            <h1>SHYAM CIVIL CONSTRUCTION</h1>
          </div>

          <div class="body">
            <p>Dear <span class="highlight">${name}</span>,</p>

            <p>
              Thank you for reaching out to us! We have received your message
              and our team will get back to you within <strong>24-48 hours</strong>.
            </p>

            <div class="details">
              <p><strong>Your enquiry details:</strong></p>
              ${subject ? `<p>Subject: ${subject}</p>` : ""}
              <p>Message: ${message.length > 100
                ? message.substring(0, 100) + "..."
                : message}
              </p>
            </div>

            <p>
              In the meantime, feel free to explore our recent projects and
              services on our website.
            </p>

            <div class="cta">
              <a href="https://shyamcivilconstruction.com/projects"
                 class="btn">
                View Our Projects
              </a>
            </div>

            <p>
              If you have any urgent requirements, you can also reach us at:<br>
              📞 <strong>+91 9324455382</strong><br>
              ✉️ <strong>shyamcivilconstruction@gmail.com</strong>
            </p>

            <p>
              Warm regards,<br>
              <strong>Shyam Civil Construction Team</strong>
            </p>
          </div>

          <div class="footer">
            <p>D1, First Floor, Akurli Samata CHS LTD,</p>
            <p>Road No RSC 1, Akurli Road, Kandivali (E) - Mumbai 400101</p>
          </div>

        </div>
      </body>
      </html>
    `,
  })
}
