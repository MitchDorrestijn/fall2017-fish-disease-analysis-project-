const nodemailer = require('nodemailer');

const dependency = {};

dependency.getTransporter = (user, password) => {
	// return nodemailer.createTransport({
    //     host: 'smtp.ethereal.email',
    //     port: 587,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //         user: user, // generated ethereal user
    //         pass: password  // generated ethereal password
    //     }
    // });

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
    let mailOptions = {
        from: '"Gerald Bassleer" <info@bassleer.nl>', // sender address
        to: to, //'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
        subject: subject, //'Hello ✔', // Subject line
        //text: 'Hello world?', // plain text body
        html: html//'<b>Hello world?</b>' // html body
    };

    const transporter = dependency.getTransporter("info@bassleer.nl", "abcdefg");
    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}

dependency.testMail = (to, subject, html) => {
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: account.user, // generated ethereal user
                pass: account.pass  // generated ethereal password
            }
        });
    
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
            to: 'jaapweijland@gmail.com', // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world?', // plain text body
            html: '<b>Hello world?</b>' // html body
        };
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
}

module.exports = dependency;