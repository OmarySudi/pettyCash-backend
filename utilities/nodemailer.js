const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")

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

    const sendPasswordResetEmail = (email)=>{

        const resetCode = jwt.sign({
            email:email
        },process.env.JWT_KEY);

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
            subject: "Resetting Password",
            html: `<h2>Hello</h2>
                <p>Please click the following link to reset your password</p>
                <a href=${process.env.BASE_URL}:${process.env.PORT}/api/v1/auth/confirm/${resetCode}> Click here</a>
                </div>`,
        }).catch(err => console.log(err));
    }

  module.exports = {sendConfirmationEmail,sendPasswordResetEmail}