const nodemailer = require('nodemailer')

function isEmail(email) {
    var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    
    if(typeof email !== 'string'){
        throw new Error('Email must be of type String')
    }

    if (email !== '' && email.match(emailFormat)) { return true; }
    
    return false;
}
var transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.MAILER_SMTP_SERVER,
    port: process.env.MAILER_SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.MAILER_USER_NAME,
      pass: process.env.MAILER_PASSWORD
    }
  });
  
module.exports = {
    sendConfirmationEmail(email, userId){
        
        if(!isEmail(email)){
            throw new Error('Email is invalid')
        }

        return new Promise((resolve, reject) => {
            transporter.sendMail({
                from: 'meetingmailer@markleethomas.com',
                to: email,
                subject: 'Welcome to SowegaTel! We are glad to have you.',
                html: `<!DOCTYPE html><html><body><h1>Thank you for joining us. We are glad to have you</h1>` +
                      `<a href="http://127.0.0.1:8080/auth/verify/${userId}>Verify</a>` +
                      `</body></html>`
            }, (error) => {
                if(error){
                    reject(new Error(error))
                } else {
                    resolve('Email sent for verification')
                }
            })
        })
    },
    async sendUserConfirmationEmail(email, userId, temporaryPassword){
        return new Promise((resolve, reject) => {
            transporter.sendMail({
                from: 'meetingmailer@markleethomas.com',
                to: email,
                subject: 'Welcome to SowegaTel! We are glad to have you.',
                html: `<!DOCTYPE html><html><body><h1>Hooray! We are glad to have you</h1>` +
                `<html>` + 
                `Username: ${email}` + 
                `Password: ${temporaryPassword}` +
                `<a href="http://127.0.0.1:8080/auth/verify/${userId}">Verify</a></body></html>` 
            }, (error) => {
                if(error){
                    reject()
                } else {
                    resolve('email sent for verification')
                }
            })
        })        
    }
}