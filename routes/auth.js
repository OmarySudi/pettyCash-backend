const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/user")
const nodemailer = require("nodemailer")
const {
    sendConfirmationEmail,
    sendPasswordResetEmail} = require("../utilities/nodemailer")

router.post("/register",async (req,res)=>{

    User.exists({email: req.body.email},async(err,doc)=>{
        if(err){
            console.log(err);
        } else {
            if(doc){

                res.status(200).json({
                    message: "Email is already been used",
                    error: true
                })
            } else {

                const token = jwt.sign({email:req.body.email},process.env.JWT_KEY);
               
                const user = new User({
                    userName: req.body.userName,
                    email: req.body.email,
                    role: req.body.role? req.body.role: "default",
                    password: CryptoJS.AES.encrypt(
                        req.body.password,
                        process.env.PASS_KEY
                      ).toString(),
                    confirmationCode: token
                });

                try{
                    const savedUser = await user.save();
                    const {password, ...otherFields} = savedUser._doc; 
                    res.status(201).json({
                        message: "Account created, kindly login to your Email and verify your account",
                        body:otherFields
                    });

                    sendConfirmationEmail(
                        otherFields.userName,
                        otherFields.email,
                        otherFields.confirmationCode         
                    )  
                   
                } catch(error){
                    console.log("errors")
                    res.status(500).json(
                        {
                            message: "There is an error for this operation",
                            body:error
                        }
                    );
                }

            }
        }
    });

});

router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne(
            {
                email: req.body.email
            }
        );

        !user && res.status(200).json({
            message: "You have supplied wrong email",
            error: true
        });

        if(user.isEmailVerified){

            const hashedPassword = CryptoJS.AES.decrypt(
                user.password,
                process.env.PASS_KEY
            );
    
            const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    
            const inputPassword = req.body.password;
            
            originalPassword != inputPassword && 
                res.status(200).json({
                    message: "You have supplied wrong password",
                    error: true
                });
    
            const accessToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_KEY,
                 {expiresIn:"10d"}
            );
      
            const { password, ...others } = user._doc;  
            res.status(200).json({...others, accessToken});
    
            } else {
                res.status(200).json({
                    message: "Check your email to verify your account!!",
                    error: true
                })
            }
        } catch(err){
            res.status(500).json(
                {
                    message: "There is an error for this operation",
                    body:err
                }
            );
        }
});

router.get("/confirm/:confirmationCode",async(req,res)=>{

    try{
        const user = await User.findOne({
            confirmationCode: req.params.confirmationCode
        });

        user.isEmailVerified = true;
        await user.save();
        res.status(200).json({
            message: "User has been verified"
        })
         
    }catch(err){
        res.status(500).json(
            {
                message: "There is an error for this operation",
                body:err
            }
        );
    }
});

router.post("/send-password-reset",(req,res)=>{
    try{
        sendPasswordResetEmail(req.body.email);
        res.status(200).json({
            message: "The password reset link has been sent to your email"
        })
    }catch(err){
        res.status(500).json({
            message: "There is an internal error"
        })
    }
   
});

router.post("/reset-password",async (req,res)=>{

    
    const password = CryptoJS.AES.encrypt(
                            req.body.password,
                            process.env.PASS_KEY
                        ).toString();
    
    try{

        const user = await User.findOne({
            email: req.body.email
        });

        user.password = password;

        await user.save();

        res.status(200).json({
            message: "Password is successfully changed"
        })

    } catch(err){
        res.status(500).json(
            {
                message: "There is an error for this operation",
                body:err
            }
        );
    }
})

module.exports = router