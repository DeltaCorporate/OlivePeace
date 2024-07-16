import mailer from '../../../config/nodemailer.config.js';

export const sendConfirmationEmail = async (email, token) => {
    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Confirmation de votre compte',
        html: `
            <h1>Confirmation de votre compte</h1>
            <p>Veuillez cliquer sur le lien suivant pour confirmer votre compte :</p>
            <a href="${process.env.CLIENT_URL}/confirm-email/${token}">Confirmer mon compte</a>
        `
    };

    let send = await mailer.sendMail(mailOptions);
};

export const sendResetPasswordEmail = async (email, token) => {
    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
            <h1>Réinitialisation de votre mot de passe</h1>
            <p>Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe :</p>
            <a href="${process.env.CLIENT_URL}/reset-password/${token}">Réinitialiser mon mot de passe</a>
        `
    };

    await mailer.sendMail(mailOptions);
};

export const sendPasswordChangeReminder = async (email) => {
    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Rappel de changement de mot de passe',
        html: `
            <h1>Rappel de changement de mot de passe</h1>
            <p>Il est recommandé de changer votre mot de passe régulièrement pour des raisons de sécurité.</p>
            <p>Veuillez vous connecter à votre compte pour changer votre mot de passe.</p>
        `
    };

    await mailer.sendMail(mailOptions);
};