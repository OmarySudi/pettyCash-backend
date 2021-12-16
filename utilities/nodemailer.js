const nodemailer = require("nodemailer")

    const sendConfirmationEmail = (name,email,confirmationCode)=>{
        
        const transport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
            });

        transport.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Please confirm your account",
            html: `<h2>Email Confirmation</h2>
                <h2>Hello ${name}</h2>
                <p>Thank you for opening an account. Please confirm your email by clicking on the following link</p>
                <a href=${process.env.BASE_URL}:${process.env.PORT}/api/v1/auth/confirm/${confirmationCode}> Click here</a>
                </div>`,
        }).catch(err => console.log(err));
    }
  module.exports = {sendConfirmationEmail}