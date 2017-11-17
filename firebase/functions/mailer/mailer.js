const nodemailer = require('nodemailer');
const dependency = {};

dependency.getTransporter = (user, password) => {
    return nodemailer.createTransport({
        host: '185.182.56.198',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "info@bassleer.nl", // generated ethereal user
            pass: "abcdefg"  // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });
}

dependency.mail = (to, subject, html) => {
    // setup email data with unicode symbols
    return new Promise((resolve, reject) => {
        let mailOptions = {
            from: '"The Bassleer Team" <info@bassleer.nl>',
            to: to,
            subject: subject,
            html: html
        };

        const transporter = dependency.getTransporter("info@bassleer.nl", "abcdefg");
        
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                //return console.log(error);
                return reject(error);
            }
            console.log('Message sent: %s', info.messageId);
            return resolve(info);
        });
    });
}

module.exports = dependency;