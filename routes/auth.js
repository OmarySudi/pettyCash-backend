const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/user")


router.post("/register",async (req,res)=>{

    const user = new User({
        userName: req.body.userName,
        email: req.body.email,
        role: req.body.role? req.body.role: "default",
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_KEY
          ).toString(),
    });
    
    try{
        const savedUser = await user.save();
        const {password, ...otherFields} = savedUser._doc; 
        res.status(201).json({
            message: "You have successfully been registered",
            body:otherFields
        });
    } catch(error){
        console.log("errors")
        res.status(500).json(
            {
                message: "There is an error for this operation",
                body:error
            }
        );
    }
});

router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne(
            {
                userName: req.body.userName
            }
        );
        
        !user && res.status(401).json({message: "You have supplied wrong userName"});

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