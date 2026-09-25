const nodemailer = require('nodemailer');

const isConfigured = () => {
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
};

exports.sendPasswordResetEmail = (email, resetToken) => {
    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    const resetLink = `${appUrl}/reset-password?token=${resetToken}`;

    if (!isConfigured()) {
        console.log('SMTP not configured. Password reset link:', resetLink);
        return Promise.resolve();
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    return transporter.sendMail({
        from: process.env.SMTP_FROM || 'Nuzzo <no-reply@nuzzo.pt>',
        to: email,
        subject: 'Reset your Nuzzo password',
        text: `Hi!\n\nTo choose a new password, open this link:\n${resetLink}\n\nThe link works for one hour. If it wasn't you, just ignore this email.\n\nNuzzo`,
    });
};
