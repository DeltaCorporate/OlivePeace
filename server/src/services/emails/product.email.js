import mailer from '../../../config/nodemailer.config.js';

export const sendStockAlertEmail = async (to, product) => {
    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: to,
        subject: 'Alerte de stock épuisé',
        html: `
      <h1>Alerte de stock épuisé</h1>
      <p>Le produit suivant n'est plus en stock :</p>
      <p><strong>${product.name}</strong></p>
      <p>Veuillez vérifier et réapprovisionner le stock dès que possible.</p>
      <a href="${process.env.CLIENT_URL}/products/${product.slug}">Voir le produit</a>
    `
    };

    await mailer.sendMail(mailOptions);
};

