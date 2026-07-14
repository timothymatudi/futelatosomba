const nodemailer = require('nodemailer');

/**
 * Email Service for Futelatosomba
 * Handles all email sending functionality
 */

// Create transporter based on environment
const createTransporter = () => {
  // For production, use SendGrid or another email service
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  // For development, use Ethereal Email (test account)
  // This will log emails to console instead of sending them
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

const transporter = createTransporter();

/**
 * Send email verification
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} token - Verification token
 */
const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Futelatosomba" <${process.env.EMAIL_FROM || 'noreply@futelatosomba.com'}>`,
    to: email,
    subject: 'Vérifiez votre adresse email - Futelatosomba',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-top: none;
          }
          .button {
            display: inline-block;
            padding: 15px 30px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .button:hover {
            background: #0056b3;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            border-radius: 0 0 10px 10px;
            border: 1px solid #e0e0e0;
            border-top: none;
          }
          .flag {
            font-size: 24px;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="flag">🇨🇩</div>
          <h1>Bienvenue sur Futelatosomba!</h1>
        </div>
        <div class="content">
          <p>Bonjour ${name},</p>

          <p>Merci de vous être inscrit sur Futelatosomba, la plateforme immobilière de référence en RDC!</p>

          <p>Pour activer votre compte et commencer à explorer nos propriétés, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous:</p>

          <center>
            <a href="${verificationUrl}" class="button">Vérifier mon email</a>
          </center>

          <p>Ou copiez et collez ce lien dans votre navigateur:</p>
          <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>

          <p>Ce lien expirera dans 24 heures pour des raisons de sécurité.</p>

          <p>Si vous n'avez pas créé de compte sur Futelatosomba, vous pouvez ignorer cet email en toute sécurité.</p>

          <p>Cordialement,<br>
          L'équipe Futelatosomba</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Futelatosomba. Tous droits réservés.</p>
          <p>Plateforme immobilière N°1 en République Démocratique du Congo</p>
        </div>
      </body>
      </html>
    `,
    text: `
Bonjour ${name},

Merci de vous être inscrit sur Futelatosomba!

Pour activer votre compte, veuillez cliquer sur le lien suivant:
${verificationUrl}

Ce lien expirera dans 24 heures.

Si vous n'avez pas créé de compte, ignorez cet email.

Cordialement,
L'équipe Futelatosomba
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);

    // For development, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} token - Reset token
 */
const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Futelatosomba" <${process.env.EMAIL_FROM || 'noreply@futelatosomba.com'}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe - Futelatosomba',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #dc3545 0%, #bd2130 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-top: none;
          }
          .button {
            display: inline-block;
            padding: 15px 30px;
            background: #dc3545;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .button:hover {
            background: #bd2130;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            border-radius: 0 0 10px 10px;
            border: 1px solid #e0e0e0;
            border-top: none;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔒 Réinitialisation de mot de passe</h1>
        </div>
        <div class="content">
          <p>Bonjour ${name},</p>

          <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Futelatosomba.</p>

          <p>Pour créer un nouveau mot de passe, cliquez sur le bouton ci-dessous:</p>

          <center>
            <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
          </center>

          <p>Ou copiez et collez ce lien dans votre navigateur:</p>
          <p style="word-break: break-all; color: #dc3545;">${resetUrl}</p>

          <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul>
              <li>Ce lien expirera dans 1 heure</li>
              <li>Vous ne pouvez l'utiliser qu'une seule fois</li>
            </ul>
          </div>

          <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe actuel restera inchangé.</p>

          <p>Cordialement,<br>
          L'équipe Futelatosomba</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Futelatosomba. Tous droits réservés.</p>
        </div>
      </body>
      </html>
    `,
    text: `
Bonjour ${name},

Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.

Pour créer un nouveau mot de passe, cliquez sur le lien suivant:
${resetUrl}

Ce lien expirera dans 1 heure et ne peut être utilisé qu'une seule fois.

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

Cordialement,
L'équipe Futelatosomba
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);

    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Send property alert email
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {Array} properties - Array of matching properties
 * @param {Object} searchCriteria - Search criteria that was saved
 */
