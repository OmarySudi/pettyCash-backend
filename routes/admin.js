const router = require("express").Router();
const User = require("../models/user")

const {
    verifyTokenAndAdmin,
  } = require("./verifyToken");

router.put("/assign-role/:id",verifyTokenAndAdmin,async (req,res)=>{
    try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        
        if (updatedUser != null) {
          res.status(200).json(
            {
                message: "User has been assigned "+req.body.role+" role",
                body: updatedUser,
            }
          );
        } else {
          res.status(404).json(
            {
                message: "The resource not found",
            }
          );
        }
       
    } catch (err) {
        res.status(500).json(
          {
              message: "There is an error for this operation",
              body:err
          }
        );
    }
});

module.exports = router