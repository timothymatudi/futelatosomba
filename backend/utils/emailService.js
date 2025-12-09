// Email service utility
// Supports multiple email providers: NodeMailer (SMTP), SendGrid, Console (dev)

const sendEmail = async ({ to, subject, html, text }) => {
  const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'console';

  try {
    switch (EMAIL_PROVIDER) {
      case 'sendgrid':
        return await sendWithSendGrid({ to, subject, html, text });

      case 'smtp':
        return await sendWithSMTP({ to, subject, html, text });

      case 'console':
      default:
        // Development mode - log to console
        console.log('\n📧 ========== EMAIL ===========');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`HTML: ${html}`);
        if (text) console.log(`Text: ${text}`);
        console.log('================================\n');
        return { success: true, provider: 'console' };
    }
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// SendGrid implementation
const sendWithSendGrid = async ({ to, subject, html, text }) => {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to,
    from: process.env.FROM_EMAIL || 'noreply@futelatosomba.com',
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
  };

  await sgMail.send(msg);
  return { success: true, provider: 'sendgrid' };
};

// SMTP (NodeMailer) implementation
const sendWithSMTP = async ({ to, subject, html, text }) => {
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL || '"futelatosomba" <noreply@futelatosomba.com>',
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
  });

  return { success: true, provider: 'smtp', messageId: info.messageId };
};

module.exports = { sendEmail };