const sendPropertyAlertEmail = async (email, name, properties, searchCriteria) => {
  const propertiesHtml = properties.slice(0, 5).map(property => `
    <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; margin: 15px 0;">
      <h3 style="margin-top: 0;">
        <a href="${process.env.FRONTEND_URL}/properties/${property._id}" style="color: #007bff; text-decoration: none;">
          ${property.title}
        </a>
      </h3>
      <p style="font-size: 18px; font-weight: bold; color: #28a745; margin: 10px 0;">
        ${property.price} ${property.currency || 'USD'}
      </p>
      <p style="color: #6c757d; margin: 5px 0;">
        📍 ${property.address}, ${property.city}
      </p>
      <p style="margin: 5px 0;">
        🛏️ ${property.bedrooms} chambres • 🛁 ${property.bathrooms} salles de bain • 📐 ${property.area} m²
      </p>
    </div>
  `).join('');

  const mailOptions = {
    from: `"Futelatosomba Alertes" <${process.env.EMAIL_FROM || 'alerts@futelatosomba.com'}>`,
    to: email,
    subject: `🏡 ${properties.length} nouvelle(s) propriété(s) correspondent à votre recherche!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-top: none;
          }
          .button {
            display: inline-block;
            padding: 15px 30px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            border-radius: 0 0 10px 10px;
            border: 1px solid #e0e0e0;
            border-top: none;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏡 Nouvelles propriétés disponibles!</h1>
        </div>
        <div class="content">
          <p>Bonjour ${name},</p>

          <p>Bonne nouvelle! Nous avons trouvé <strong>${properties.length}</strong> nouvelle(s) propriété(s) qui correspondent à vos critères de recherche.</p>

          ${propertiesHtml}

          ${properties.length > 5 ? `<p><em>... et ${properties.length - 5} autre(s) propriété(s)</em></p>` : ''}

          <center>
            <a href="${process.env.FRONTEND_URL}/properties?alert=true" class="button">Voir toutes les propriétés</a>
          </center>

          <p style="font-size: 12px; color: #6c757d; margin-top: 30px;">
            Pour modifier vos alertes ou vous désabonner, visitez votre
            <a href="${process.env.FRONTEND_URL}/dashboard">tableau de bord</a>.
          </p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Futelatosomba. Tous droits réservés.</p>
        </div>
      </body>
      </html>
    `,
    text: `
Bonjour ${name},

Nous avons trouvé ${properties.length} nouvelle(s) propriété(s) qui correspondent à vos critères!

${properties.slice(0, 5).map(p => `
${p.title}
${p.price} ${p.currency || 'USD'}
${p.address}, ${p.city}
${p.bedrooms} chambres • ${p.bathrooms} salles de bain • ${p.area} m²
Voir: ${process.env.FRONTEND_URL}/properties/${p._id}
`).join('\n---\n')}

Voir toutes les propriétés: ${process.env.FRONTEND_URL}/properties?alert=true

Cordialement,
L'équipe Futelatosomba
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Property alert email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending property alert email:', error);
    throw error;
  }
};

/**
 * Send contact agent notification email
 * @param {Object} agent - Agent user object
 * @param {Object} property - Property object
 * @param {Object} inquiry - Inquiry details (name, email, phone, message)
 */
const sendContactAgentEmail = async (agent, property, inquiry) => {
  const mailOptions = {
    from: `"Futelatosomba Contact" <${process.env.EMAIL_FROM || 'contact@futelatosomba.com'}>`,
    to: agent.email,
    replyTo: inquiry.email,
    subject: `Nouvelle demande de contact pour: ${property.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #17a2b8 0%, #117a8b 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-top: none;
          }
          .property-card {
            background: #f8f9fa;
            border-left: 4px solid #007bff;
            padding: 15px;
            margin: 20px 0;
          }
          .inquiry-card {
            background: #fff;
            border: 1px solid #dee2e6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .button {
            display: inline-block;
            padding: 15px 30px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            border-radius: 0 0 10px 10px;
            border: 1px solid #e0e0e0;
            border-top: none;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📬 Nouvelle demande de contact</h1>
        </div>
        <div class="content">
          <p>Bonjour ${agent.fullName || agent.username},</p>

          <p>Vous avez reçu une nouvelle demande de contact concernant votre propriété:</p>

          <div class="property-card">
            <h3 style="margin-top: 0;">${property.title}</h3>
            <p style="font-size: 18px; font-weight: bold; color: #28a745;">
              ${property.price} ${property.currency || 'USD'}
            </p>
            <p>📍 ${property.address}, ${property.city}</p>
            <a href="${process.env.FRONTEND_URL}/properties/${property._id}">Voir la propriété →</a>
          </div>

          <h3>Détails du contact:</h3>
          <div class="inquiry-card">
            <p><strong>Nom:</strong> ${inquiry.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${inquiry.email}">${inquiry.email}</a></p>
            ${inquiry.phone ? `<p><strong>Téléphone:</strong> <a href="tel:${inquiry.phone}">${inquiry.phone}</a></p>` : ''}
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; padding: 10px; background: #f8f9fa; border-radius: 5px;">${inquiry.message}</p>
          </div>

          <center>
            <a href="mailto:${inquiry.email}" class="button">Répondre par email</a>
          </center>

          <p style="font-size: 12px; color: #6c757d; margin-top: 30px;">
            💡 Conseil: Répondez rapidement pour maximiser vos chances de conclure une vente!
          </p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Futelatosomba. Tous droits réservés.</p>
        </div>
      </body>
      </html>
    `,
    text: `
Bonjour ${agent.fullName || agent.username},

Vous avez reçu une nouvelle demande de contact pour:
${property.title}
${property.price} ${property.currency || 'USD'}
${property.address}, ${property.city}

Détails du contact:
Nom: ${inquiry.name}
Email: ${inquiry.email}
${inquiry.phone ? `Téléphone: ${inquiry.phone}` : ''}

Message:
${inquiry.message}

Voir la propriété: ${process.env.FRONTEND_URL}/properties/${property._id}

Répondez rapidement pour maximiser vos chances!

Cordialement,
L'équipe Futelatosomba
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Contact agent email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending contact agent email:', error);
    throw error;
  }
};

/**
 * Send inquiry confirmation email to user
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {Object} property - Property object
 */
const sendInquiryConfirmationEmail = async (email, name, property) => {
  const mailOptions = {
    from: `"Futelatosomba" <${process.env.EMAIL_FROM || 'noreply@futelatosomba.com'}>`,
    to: email,
    subject: `Confirmation: Votre message a été envoyé - ${property.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-top: none;
          }
          .success-badge {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            border-radius: 0 0 10px 10px;
            border: 1px solid #e0e0e0;
            border-top: none;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✅ Message envoyé avec succès!</h1>
        </div>
        <div class="content">
          <p>Bonjour ${name},</p>

          <div class="success-badge">
            <strong>Votre message a été transmis à l'agent immobilier</strong>
          </div>

          <p>Merci de votre intérêt pour:</p>
          <p><strong>${property.title}</strong><br>
          ${property.address}, ${property.city}</p>

          <p>L'agent vous contactera dans les plus brefs délais, généralement dans les 24-48 heures.</p>

          <p>En attendant, vous pouvez:</p>
          <ul>
            <li>Continuer à explorer nos <a href="${process.env.FRONTEND_URL}/properties">propriétés disponibles</a></li>
            <li>Sauvegarder vos propriétés favorites</li>
            <li>Créer des alertes pour être notifié des nouvelles annonces</li>
          </ul>

          <p>Cordialement,<br>
          L'équipe Futelatosomba</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Futelatosomba. Tous droits réservés.</p>
        </div>
      </body>
      </html>
    `,
    text: `
Bonjour ${name},

Votre message a été envoyé avec succès!

Propriété concernée:
${property.title}
${property.address}, ${property.city}

L'agent vous contactera dans les 24-48 heures.

Cordialement,
L'équipe Futelatosomba
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Inquiry confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending inquiry confirmation email:', error);
    throw error;
  }
};

/**
 * Send broadcast email
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} message - Broadcast message
 */
const escapeHtml = (str) => String(str)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const sendBroadcastEmail = async (email, name, message) => {
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  const mailOptions = {
    from: `"Futelatosomba" <${process.env.EMAIL_FROM || 'noreply@futelatosomba.com'}>`,
    to: email,
    subject: 'Annonce - Futelatosomba',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6;">
        <p>Bonjour ${safeName},</p>
        <p>${safeMessage}</p>
        <p>Cordialement,<br>L'équipe Futelatosomba</p>
      </body>
      </html>
    `,
    text: `
Bonjour ${name},

${message}

Cordialement,
L'équipe Futelatosomba
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Broadcast email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending broadcast email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPropertyAlertEmail,
  sendContactAgentEmail,
  sendInquiryConfirmationEmail,
  sendBroadcastEmail
};
