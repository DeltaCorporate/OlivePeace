import nodemailer from 'nodemailer';

const mailer = nodemailer.createTransport({
   host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT
});

export default mailer;