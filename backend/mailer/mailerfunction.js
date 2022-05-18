const nodemailer = require('nodemailer')

require('dotenv').config()

//Create the transport
const transport = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: '465',
    secure: true,
    auth : {
        user: process.env.EMAIL_,
        pass: process.env.EMAIL_PASSWORD
    }
})

//Function to send the mail
const email_sender = (destination_email, email_subject, html) => {

    const options = {
        from: process.env.EMAIL_,
        to: destination_email,
        subject: email_subject,
        html: html
    }

    transport.sendMail(options, (err,info) => {
        if(err){
            console.log(err)
        }
        else{
            console.log(info.response)
        }
    })
}


module.exports = email_sender