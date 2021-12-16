const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/user")
const nodemailer = require("nodemailer")
const {sendConfirmationEmail} = require("../utilities/nodemailer")


router.post("/register",async (req,res)=>{

    User.exists({email: req.body.email},async(err,doc)=>{
        if(err){
            console.log(err);

        } else {
            if(doc){

                res.status(500).json({
                    message: "Email is already been used"
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
                        message: "You have been registered! Check your email for confirmation",
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

        !user && res.status(401).json({message: "You have supplied wrong email"});

        if(user.isEmailVerified){

            const hashedPassword = CryptoJS.AES.decrypt(
                user.password,
                process.env.PASS_KEY
            );
    
            const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    
            const inputPassword = req.body.password;
            
            originalPassword != inputPassword && 
                res.status(401).json({message: "You have supplied wrong password"});
    
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
                res.status(401).json({
                    message: "Check your email to verify your account!!"
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

// router.put("/forgot-password/:id", async (req,res)=>{

//     console.log("it passes here1");

//     // const user = User.findById({id:req.params.id});

//     // console.log("it passes here2");
//     // console.log(user);

//     // !user && res.status(500).json("The user trying to change password is not found");

//     if(req.body.password != req.body.confirmPassword)
//         res.status(500).json("Passwords should match");
    
//     const hashedPassword = CryptoJS.AES.encrypt(
//                                 req.body.password,
//                                 process.env.PASS_KEY
//                             ).toString();

//     console.log(hashedPassword);
//     try{
//         const updatedUser = User.findByIdAndUpdate(
//             req.params.id,
//             {
//                 $set: { password:hashedPassword}
//             },
//             { new: true}
//             )

//         res.status(200).json({
//             message: "Your password has been updated",
//             body: updatedUser
//         });
//     }
//     catch(err){
//         res.status(500).json(err);
//     }
// })


module.exports = router