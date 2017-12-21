const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

const dependency = {};

dependency.mail = (to, subject, html) => {
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"The Bassleer Team" <info@bassleer.nl>',
        to: to,
        subject: subject,
        html: html
    };

    return sgMail.send(mailOptions)
};

module.exports = dependency;