const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

const dependency = {};

dependency.mail = (to, subject, html) => {
    // setup email data with unicode symbols
    return new Promise((resolve, reject) => {
        let mailOptions = {
            from: '"The Bassleer Team" <info@bassleer.nl>',
            to: to,
            subject: subject,
            html: html
        };

        sgMail.send(mailOptions)
        .then(() => {
            resolve();
        })
    });
};

module.exports = dependency;